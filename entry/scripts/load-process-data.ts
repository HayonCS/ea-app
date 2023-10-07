import * as IORedis from "ioredis";
import * as config from "config";
import { AssetInfo } from "rest-endpoints/mes-bi/mes-bi";
import { getProcessDataExport } from "rest-endpoints/mes-process-data/process-data";

var redis = new IORedis.Redis(config.get("redis.url"));

const dateToString = (date: Date) => {
  let d = new Date(date);
  d.setHours(d.getHours() + 4);
  const str =
    d.getFullYear() +
    "-" +
    (d.getMonth() < 9 ? "0" : "") +
    (d.getMonth() + 1) +
    "-" +
    (d.getDate() < 10 ? "0" : "") +
    d.getDate();
  return str;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadInitialData() {
  let assets: AssetInfo[] = JSON.parse(
    (await redis.get("biAssetList")) ?? "[]"
  );

  console.log("Loading asset data into redis...");
  const endDate = new Date();
  let startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 100);
  for (
    let start = new Date(endDate);
    start.getTime() >= startDate.getTime();
    start.setDate(start.getDate() - 1)
  ) {
    let end = new Date(start);
    end.setDate(end.getDate() + 1);
    for (let i = 0; i < assets.length; ++i) {
      const processData = await getProcessDataExport(
        assets[i].assetName,
        dateToString(start),
        dateToString(end)
      );
      if (processData) {
        const key = `${assets[i].assetName}:${dateToString(start)}`;
        await redis.set(key, JSON.stringify(processData));
        console.log(`Added "${key}" to Redis.`);
      }
    }
    return "Done loading initial data. Updating data now...";
  }
  return "Failed loading initial process data!";
}

async function updateProcessData() {
  while (true) {
    try {
      const assetList: AssetInfo[] = JSON.parse(
        (await redis.get("biAssetList")) ?? "[]"
      );
      const endDate = new Date();
      const startDate = new Date(endDate);
      let endDatePrev = new Date(endDate);
      let startDatePrev = new Date(endDate);
      endDatePrev.setDate(endDatePrev.getDate() - 1);
      startDatePrev.setDate(startDatePrev.getDate() - 1);
      for (let i = 0; i < assetList.length; ++i) {
        const processDataNow = await getProcessDataExport(
          assetList[i].assetName,
          dateToString(startDate),
          dateToString(endDate)
        );
        const processDataPrev = await getProcessDataExport(
          assetList[i].assetName,
          dateToString(startDatePrev),
          dateToString(endDatePrev)
        );
        if (processDataNow) {
          const key = `${assetList[i].assetName}:${dateToString(startDate)}`;
          await redis.set(key, JSON.stringify(processDataNow));
          console.log(`Updated "${key}" in Redis.`);
        }
        if (processDataPrev) {
          const key = `${assetList[i].assetName}:${dateToString(
            startDatePrev
          )}`;
          await redis.set(key, JSON.stringify(processDataPrev));
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
    await delay(600000);
  }
}

async function loadData() {
  await loadInitialData().then(async (output) => {
    console.info(output);
    if (!output.includes("Failed")) {
      await updateProcessData();
    }
  });
}

void loadData().then(() => {
  redis.disconnect();
  process.exit();
});
