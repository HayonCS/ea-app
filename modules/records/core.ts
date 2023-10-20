import { recordInfo } from "atomic-object/records/knex";
import {
  KnexRecordInfo,
  UnboundRepositoryBase,
} from "atomic-object/records/knex";
import { SavedWebDCRecord, UnsavedWebDCRecord } from "./webdc";

export function RepositoryBase<Rec extends KnexRecordInfo>(recordType: Rec) {
  return UnboundRepositoryBase<Rec>(recordType);
}

export const WebDCRecord = recordInfo<
  UnsavedWebDCRecord,
  SavedWebDCRecord,
  "WebDCID"
>("WebDC", ["WebDCID"]);
