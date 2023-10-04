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
