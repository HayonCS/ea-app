import { initialAppState } from "../state/app-state";
import { MainReducer } from "./main-reducer";
import { InitialState } from "client/redux/state";

export const appReducer: MainReducer<"App"> = (
  state = InitialState.App,
  action
): typeof state => {
  switch (action.type) {
    case "App/assetList": {
      const { assetList } = action.payload;
      return {
        ...state,
        assetInfo: assetList,
      };
    }
    case "App/cycleTimeInfo": {
      const { cycleTimeInfo } = action.payload;
      return {
        ...state,
        cycleTimeInfo: cycleTimeInfo,
      };
    }
    case "App/currentUserAppData": {
      const { userData } = action.payload;
      return {
        ...state,
        currentUserAppData: userData,
      };
    }
    case "App/currentUserInfo": {
      const { userInfo } = action.payload;
      return {
        ...state,
        currentUserInfo: userInfo,
      };
    }
    case "App/clearCurrentUser": {
      return {
        ...state,
        currentUserInfo: { ...initialAppState.currentUserInfo },
      };
    }
    case "App/userTeamGentex": {
      const { teamInfo } = action.payload;
      return {
        ...state,
        currentUserTeamInfo: teamInfo,
      };
    }
    case "App/employeeActiveDirectory": {
      const { activeDirectory } = action.payload;
      return {
        ...state,
        employeeActiveDirectory: activeDirectory,
      };
    }
    default:
      return state;
  }
};
