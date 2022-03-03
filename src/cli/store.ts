import Web3 from "web3";
import { Wallet } from "@ethersproject/wallet";
import { Transaction } from "@ethereumjs/tx";
import Common, { Chain } from "@ethereumjs/common";
import axios from "axios";
import { IPFS } from "../ipfs";
import { ContractInteractionModule } from "../contracts/interactionModule";
import * as constants from "../contracts/constants";
import abi from "../contracts/ABI.json";

const web3 = new Web3(constants.WEB3_PROVIDER);
const contract = new web3.eth.Contract(<any>abi, constants.ADDRESS);

const rpcRequest = (params: {
  method: string;
  id: number | string;
  jsonrpc: "2.0";
  params: Array<string | string[] | object>;
}) => {
  return new Promise((resolve, reject) => {
    axios.post(constants.WEB3_PROVIDER, params).then((res) => {
      if (res.data.result) resolve(res.data.result);
      else reject(new Error(res.data.error.message));
    });
  });
};

export const pinAndStore = async (
  pk: string,
  file: { location: string; name: string }
): Promise<void> => {
  const ipfs = await IPFS.initialize();
  const cid = await ipfs.fileFromPath({
    fileName: file.name,
    path: file.location,
  });
  const interactionModule = new ContractInteractionModule();
  const encodedABI = interactionModule.callStore(cid.toString(), contract);
  const walletFromPk = new Wallet(pk);

  const nonce = await web3.eth.getTransactionCount(walletFromPk.address);

  const tx = Transaction.fromTxData(
    {
      gasPrice: `0x${parseInt((1 * 10 ** 9).toString()).toString(16)}`,
      gasLimit: `0x${(100000).toString(16)}`,
      to: constants.ADDRESS,
      value: "0x0",
      data: encodedABI,
      nonce,
    },
    { common: new Common({ chain: Chain.Goerli }) }
  );
  const signedTx = tx.sign(Buffer.from(pk, "hex"));

  const serializedTx = `0x${signedTx.serialize().toString("hex")}`;

  // Switched to direct RPC request because for some reason web3.eth.sendSignedTransaction keeps on running. Also, the transaction is in a pending state for long on the explorer
  const publishedTx = await rpcRequest({
    method: "eth_sendRawTransaction",
    id: 1,
    jsonrpc: "2.0",
    params: [serializedTx],
  });

  console.log("Tx published: ", publishedTx);
  await ipfs.close();
};

export const logAllStoredEvents = async (ethAddress: string): Promise<void> => {
  const interactionModule = new ContractInteractionModule();
  const ev = await interactionModule.getAllPastStoredEventForAddress(
    ethAddress,
    contract
  );
  console.log(ev);
};
