import * as Hexagonal from "atomic-object/hexagonal";
import { EmployeeDirectoryRedisPort } from "./port";
import { getEmployeeDirectory } from "./employee-directory-redis";
import { EmployeeInfoResponse } from "rest-endpoints/employee-directory/employee-directory";

export type EmployeeDirectoryRedisDef = {
  getEmployeeDirectory: () => Promise<EmployeeInfoResponse[]>;
};

export const employeeDirectoryRedisAdapter = Hexagonal.adapter({
  port: EmployeeDirectoryRedisPort,
  requires: [],
  build: () => {
    return {
      getEmployeeDirectory: async (): Promise<EmployeeInfoResponse[]> => {
        return await getEmployeeDirectory();
      },
    };
  },
});
