import { AnalyzerResult } from "client/graphql/types.gen";
import { ConfigMetaData, TestPlanMetadata } from "./test-plan-document";

type JobId<TType> = {
  jobType: TType;
  uuid: string;
  metaData?: TestPlanMetadata;
  configMetaData?: ConfigMetaData;
};

export type QueuedJob<TType> = JobId<TType> & { status: "Queued" };
export type ActiveJob<TType> = JobId<TType> & { status: "Active" };
export type CompleteJob<TType, TOutcome> = JobId<TType> & {
  status: "Complete";
  outcome: TOutcome;
};
export type FailedJob<TType> = JobId<TType> & {
  status: "Failed";
  error: string;
};

export type JobType<TType, TOutcome> =
  | QueuedJob<TType>
  | ActiveJob<TType>
  | CompleteJob<TType, TOutcome>
  | FailedJob<TType>;

export type SaveTestPlanDocumentJob = JobType<
  "SaveTestPlanDocument",
  { name: string; metaData: TestPlanMetadata }
>;

export type SaveTestPlanConfiguration = JobType<
  "SaveTestPlanConfiguration",
  { revisionNumber: number }
>;

export type AnalyzeSavedTestPlan = JobType<
  "AnalyzeSavedTestPlan",
  {
    results: AnalyzerResult[];
  }
>;

export type Job =
  | SaveTestPlanDocumentJob
  | SaveTestPlanConfiguration
  | AnalyzeSavedTestPlan;

export type JobIdentifier = Pick<Job, "jobType" | "uuid">;

export type JobStatus = { [uuid: string]: Job };
