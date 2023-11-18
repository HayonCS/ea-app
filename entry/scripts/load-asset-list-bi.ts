import * as IORedis from "ioredis";
import * as config from "config";
import { getAssetsAll } from "rest-endpoints/mes-bi/mes-bi";

var redis = new IORedis.Redis(config.get("redis.url"));

async function loadAllAssets() {
  let assets = await getAssetsAll();

  assets = assets.filter(
    (x) =>
      x.assetName.startsWith("CMB") ||
      x.assetName.startsWith("MR") ||
      x.assetName.startsWith("PCB")
  );

  assets = assets.sort((a, b) => a.assetName.localeCompare(b.assetName));

  if (assets.length > 0) {
    await redis.set("biAssetList", JSON.stringify(assets));
    return "Loaded bi asset list into redis.";
  } else {
    return "Failed loading bi assets into redis. No assets received.";
  }
}

async function loadAssets() {
  await loadAllAssets().then((output) => {
    console.info(output);
  });
}

void loadAssets().then(() => {
  redis.disconnect();
  process.exit();
});
