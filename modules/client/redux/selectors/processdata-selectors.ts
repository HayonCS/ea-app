import { State } from "../reducers";

export const ProcessDataSelectors = {
  partData: (state: State) => state.ProcessData.partData,
  assetData: (state: State) => state.ProcessData.assetData,
};
