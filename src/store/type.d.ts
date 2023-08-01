import { UserData, EmployeeInfoGentex, AlertType } from "../utils/DataTypes";

type AppState = {
  alerts?: AlertType[];
  assetList?: string[];
  currentUser?: string;
  userData?: UserData;
  userGentex?: EmployeeInfoGentex;
  userTeamGentex?: EmployeeInfoGentex[];
  employeeDirectoryGentex?: EmployeeInfoGentex[];
};

type AppAction = {
  type: string;
  alert?: AlertType;
  assetList?: string[];
  currentUser?: string;
  userData?: UserData;
  userGentex?: EmployeeInfoGentex;
  userTeamGentex?: EmployeeInfoGentex[];
  employeeDirectoryGentex?: EmployeeInfoGentex[];
};

type DispatchType = (args: AppAction) => AppAction;
