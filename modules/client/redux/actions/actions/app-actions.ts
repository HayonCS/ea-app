import { ActionType } from "client/redux/types";
import { UserInformation } from "core/schemas/user-information.gen";
import { UserAppData } from "core/schemas/user-app-data.gen";

export const AppActions = {
  assetList: (assetList: string[]) =>
    ({
      type: "App/assetList",
      payload: {
        assetList,
      },
    } as const),
  currentUserAppData: (userData: UserAppData) =>
    ({
      type: "App/currentUserAppData",
      payload: {
        userData,
      },
    } as const),
  currentUserInfo: (userInfo: UserInformation) =>
    ({
      type: "App/currentUserInfo",
      payload: {
        userInfo,
      },
    } as const),
  currentUserTeamInfo: (teamInfo: UserInformation[]) =>
    ({
      type: "App/userTeamGentex",
      payload: {
        teamInfo,
      },
    } as const),
  employeeActiveDirectory: (activeDirectory: UserInformation[]) =>
    ({
      type: "App/employeeActiveDirectory",
      payload: {
        activeDirectory,
      },
    } as const),
};

export type AppActions = ActionType<typeof AppActions>;
