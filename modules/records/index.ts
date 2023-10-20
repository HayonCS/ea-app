import * as Hexagonal from "atomic-object/hexagonal";
import { RepositoriesBase } from "atomic-object/records/knex";
import { WebDCRecordRepository } from "./webdc";

export const repositoriesAdapter = (ctx: Hexagonal.Context) => {
  return new Repositories(ctx);
};
export const RepositoriesPort = Hexagonal.port<Repositories, "repos">("repos");
export type RepositoriesPort = typeof RepositoriesPort;
export class Repositories extends RepositoriesBase {
  webdc = new WebDCRecordRepository(this.ctx);
}
