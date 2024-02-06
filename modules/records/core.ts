import { recordInfo } from "atomic-object/records/knex";
import {
  KnexRecordInfo,
  UnboundRepositoryBase,
} from "atomic-object/records/knex";
import { SavedComboDataRecord, UnsavedComboDataRecord } from "./combodata";
import {
  SavedProcessDataRecord,
  UnsavedProcessDataRecord,
} from "./processdata";
import { UnsavedUserRecord, SavedUserRecord } from "./user";

export function RepositoryBase<Rec extends KnexRecordInfo>(recordType: Rec) {
  return UnboundRepositoryBase<Rec>(recordType);
}

export const ComboDataRecord = recordInfo<
  UnsavedComboDataRecord,
  SavedComboDataRecord,
  "ComboDataID"
>("ComboData", ["ComboDataID"]);

export const ProcessDataRecord = recordInfo<
  UnsavedProcessDataRecord,
  SavedProcessDataRecord,
  "ProcessDataID"
>("ProcessData", ["ProcessDataID"]);

export const UserRecord = recordInfo<
  UnsavedUserRecord,
  SavedUserRecord,
  "UserID"
>("Users", ["UserID"]);
