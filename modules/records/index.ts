import * as Hexagonal from "atomic-object/hexagonal";
import { RepositoriesBase } from "atomic-object/records/knex";
import {
  AssetComboRecordRepository,
  PnComboRecordRepository,
  SnComboRecordRepository,
} from "./combodata";
import {
  AssetProcessRecordRepository,
  PnProcessRecordRepository,
  SnProcessRecordRepository,
} from "./processdata";
import { UserRecordRepository } from "./user";

export const repositoriesAdapter = (ctx: Hexagonal.Context) => {
  return new Repositories(ctx);
};
export const RepositoriesPort = Hexagonal.port<Repositories, "repos">("repos");
export type RepositoriesPort = typeof RepositoriesPort;
export class Repositories extends RepositoriesBase {
  combodata = {
    pn: new PnComboRecordRepository(this.ctx),
    sn: new SnComboRecordRepository(this.ctx),
    asset: new AssetComboRecordRepository(this.ctx),
  };
  processdata = {
    pn: new PnProcessRecordRepository(this.ctx),
    sn: new SnProcessRecordRepository(this.ctx),
    asset: new AssetProcessRecordRepository(this.ctx),
  };
  users = new UserRecordRepository(this.ctx);
}
