import * as Hexagonal from "atomic-object/hexagonal";

import { ContextInfoRepository } from "records/disable-constraints";
import { ElementRecordRepository } from "records/element";
import { ElementTypeRecordRepository } from "records/element-type";
import { LogRecordRepository } from "records/log";
import { PropertyRecordRepository } from "records/property";
import { PropertyTypeRecordRepository } from "records/property-type";
import { RepositoriesBase } from "atomic-object/records/knex";
import { TestPlanRecordRepository } from "records/test-plan";
import { UserRecordRepository } from "records/user";

export const repositoriesAdapter = (ctx: Hexagonal.Context) => {
  return new Repositories(ctx);
};
export const RepositoriesPort = Hexagonal.port<Repositories, "repos">("repos");
export type RepositoriesPort = typeof RepositoriesPort;
export class Repositories extends RepositoriesBase {
  testPlans = new TestPlanRecordRepository(this.ctx);
  elements = new ElementRecordRepository(this.ctx);
  properties = new PropertyRecordRepository(this.ctx);
  propertyTypes = new PropertyTypeRecordRepository(this.ctx);
  elementTypes = new ElementTypeRecordRepository(this.ctx);
  users = new UserRecordRepository(this.ctx);
  logs = new LogRecordRepository(this.ctx);
  contextInfo = new ContextInfoRepository(this.ctx);
}
