import { Context } from "context";
import { RepositoriesPort } from "records";
import { getCurrentDateTime } from "rest-endpoints/world-time/world-time";

void (async () => {
  const ctx = new Context();
  let endDate = await getCurrentDateTime();
  console.log("End: " + endDate);
  let startDate = new Date(endDate);
  startDate.setHours(startDate.getHours() - 8);
  console.log("Start: " + startDate);

  // const result = await ctx.get(RepositoriesPort).domain("WebDC", (c) => {
  //   const r = c.sn.getRowsDateRange(startDate, endDate);
  //   return r;
  // });
  let result = await ctx.get(RepositoriesPort).domain("WebDC", (c) => {
    const r = c.sn.getRowsByAssetDateRange(313, startDate, endDate);
    return r;
  });
  result = result.sort(
    (a, b) => a.TestDateTime.getTime() - b.TestDateTime.getTime()
  );
  result = result.filter((x) => x.Failed);
  console.log(result);
})();
