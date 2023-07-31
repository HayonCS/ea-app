import { UserData, EmployeeInfoGentex } from "../utils/DataTypes";

type AppState = {
  assetList?: string[];
  currentUser?: string;
  userData?: UserData;
  userGentex?: EmployeeInfoGentex;
  userTeamGentex?: EmployeeInfoGentex[];
  employeeDirectoryGentex?: EmployeeInfoGentex[];
};

type AppAction = {
  type: string;
  assetList?: string[];
  currentUser?: string;
  userData?: UserData;
  userGentex?: EmployeeInfoGentex;
  userTeamGentex?: EmployeeInfoGentex[];
  employeeDirectoryGentex?: EmployeeInfoGentex[];
};

type DispatchType = (args: AppAction) => AppAction;
