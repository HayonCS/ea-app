import { recordInfo } from "atomic-object/records/knex";
import {
  KnexRecordInfo,
  UnboundRepositoryBase,
} from "atomic-object/records/knex";
import { SavedComboDataRecord, UnsavedComboDataRecord } from "./combodata";

export function RepositoryBase<Rec extends KnexRecordInfo>(recordType: Rec) {
  return UnboundRepositoryBase<Rec>(recordType);
}

export const ComboDataRecord = recordInfo<
  UnsavedComboDataRecord,
  SavedComboDataRecord,
  "ComboDataID"
>("ComboData", ["ComboDataID"]);
