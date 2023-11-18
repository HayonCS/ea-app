import { State } from "../reducers";

export const ComboDataSelectors = {
  partData: (state: State) => state.ComboData.partData,
  assetData: (state: State) => state.ComboData.assetData,
};
