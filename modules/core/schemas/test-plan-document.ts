import * as DateTimeIso from "core/date-time-iso";

import {
  Elements,
  Structure,
  TestPlanDocument,
  TestPlanDocumentDocumentElementPropertyBaseAny,
} from "core/schemas/test-plan-document.gen";

import { TestPlanConfiguration } from "core/schemas/test-plan-configuration.gen";
import { ValueOf } from "core/types";

export type TestPlanDocumentElement = ValueOf<Elements>;
export type ElementProperty = TestPlanDocumentDocumentElementPropertyBaseAny;
export type TestPlanDocumentElementType = TestPlanDocumentElement["type"];

export const TestPlanDocumentElementType: {
  [k in TestPlanDocumentElementType]: string;
} = {
  bindingCall: "bindingCall",
  configuration: "configuration",
  evaluation: "evaluation",
  group: "group",
  managedPartNumber: "managedPartNumber",
  requirements: "requirements",
  station: "station",
  testPlan: "testPlan",
  tests: "tests",
  universalPartNumber: "universalPartNumber",
  legacyPartNumber: "legacyPartNumber",
  failureMode: "failureMode",
  function: "function",
  fixturing: "fixturing",
  requirement: "requirement",
  feature: "feature",
  flow: "flow",
};

export type TestPlanDocumentStructuralItem = ValueOf<Structure>;

export interface TestPlanMetadata {
  revisionLabel: string;
  commitMessage: string;
  softwareVersion: string;
  domain?: string;
  revisionNumber?: number | null;
  modificationTime?: DateTimeIso.Type;
  lastUser?: string;
  revisionLatest?: boolean;
}

export interface ConfigMetaData {
  testerType: string;
  testPlanName: string;
  revisionNumber: number;
  configIsValid: boolean;
  documentIsValid: boolean;
  userName: string;
  commitMessage: string;
}

export interface TestPlanDocumentResponse {
  document: TestPlanDocument;
  metadata: TestPlanMetadata;
  configuration: TestPlanConfiguration | undefined;
}

export { TestPlanDocument };
