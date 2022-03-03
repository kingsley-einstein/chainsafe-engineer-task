import * as IPFSCore from "ipfs-core";
import fs from "fs";
import invariant from "tiny-invariant";
import path from "path";

interface ConstrainedIPFSType {
  path: string;
  fileName: string;
}

export class IPFS {
  client: IPFSCore.IPFS;

  constructor(client: IPFSCore.IPFS) {
    this.client = client;
  }

  public static async initialize(): Promise<IPFS> {
    const c = await IPFSCore.create();
    return Promise.resolve(new IPFS(c));
  }

  public fileFromPath<Type extends ConstrainedIPFSType>(
    arg: Type
  ): Promise<IPFSCore.CID> {
    invariant(
      fs.existsSync(path.join(arg.path, arg.fileName)),
      "File does not exist"
    );
    invariant(
      fs.lstatSync(path.join(arg.path, arg.fileName)).isFile(),
      "Not a file"
    );
    return new Promise((resolve, reject) => {
      this.client
        .add({
          path: path.join(arg.path, arg.fileName),
          content: fs
            .readFileSync(path.join(arg.path, arg.fileName))
            .toString("base64"),
        })
        .then((val) => resolve(val.cid))
        .catch(reject);
    });
  }

  public async close(): Promise<void> {
    await this.client.stop();
  }
}
