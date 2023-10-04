import { ElementTypeRecord } from "records/core";

import { Flavor } from "helpers";
import { RepositoryBase } from "records/core";

export type ElementID = Flavor<number, "Element id">;

export interface UnsavedElementTypeRecord {
  Type: string;
}

export interface SavedElementTypeRecord extends UnsavedElementTypeRecord {
  ElementTypeID: ElementID;
}

export class ElementTypeRecordRepository extends RepositoryBase(
  ElementTypeRecord
) {}
