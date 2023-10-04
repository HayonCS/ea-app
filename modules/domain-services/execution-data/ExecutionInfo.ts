import { ItemResult } from "client/graphql/types.gen";

export type ExecutionInfo = {
  //! Store the web identifier.
  webId: string;

  //! Store the current state we are waiting on.
  state: string;

  //! The testplan.
  testplan: string;

  //! BreakPoint identifiers.
  breakPointIds: Array<string>;

  //! Executable identifiers.
  ids: Array<string>;

  //! Container of item results (currently running).
  items: Array<ItemResult>;

  //! The station that is selected.
  stationName: string;

  //! The part number that is selected.
  partNumber: string;

  //! Obtain the computer name.
  computerName: string;

  //! The test plan name.
  testplanName: string;

  //! Store the Revision.
  revision: string;
};
