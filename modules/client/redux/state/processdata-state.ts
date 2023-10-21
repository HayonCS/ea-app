//Note: Any state added to DocumentState will create entries in the undox stack when changes are dispatched.

import { AssetRow, PnRow } from "records/processdata";

//Limit this state to things users will want to undo/redo only.
export type ProcessDataState = {
  partData: PnRow[];
  assetData: AssetRow[];
};

export const initialProcessDataState: ProcessDataState = {
  partData: [],
  assetData: [],
};
