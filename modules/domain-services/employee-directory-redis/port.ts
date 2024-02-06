import * as Hexagonal from "atomic-object/hexagonal";
import { EmployeeInfoRedisDef } from ".";

export type EmployeeInfoRedisPort = typeof EmployeeInfoRedisPort;
export const EmployeeInfoRedisPort = Hexagonal.port<
  EmployeeInfoRedisDef,
  "employeeInfoRedis"
>("employeeInfoRedis");
