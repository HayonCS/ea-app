import { UserAppData } from "core/schemas/user-app-data.gen";
import * as redis from "db/redis";

export async function getUserAppData(userId: string): Promise<UserAppData> {
  const connRedis = redis.getRedisPubConnection();
  const key = `userAppData:${userId}`;
  let result = await connRedis.get(key);
  if (result) {
    const appData: UserAppData = JSON.parse(result);
    return appData;
  }
  return {
    orgCode: 0,
    assetList: [],
    teamIds: [],
  };
}
