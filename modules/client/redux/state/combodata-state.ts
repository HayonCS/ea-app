//Note: Any state added to DocumentState will create entries in the undox stack when changes are dispatched.

import { AssetRow, PnRow } from "records/combodata";

//Limit this state to things users will want to undo/redo only.
export type ComboDataState = {
  partData: PnRow[];
  assetData: AssetRow[];
};

export const initialComboDataState: ComboDataState = {
  partData: [],
  assetData: [],
};
