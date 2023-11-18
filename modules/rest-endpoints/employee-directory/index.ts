import * as Hexagonal from "atomic-object/hexagonal";
import { EmployeeInfoPort } from "./port";
import {
  getEmployeeInfo,
  EmployeeInfoResponse,
  getEmployeeDirectory,
} from "./employee-directory";

export type EmployeeInfo = {
  employeeInfo: (
    employeeEmailOrNumber: string
  ) => Promise<EmployeeInfoResponse>;

  employeeDirectory: () => Promise<EmployeeInfoResponse[]>;
};

export const employeeInfoAdapter = Hexagonal.adapter({
  port: EmployeeInfoPort,
  requires: [],
  build: () => {
    return {
      employeeInfo: async (employeeEmailOrNumber: string) => {
        return await getEmployeeInfo(employeeEmailOrNumber);
      },

      employeeDirectory: async () => {
        return await getEmployeeDirectory();
      },
    };
  },
});
