import { State } from "../reducers";

export const AppSelectors = {
  assetList: (state: State) => state.App.assetInfo,
  cycleTimeInfo: (state: State) => state.App.cycleTimeInfo,
  currentUserAppData: (state: State) => state.App.currentUserAppData,
  currentUserInfo: (state: State) => state.App.currentUserInfo,
  employeeActiveDirectory: (state: State) => state.App.employeeActiveDirectory,
};
