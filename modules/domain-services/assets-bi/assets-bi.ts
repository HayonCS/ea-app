import * as redis from "db/redis";
import { AssetInfo } from "rest-endpoints/mes-bi/mes-bi";

export async function getAssetList(): Promise<AssetInfo[]> {
  const connRedis = redis.getRedisPubConnection();
  const key = `biAssetList`;
  let result = await connRedis.get(key);
  if (result) {
    const assets: AssetInfo[] = JSON.parse(result);
    return assets;
  }
  return [];
}
