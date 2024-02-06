import { UserAppData } from "core/schemas/user-app-data.gen";
import { UserInformation } from "core/schemas/user-information.gen";
import {
  AssetInfo,
  LineConfiguration,
  LineOperationPart,
} from "rest-endpoints/mes-bi/mes-bi";
import { BomRouting } from "rest-endpoints/mes-bom/mes-bom";

//Note: Any state added to DocumentState will create entries in the undox stack when changes are dispatched.
//Limit this state to things users will want to undo/redo only.
export type AppState = {
  assetInfo: AssetInfo[];
  cycleTimeInfo: LineOperationPart[];
  bomRoutings: BomRouting[];
  lineConfigurations: LineConfiguration[];
  currentUserAppData: UserAppData;
  currentUserInfo: UserInformation;
  employeeActiveDirectory: UserInformation[];
};

export const initialAppState: AppState = {
  assetInfo: [],
  cycleTimeInfo: [],
  bomRoutings: [],
  lineConfigurations: [],
  currentUserAppData: {
    orgCode: 0,
    assetList: [],
    operators: [],
  },
  currentUserInfo: {
    employeeId: "00000",
    firstName: "John",
    lastName: "Lock",
    username: "John.Lock",
    email: "john.lock@gentex.com",
    cellPhone: "+16167721590",
    workPhone: "6167721800",
    location: "James St",
    locationId: 1025,
    shift: 1,
    jobTitle: "Software Engineer IX",
    managerEmployeeId: "12459",
    level: 0,
    erphrLocation: {
      locationId: 48602,
      locationCode: "11768 James",
      description: "* 11768 James Street | EA Manufacturing",
      inventoryOrgCode: 14,
      inventoryOrgId: 176,
    },
    isManager: true,
    status: "Active",
    salaryType: "Salary",
    employeeType: "Regular",
    personType: "Employee",
    payGroup: "Gentex Pay",
    preferredLocale: "en_US",
    preferredDisplayLang: "en_US",
    preferredCurrency: "USD",
    primaryTimezone: "GMT-05:00 Eastern Time (New York)",
    fullTime: true,
    partTime: false,
    roles: [],
    distributionLists: [],
    isServiceAccount: false,
    pager: "00000",
  },
  employeeActiveDirectory: [],
};
