import { Context } from "context";
import { RepositoriesPort } from "records";
import { getCurrentDateTime } from "rest-endpoints/world-time/world-time";

// void (async () => {
//   const context = new Context();
//   const result = await context
//     .get(RepositoriesPort)
//     .domain("WebDC", async (ctx) => {
//       const r = await ctx.processdata.asset.showColumns();
//       return r;
//     });
//   console.log(result);
// })();

void (async () => {
  const ctx = new Context();
  let endDate = await getCurrentDateTime();
  console.log("End: " + endDate);
  let startDate = new Date(endDate);
  startDate.setHours(startDate.getHours() - 8);
  console.log("Start: " + startDate);
  let result = await ctx.get(RepositoriesPort).domain("WebDC", async (c) => {
    const r = await c.combodata.sn.getRowsByAssetDateRange(
      313,
      startDate,
      endDate
    );
    return r;
  });
  result = result.sort(
    (a, b) => a.TestDateTime.getTime() - b.TestDateTime.getTime()
  );
  result = result.filter((x) => x.Failed);
  console.log(result);
})();
