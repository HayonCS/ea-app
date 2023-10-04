import * as _ from "lodash-es";

import { ElementRecord, TestPlanRecord } from "records/core";

import { Flavor } from "helpers";
import { RepositoryBase } from "records/core";
import { loaderOf } from "atomic-object/records/knex";

export type ElementID = Flavor<number, "Element id">;

export enum ElementType {
  TestPlan = 1,
  Requirements = 2,
  Feature = 3,
  Function = 4,
  Requirement = 5,
  FailureMode = 6,
  Tests = 7,
  Station = 8,
  PartNumber = 9,
  Group = 10,
  BindingCall = 11,
  Evaluation = 12,
  Fixturing = 13,
  Fixture = 14,
  Hardware = 15,
  Connector = 16,
  Pin = 17,
  Connection = 18,
  Flow = 19,
  Plant = 20,
  Process = 21,
  Line = 22,
  Tester = 23,
}

export enum PropertyType {
  bool = 1,
  double = 2,
  int = 3,
  real = 4,
  string = 5,
  variant = 6,
  builtin = 7,
  slot = 8,
  import = 9,
  function = 10,
}

export interface UnsavedElementRecord {
  Identifier: string;
  Description: string;
  Sequence: number;
  TestPlanID: number;
  ElementTypeID: ElementType;
  ParentElementID: number | null;
  ModificationTime: string;
  UserID: number;
}

export interface SavedElementRecord extends UnsavedElementRecord {
  ElementID: ElementID;
}

export class ElementRecordRepository extends RepositoryBase(ElementRecord) {
  forTestPlan = loaderOf(this).allBelongingTo(TestPlanRecord, "TestPlanID");

  getNextElementID = async () => {
    const identityResult: { currentIdentity: number } | undefined = _.first(
      await this.db.raw(`SELECT IDENT_CURRENT('Elements') AS currentIdentity`)
    );

    if (!identityResult) {
      throw new Error(`Unable to determine Elements record identity`);
    }

    const identity = identityResult.currentIdentity;

    return identity + 1;
  };
}
