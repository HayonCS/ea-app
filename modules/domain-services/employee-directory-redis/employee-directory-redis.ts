import * as redis from "db/redis";
import { EmployeeInfoResponse } from "rest-endpoints/employee-directory/employee-directory";

export async function getEmployeeDirectoryRedis(): Promise<
  EmployeeInfoResponse[]
> {
  const connRedis = redis.getRedisPubConnection();
  const key = `employeeDirectory`;
  let result = await connRedis.get(key);
  if (result) {
    const assets: EmployeeInfoResponse[] = JSON.parse(result);
    return assets;
  }
  return [];
}
