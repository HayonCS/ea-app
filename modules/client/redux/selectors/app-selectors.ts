import { State } from "../reducers";

export const AppSelectors = {
  assetList: (state: State) => state.App.assetInfo,
  currentUserAppData: (state: State) => state.App.currentUserAppData,
  currentUserInfo: (state: State) => state.App.currentUserInfo,
  currentUserTeamInfo: (state: State) => state.App.currentUserTeamInfo,
  employeeActiveDirectory: (state: State) => state.App.employeeActiveDirectory,
};
