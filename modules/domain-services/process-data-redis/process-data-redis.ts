import * as redis from "db/redis";
import { ProcessDataExport } from "rest-endpoints/mes-process-data/mes-process-data";

export async function getProcessDataRedis(
  asset: string,
  date: string
): Promise<ProcessDataExport[]> {
  const connRedis = redis.getRedisPubConnection();
  const key = `${asset}:${date}`;
  let result = await connRedis.get(key);
  if (result) {
    const data: ProcessDataExport[] = JSON.parse(result);
    return data;
  }
  return [];
}
