import * as actionTypes from "./actionTypes";
import { AppAction, AppState } from "./type";

export const initialState: AppState = { assetList: [] };

const reducer = (
  state: AppState = initialState,
  action: AppAction
): AppState => {
  switch (action.type) {
    case actionTypes.SET_ASSET_LIST:
      const assetList = action.assetList;
      return {
        ...state,
        assetList: assetList,
      };
    case actionTypes.SET_CURRENT_USER:
      const user = action.currentUser;
      return {
        ...state,
        currentUser: user,
      };
    case actionTypes.SET_EMPLOYEE_DIRECTORY:
      const employeeDirectory = action.employeeDirectoryGentex;
      return {
        ...state,
        employeeDirectoryGentex: employeeDirectory,
      };
    case actionTypes.UPDATE_USER_DATA:
      const userData = action.userData;
      return {
        ...state,
        userData: userData,
      };
    case actionTypes.UPDATE_USER_GENTEX:
      const userGentex = action.userGentex;
      return {
        ...state,
        userGentex: userGentex,
      };
    case actionTypes.UPDATE_TEAM_GENTEX:
      const userTeamGentex = action.userTeamGentex;
      return {
        ...state,
        userTeamGentex: userTeamGentex,
      };
  }
  return state;
};

export default reducer;
