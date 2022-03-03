import { Contract } from "web3-eth-contract";
import { Registry } from "./registry";

export class ContractInteractionModule {
  callStore(cid: string, contract: Contract): string {
    const c = <Registry<"store", "CIDStored">>contract;
    return c.methods.store(cid).encodeABI();
  }

  getAllPastStoredEventForAddress(ethAddress: string, contract: Contract) {
    const c = <Registry<"store", "CIDStored">>contract;
    return c.getPastEvents("CIDStored", {
      filter: { owner: ethAddress },
      fromBlock: 0,
      toBlock: "latest",
    });
  }
}
