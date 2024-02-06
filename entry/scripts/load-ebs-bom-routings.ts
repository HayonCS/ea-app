import * as IORedis from "ioredis";
import * as config from "config";
import { Context } from "context";
import { getAssetsAll } from "rest-endpoints/mes-bi/mes-bi";
import { RepositoriesPort } from "records";
import { getBomRoutings } from "rest-endpoints/mes-bom/mes-bom";

var redis = new IORedis.Redis(config.get("redis.url"));

async function loadEbsRoutings() {
  const context = new Context();
  const comboParts = await context
    .get(RepositoriesPort)
    .domain("WebDC", async (ctx) => {
      let r = await ctx.combodata.pn.getRows();
      r = r.filter(
        (x) =>
          !x.PartNumber.includes("I") &&
          !x.PartNumber.includes("E") &&
          !x.PartNumber.includes("U") &&
          !x.PartNumber.includes("A") &&
          !x.PartNumber.includes("L") &&
          !x.PartNumber.includes("0000")
      );
      return r;
    });
  const processParts = await context
    .get(RepositoriesPort)
    .domain("WebDC", async (ctx) => {
      let r = await ctx.processdata.pn.getRows();
      r = r.filter(
        (x) =>
          !x.PartNumber.includes("I") &&
          !x.PartNumber.includes("E") &&
          !x.PartNumber.includes("U") &&
          !x.PartNumber.includes("A") &&
          !x.PartNumber.includes("L") &&
          !x.PartNumber.includes("0000")
      );
      return r;
    });
  //     const totalPartList = [...comboPartDataRedux, ...processPartDataRedux]
  //       .map((x) => x.PartNumber)
  //       .filter((v, i, a) => a.indexOf(v) === i);
  //     console.log("PART LIST:");
  //     console.log(totalPartList);

  let allParts = [...comboParts, ...processParts]
    .map((x) => x.PartNumber)
    .filter((v, i, a) => a.indexOf(v) === i);

  let boms = await getBomRoutings(7, allParts);

  boms = boms.sort((a, b) => a.item.localeCompare(b.item));

  if (boms.length > 0) {
    await redis.set("bomRoutings", JSON.stringify(boms));
    return "Loaded EBS BOM Routings into redis.";
  } else {
    return "Failed loading EBS BOM Routings into redis. No assets received.";
  }
}

async function loadRoutings() {
  await loadEbsRoutings().then((output) => {
    console.info(output);
  });
}

void loadRoutings().then(() => {
  redis.disconnect();
  process.exit();
});
