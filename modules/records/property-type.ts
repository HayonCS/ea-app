import { Flavor } from "helpers";
import { PropertyTypeRecord } from "records/core";
import { RepositoryBase } from "records/core";

export type PropertyID = Flavor<number, "Property id">;

export interface UnsavedPropertyTypeRecord {
  Type: string;
}

export interface SavedPropertyTypeRecord extends UnsavedPropertyTypeRecord {
  PropertyTypeID: PropertyID;
}

export class PropertyTypeRecordRepository extends RepositoryBase(
  PropertyTypeRecord
) {}
