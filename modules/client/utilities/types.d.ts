export interface BiAssetInfo {
  assetName: string;
  serial: string;
  model: string;
  orgCode: string;
  line: string;
  dateCreated: string;
  notes: string;
  reportGroupName?: string | null;
  reportGroupID?: string | null;
  excludeFromHealth: boolean;
  legacyLocation?: string | null;
  autoUpdate: boolean;
  recordLastUpdated: string;
  updatedBy: string;
}

export interface ProcessDataExportRaw {
  MetaDataId: string;
  KeyToValueDictionary: {
    ASSET: string;
    IDENTIFIERCODE: string;
    IDENTIFIERCODE2: string;
    PARTNUMBER: string;
    OPENDTIME: string;
    PASSFAIL: string;
    OPERATIONID: string;
    LINE: string;
    LABEL: string;
    OPERATOR: string;
    DESCRIPTION: string;
    CYCLETIME: string;
    REVISION: string;
    SENDER: string;
    TESTPLAN: string;
    BARCODE: string;
  };
}

export interface ProcessDataExport {
  MetaDataId: string;
  Asset: string;
  IdentifierCode: string;
  IdentifierCode2: string;
  PartNumber: string;
  OpEndTime: Date;
  PassFail: boolean;
  OperationId: string;
  Line: string;
  Label: string;
  Operator: string;
  Description: string;
  CycleTime: string;
  Revision: string;
  Sender: string;
  TestPlan: string;
  Barcode: string;
}

export interface ProcessDataOperator {
  id: number;
  Asset: string;
  PartNumber: string;
  Date: Date;
  StartTime: Date;
  EndTime: Date;
  Passes: number;
  Fails: number;
  OperationId: string;
  Line: string;
  Label: string;
  Operator: string;
  Description: string;
  CycleTime: string;
  Revision: string;
  Sender: string;
  TestPlan: string;
}

export interface ProcessDataOperatorTotals {
  id: number;
  Asset: string;
  PartNumber: string;
  Date: Date;
  StartTime: Date;
  EndTime: Date;
  Passes: number;
  Fails: number;
  OperationId: string;
  Line: string;
  Label: string;
  Operator: string;
  Revision: string;
  Sender: string;
  TestPlan: string;
  CycleTime: number;
  RunActual: number;
  RunTheory: number;
  Efficiency: number;
  PartsPerHour: number;
}

// export interface ProcessDataPartTotals {
//   id: number;
//   Asset: string;
//   PartNumber: string;
//   Date: Date;
//   StartTime: Date;
//   EndTime: Date;
//   Passes: number;
//   Fails: number;
//   OperationId: string;
//   Line: string;
//   Label: string;
//   Operator: string;
//   Revision: string;
//   Sender: string;
//   TestPlan: string;
//   CycleTime: number;
//   RunActual: number;
//   RunTheory: number;
//   Efficiency: number;
//   PartsPerHour: number;
// }

export interface ProcessDataRawData extends ProcessDataExport {
  id: number;
}

export interface UserInfoGentex {
  employeeId: string;
  username: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  roles: string[];
  distributionLists: string[];
  isServiceAccount: boolean;
  pager: string;
}

export interface EmployeeInfoGentex {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  cellPhone?: string;
  workPhone?: string;
  location?: string;
  locationId?: string;
  shift?: string;
  jobTitle?: string;
  managerEmployeeNumber?: string;
  erphrLocation?: {
    locationId: number;
    locationCode: string;
    description: string;
    inventoryOrgCode: string;
    inventoryOrgId: number;
  };
  isManager?: boolean;
  status?: string;
  salaryType?: string;
  employeeType?: string;
  personType?: string;
  payGroup?: string;
  preferredLocale?: string;
  preferredDisplayLang?: string;
  preferredCurrency?: string;
  primaryTimezone?: string;
  fullTime?: boolean;
  partTime?: boolean;
}

export interface UserLumenInfo {
  name: string;
  userName: string;
  position: string;
  location: string;
}
