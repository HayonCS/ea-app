import * as redis from "redis";
import {
  getAssetList,
  getEmployeeInfoDirectory,
  getProcessDataExport,
} from "./mes";
import { setTimeout } from "timers/promises";
import { dateToString } from "./DataUtility";
import {
  EmployeeInfoGentex,
  UserData,
  ProcessDataExport,
} from "../utils/DataTypes";

const redisClient = redis.createClient({
  url: "redis://127.0.0.1:6380",
});

export const getAssetListRedis = async () => {
  try {
    const redisResult = await redisClient.get("assetList");
    if (redisResult) {
      const data: string[] = JSON.parse(redisResult);
      return data;
    }
  } catch (e) {
    console.log(e);
  }
  return undefined;
};

export const getEmployeeDirectoryRedis = async () => {
  try {
    const redisResult = await redisClient.get("employeeDirectory");
    if (redisResult) {
      const data: EmployeeInfoGentex[] = JSON.parse(redisResult);
      return data;
    }
  } catch (e) {
    console.log(e);
  }
  return undefined;
};

export const getUserData = async (key: string) => {
  try {
    const redisResult = await redisClient.get(key);
    if (redisResult) {
      const data: UserData = JSON.parse(redisResult);
      return data;
    }
  } catch (e) {
    console.log(e);
  }
  return undefined;
};

export const updateUserData = async (user: string, data: UserData) => {
  try {
    if (!data || !data.orgCode || data.orgCode === "") return false;
    const key = `userData:${user}`;
    await redisClient.set(key, JSON.stringify(data));
    console.log(`Updated "${key}" in Redis.`);
    return true;
  } catch (err) {
    console.log(err);
  }
  return false;
};

export const processDataFromRedis = async (asset: string, date: string) => {
  try {
    const key = `${asset}:${date}`;
    let data: ProcessDataExport[] = [];
    const redisResult = await redisClient.get(key);
    if (redisResult) {
      data = JSON.parse(redisResult);
    }
    if (data.length > 0) {
      return data;
    }
  } catch (e) {
    console.log(e);
  }
  return undefined;
};

export const processDataRangeFromRedis = async (
  asset: string,
  startDate: string,
  endDate: string
) => {
  try {
    let data: ProcessDataExport[] = [];
    const dateEnd = new Date(endDate);
    for (
      let start = new Date(startDate);
      start.getTime() <= dateEnd.getTime();
      start.setDate(start.getDate() + 1)
    ) {
      const key = `${asset}:${dateToString(start)}`;
      const redisResult = await redisClient.get(key);
      if (redisResult) {
        data = data.concat(JSON.parse(redisResult));
      }
    }
    return data;
  } catch (e) {
    console.log(e);
  }
  return undefined;
};

const loadEmployeeDirectory = async () => {
  try {
    const employeeData = await getEmployeeInfoDirectory();
    if (employeeData) {
      const key = `employeeDirectory`;
      await redisClient.set(key, JSON.stringify(employeeData));
      console.log(`Added "${key}" to Redis.`);
    }
  } catch (error) {
    console.log(error);
  }
};

const loadAssetList = async () => {
  try {
    const assetList = await getAssetList();
    if (assetList) {
      const key = `assetList`;
      await redisClient.set(key, JSON.stringify(assetList));
      console.log(`Added "${key}" to Redis.`);
    }
  } catch (error) {
    console.log(error);
  }
};

const updateProcessData = async () => {
  while (true) {
    try {
      await loadEmployeeDirectory();
      await loadAssetList();
      const assetList = (await getAssetListRedis()) ?? [];
      const endDate = new Date();
      const startDate = new Date(endDate);
      let endDatePrev = new Date(endDate);
      let startDatePrev = new Date(endDate);
      endDatePrev.setDate(endDatePrev.getDate() - 1);
      startDatePrev.setDate(startDatePrev.getDate() - 1);
      for (let i = 0; i < assetList.length; ++i) {
        const processDataNow = await getProcessDataExport(
          assetList[i],
          startDate,
          endDate
        );
        const processDataPrev = await getProcessDataExport(
          assetList[i],
          startDatePrev,
          endDatePrev
        );
        if (processDataNow) {
          const key = `${assetList[i]}:${dateToString(startDate)}`;
          await redisClient.set(key, JSON.stringify(processDataNow));
          console.log(`Updated "${key}" in Redis.`);
        }
        if (processDataPrev) {
          const key = `${assetList[i]}:${dateToString(startDatePrev)}`;
          await redisClient.set(key, JSON.stringify(processDataPrev));
          console.log(`Updated "${key}" in Redis.`);
        }
      }
    } catch (err) {
      console.log(err);
    }
    const timeNow = new Date();
    console.log(
      `Done updating all assets in redis. (${timeNow.toLocaleTimeString()})`
    );
    console.log(`Waiting 10 minutes...`);
    await setTimeout(600000);
  }
};

export const processDataFunction = async () => {
  try {
    (async () => {
      await redisClient.connect();
    })();
    await loadEmployeeDirectory();
    await loadAssetList();
    const assetList = (await getAssetListRedis()) ?? [];
    console.log("Loading asset data into redis...");
    const endDate = new Date();
    let startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 100);
    let initialized = false;
    for (
      let start = new Date(endDate);
      start.getTime() >= startDate.getTime();
      start.setDate(start.getDate() - 1)
    ) {
      for (let i = 0; i < assetList.length; ++i) {
        const processData = await getProcessDataExport(
          assetList[i],
          start,
          start
        );
        if (processData) {
          const key = `${assetList[i]}:${dateToString(start)}`;
          await redisClient.set(key, JSON.stringify(processData));
          console.log(`Added "${key}" to Redis.`);
        }
      }
      if (!initialized) {
        updateProcessData();
        initialized = true;
      }
    }
  } catch (err) {
    console.log(err);
  }
  console.log("Done loading assets into redis!");
};
