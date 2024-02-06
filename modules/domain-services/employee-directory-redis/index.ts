import * as Hexagonal from "atomic-object/hexagonal";
import { EmployeeInfoRedisPort } from "./port";
import { getEmployeeDirectoryRedis } from "./employee-directory-redis";
import { EmployeeInfoResponse } from "rest-endpoints/employee-directory/employee-directory";

export type EmployeeInfoRedisDef = {
  getEmployeeDirectoryRedis: () => Promise<EmployeeInfoResponse[]>;
};

export const employeeInfoRedisAdapter = Hexagonal.adapter({
  port: EmployeeInfoRedisPort,
  requires: [],
  build: () => {
    return {
      getEmployeeDirectoryRedis: async (): Promise<EmployeeInfoResponse[]> => {
        return await getEmployeeDirectoryRedis();
      },
    };
  },
});
