import * as Hexagonal from "atomic-object/hexagonal";
import { RepositoriesBase } from "atomic-object/records/knex";
import { SnRecordRepository } from "./sn-webdc";
import { AssetRecordRepository } from "./asset-webdc";
import { PnRecordRepository } from "./pn-webdc";

export const repositoriesAdapter = (ctx: Hexagonal.Context) => {
  return new Repositories(ctx);
};
export const RepositoriesPort = Hexagonal.port<Repositories, "repos">("repos");
export type RepositoriesPort = typeof RepositoriesPort;
export class Repositories extends RepositoriesBase {
  pn = new PnRecordRepository(this.ctx);
  sn = new SnRecordRepository(this.ctx);
  asset = new AssetRecordRepository(this.ctx);
}
