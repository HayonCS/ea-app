import { recordInfo } from "atomic-object/records/knex";
import {
  KnexRecordInfo,
  UnboundRepositoryBase,
} from "atomic-object/records/knex";
import { SavedSnRecord, UnsavedSnRecord } from "./sn-webdc";
import { SavedAssetRecord, UnsavedAssetRecord } from "./asset-webdc";
import { SavedPnRecord, UnsavedPnRecord } from "./pn-webdc";

export function RepositoryBase<Rec extends KnexRecordInfo>(recordType: Rec) {
  return UnboundRepositoryBase<Rec>(recordType);
}

export const SnRecord = recordInfo<UnsavedSnRecord, SavedSnRecord, "SnID">(
  "SnWebDC",
  ["SnID"]
);

export const PnRecord = recordInfo<UnsavedPnRecord, SavedPnRecord, "PnID">(
  "PnWebDC",
  ["PnID"]
);

export const AssetRecord = recordInfo<
  UnsavedAssetRecord,
  SavedAssetRecord,
  "AssetID"
>("AssetWebDC", ["AssetID"]);
