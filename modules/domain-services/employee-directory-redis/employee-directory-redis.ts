import * as redis from "db/redis";
import { EmployeeInfoResponse } from "rest-endpoints/employee-directory/employee-directory";
import { AssetInfo } from "rest-endpoints/mes-bi/mes-bi";

export async function getEmployeeDirectory(): Promise<EmployeeInfoResponse[]> {
  const connRedis = redis.getRedisPubConnection();
  const key = "employeeDirectory";
  let result = await connRedis.get(key);
  if (result) {
    const employees: EmployeeInfoResponse[] = JSON.parse(result);
    return employees;
  }
  return [];
}
