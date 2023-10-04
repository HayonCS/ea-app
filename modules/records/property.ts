import { ElementID, PropertyType } from "records/element";
import { ElementRecord, PropertyRecord } from "records/core";

import { Flavor } from "helpers";
import { RepositoryBase } from "records/core";
import { loaderOf } from "atomic-object/records/knex";

export type PropertyID = Flavor<number, "Property id">;

export interface UnsavedPropertyRecord {
  Value: string | boolean | number;
  Name: string;
  ElementID: ElementID;
  PropertyTypeID: PropertyType;
  Description: string;
  ModificationTime: string;
  UserID: number; // TBD UserID
}

export interface SavedPropertyRecord extends UnsavedPropertyRecord {
  PropertyID: PropertyID;
}

export class PropertyRecordRepository extends RepositoryBase(PropertyRecord) {
  forElement = loaderOf(this).allBelongingTo(ElementRecord, "ElementID");
}
