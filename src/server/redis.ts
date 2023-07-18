import * as redis from "redis";
import {
  getEmployeeInfoDirectory,
  getFinalProcessDataOperatorCombo,
  getFinalProcessDataOperatorPress,
  getFinalProcessDataOperatorTotals,
  getProcessDataExport,
} from "./MES";
import { setTimeout } from "timers/promises";
import { dateToString } from "./DataUtility";
import { ASSETLIST } from "../definitions";
import {
  EmployeeInfoGentex,
  UserData,
  ProcessDataOperator,
  ProcessDataOperatorTotals,
} from "../utils/DataTypes";

const redisClient = redis.createClient({
  url: "redis://127.0.0.1:6380",
});

export const getEmployeeDirectoryRedis = async () => {
  try {
    const redisResult = await redisClient.get("employeeDirectory");
    if (redisResult) {
      const data: EmployeeInfoGentex[] = JSON.parse(redisResult);
      return data;
    }
    return undefined;
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
    return undefined;
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

export const processDataFromRedis = async (key: string) => {
  try {
    let data: ProcessDataOperatorTotals[] = [];
    const redisResult = await redisClient.get(key);
    if (redisResult) {
      data = JSON.parse(redisResult);
    }
    if (data.length > 0) {
      return data;
    }
    return undefined;
  } catch (e) {
    console.log(e);
  }
  return undefined;
};

export const updateProcessData = async () => {
  while (true) {
    try {
      const endDate = new Date();
      const startDate = new Date(endDate);
      for (let i = 0; i < ASSETLIST.length; ++i) {
        const processData = await getProcessDataExport(
          ASSETLIST[i],
          startDate,
          endDate
        );
        if (processData) {
          let processOperator: ProcessDataOperator[] = [];
          if (ASSETLIST[i].includes("CMB") || ASSETLIST[i].includes("MR")) {
            processOperator = getFinalProcessDataOperatorCombo(processData);
          } else {
            processOperator = getFinalProcessDataOperatorPress(processData);
          }

          const finalData = await getFinalProcessDataOperatorTotals(
            processOperator
          );

          const key = `${ASSETLIST[i]}:${dateToString(startDate)}`;
          await redisClient.set(key, JSON.stringify(finalData));
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

export const processDataFunction = async () => {
  try {
    (async () => {
      await redisClient.connect();
    })();
    await loadEmployeeDirectory();
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
      for (let i = 0; i < ASSETLIST.length; ++i) {
        const processData = await getProcessDataExport(
          ASSETLIST[i],
          start,
          start
        );
        if (processData) {
          //const processOperator = getFinalProcessDataOperator(processData);
          let processOperator: ProcessDataOperator[] = [];
          if (ASSETLIST[i].includes("CMB") || ASSETLIST[i].includes("MR")) {
            processOperator = getFinalProcessDataOperatorCombo(processData);
          } else {
            processOperator = getFinalProcessDataOperatorPress(processData);
          }
          const finalData = await getFinalProcessDataOperatorTotals(
            processOperator
          );

          const key = `${ASSETLIST[i]}:${dateToString(start)}`;
          await redisClient.set(key, JSON.stringify(finalData));
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
