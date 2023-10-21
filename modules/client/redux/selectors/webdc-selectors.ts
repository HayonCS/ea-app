import { State } from "../reducers";

export const WebdcSelectors = {
  partData: (state: State) => state.Webdc.partData,
  assetData: (state: State) => state.Webdc.assetData,
};
