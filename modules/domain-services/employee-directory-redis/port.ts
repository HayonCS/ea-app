import * as Hexagonal from "atomic-object/hexagonal";
import { EmployeeDirectoryRedisDef } from ".";

export type EmployeeDirectoryRedisPort = typeof EmployeeDirectoryRedisPort;
export const EmployeeDirectoryRedisPort = Hexagonal.port<
  EmployeeDirectoryRedisDef,
  "employeeDirectoryRedis"
>("employeeDirectoryRedis");
