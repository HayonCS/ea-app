import { ActionType } from "client/redux/types";
import { UserInformation } from "core/schemas/user-information.gen";
import { UserAppData } from "core/schemas/user-app-data.gen";
import { AssetInfo, LineOperationPart } from "rest-endpoints/mes-bi/mes-bi";

export const AppActions = {
  assetList: (assetList: AssetInfo[]) =>
    ({
      type: "App/assetList",
      payload: {
        assetList,
      },
    } as const),
  cycleTimeInfo: (cycleTimeInfo: LineOperationPart[]) =>
    ({
      type: "App/cycleTimeInfo",
      payload: {
        cycleTimeInfo,
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
  clearCurrentUser: () =>
    ({
      type: "App/clearCurrentUser",
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
