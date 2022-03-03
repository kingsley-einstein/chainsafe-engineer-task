import { EventEmitter } from "stream";
import { Contract, ContractSendMethod } from "web3-eth-contract";

export class Registry<
  T extends "store",
  E extends "CIDStored"
> extends Contract {
  methods: { [key in T]: (...args: any[]) => ContractSendMethod } | undefined;
  events: { [key in E]: (...args: any[]) => EventEmitter } | undefined;
}
