import * as redis from "db/redis";
import { BomRouting } from "rest-endpoints/mes-bom/mes-bom";

export async function getBomRoutings(): Promise<BomRouting[]> {
  const connRedis = redis.getRedisPubConnection();
  const key = `bomRoutings`;
  let result = await connRedis.get(key);
  if (result) {
    const assets: BomRouting[] = JSON.parse(result);
    return assets;
  }
  return [];
}
