import * as redis from "db/redis";

export async function getAssetList(): Promise<string[]> {
  const connRedis = redis.getRedisPubConnection();
  const key = `biAssetList`;
  let result = await connRedis.get(key);
  if (result) {
    const assets: string[] = JSON.parse(result);
    return assets;
  }
  return [];
}
