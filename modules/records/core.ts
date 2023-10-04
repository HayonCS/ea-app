import { SavedElementRecord, UnsavedElementRecord } from "records/element";
import {
  SavedElementTypeRecord,
  UnsavedElementTypeRecord,
} from "records/element-type";
import { SavedLogRecord, UnsavedLogRecord } from "records/log";
import { SavedPropertyRecord, UnsavedPropertyRecord } from "records/property";
import {
  SavedPropertyTypeRecord,
  UnsavedPropertyTypeRecord,
} from "records/property-type";
import { SavedTestPlanRecord, UnsavedTestPlanRecord } from "records/test-plan";
import { SavedUserRecord, UnsavedUserRecord } from "records/user";

import { recordInfo } from "atomic-object/records/knex";

import {
  KnexRecordInfo,
  UnboundRepositoryBase,
} from "atomic-object/records/knex";

export function RepositoryBase<Rec extends KnexRecordInfo>(recordType: Rec) {
  return UnboundRepositoryBase<Rec>(recordType);
}

export const TestPlanRecord = recordInfo<
  UnsavedTestPlanRecord,
  SavedTestPlanRecord,
  "TestPlanID"
>("TestPlans", ["TestPlanID"]);

export const ElementRecord = recordInfo<
  UnsavedElementRecord,
  SavedElementRecord,
  "ElementID"
>("Elements", ["ElementID"]);

export const PropertyRecord = recordInfo<
  UnsavedPropertyRecord,
  SavedPropertyRecord,
  "PropertyID"
>("Properties", ["PropertyID"]);

export const PropertyTypeRecord = recordInfo<
  UnsavedPropertyTypeRecord,
  SavedPropertyTypeRecord,
  "PropertyTypeID"
>("PropertyTypes", ["PropertyTypeID"]);

export const ElementTypeRecord = recordInfo<
  UnsavedElementTypeRecord,
  SavedElementTypeRecord,
  "ElementTypeID"
>("ElementTypes", ["ElementTypeID"]);

export const UserRecord = recordInfo<
  UnsavedUserRecord,
  SavedUserRecord,
  "UserID"
>("Users", ["UserID"]);

export const LogRecord = recordInfo<UnsavedLogRecord, SavedLogRecord, "LogID">(
  "Logs",
  ["LogID"]
);
