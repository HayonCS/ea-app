import * as Hexagonal from "atomic-object/hexagonal";
import { EmployeeInfo } from "rest-endpoints/employee-directory";

export type EmployeeInfoPort = typeof EmployeeInfoPort;
export const EmployeeInfoPort = Hexagonal.port<EmployeeInfo, "employeeInfo">(
  "employeeInfo"
);
