import { LogRecord, TestPlanRecord } from "records/core";
import { Flavor } from "helpers";
import { RepositoryBase } from "records/core";
import { TestPlanID } from "records/test-plan";
import { UserID } from "records/user";
import { loaderOf } from "atomic-object/records/knex";

export type LogID = Flavor<number, "Log id">;

export interface UnsavedLogRecord {
  UserID: UserID;
  TimeDateStamp: string;
  Message: string;
  TestPlanID: TestPlanID;
}

export interface SavedLogRecord extends UnsavedLogRecord {
  LogID: LogID;
}

export class LogRecordRepository extends RepositoryBase(LogRecord) {
  forTestPlan = loaderOf(this).oneBelongingTo(TestPlanRecord, "TestPlanID");
}
