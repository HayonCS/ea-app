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
    const r = await c.processdata.sn.getRowsDateRange(startDate, endDate, [
      195,
    ]);
    return r;
    // const r = await c.processdata.sn.showColumns();
    // return r;
  });
  // result = result.sort(
  //   (a, b) => a.TestDateTime.getTime() - b.TestDateTime.getTime()
  // );
  // result = result.filter((x) => x.Failed);
  console.log(result.length);
  result = result.filter((x) => x.RevID);
  console.log(result.length);
  const sns = result
    .map((x) => x.OperatorID)
    .filter((v, i, a) => a.indexOf(v) === i);
  console.log(sns.length);
  // console.log(result);
})();
