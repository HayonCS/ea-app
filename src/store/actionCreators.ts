import { EmployeeInfoGentex, UserData } from "../utils/DataTypes";
import * as actionTypes from "./actionTypes";
import { AppAction, DispatchType } from "./type";

export function setAssetList(list: string[]) {
  const action: AppAction = {
    type: actionTypes.SET_ASSET_LIST,
    assetList: list,
  };

  return dispatchRequest(action);
}

export function setCurrentUser(user: string) {
  const action: AppAction = {
    type: actionTypes.SET_CURRENT_USER,
    currentUser: user,
  };

  return dispatchRequest(action);
}

export function updateUserData(userData: UserData) {
  const action: AppAction = {
    type: actionTypes.UPDATE_USER_DATA,
    userData: userData,
  };

  return dispatchRequest(action);
}

export function updateUserGentex(userGentex: EmployeeInfoGentex) {
  const action: AppAction = {
    type: actionTypes.UPDATE_USER_GENTEX,
    userGentex: userGentex,
  };
  return dispatchRequest(action);
}

export function updateTeamGentex(teamGentex: EmployeeInfoGentex[]) {
  const action: AppAction = {
    type: actionTypes.UPDATE_TEAM_GENTEX,
    userTeamGentex: teamGentex,
  };
  return dispatchRequest(action);
}

export function dispatchRequest(action: AppAction) {
  return (dispatch: DispatchType) => {
    dispatch(action);
  };
}
