import { LumenData, UserData, EmployeeInfoGentex } from "../utils/DataTypes";

type AppState = {
  assetList?: string[];
  currentUser?: string;
  userData?: UserData;
  userGentex?: EmployeeInfoGentex;
  userTeamGentex?: EmployeeInfoGentex[];
  userLumen?: LumenData;
};

type AppAction = {
  type: string;
  assetList?: string[];
  currentUser?: string;
  userData?: UserData;
  userGentex?: EmployeeInfoGentex;
  userTeamGentex?: EmployeeInfoGentex[];
};

type DispatchType = (args: AppAction) => AppAction;
