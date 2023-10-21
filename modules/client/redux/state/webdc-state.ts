//Note: Any state added to DocumentState will create entries in the undox stack when changes are dispatched.

import { AssetRow } from "records/asset-webdc";
import { PnRow } from "records/pn-webdc";

//Limit this state to things users will want to undo/redo only.
export type WebdcState = {
  partData: PnRow[];
  assetData: AssetRow[];
};

export const initialWebdcState: WebdcState = {
  partData: [],
  assetData: [],
};
