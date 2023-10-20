import { Context } from "context";
import { RepositoriesPort } from "records";
import { getCurrentDateTime } from "rest-endpoints/world-time/world-time";

void (async () => {
  const ctx = new Context();
  let endDate = await getCurrentDateTime();
  let startDate = new Date(endDate);
  startDate.setHours(startDate.getHours() - 8);
  // const result = await ctx.get(RepositoriesPort).domain("WebDC", (c) => {
  //   const r = c.sn.getRowsDateRange(startDate, endDate);
  //   return r;
  // });
  const result = await ctx.get(RepositoriesPort).domain("WebDC", (c) => {
    const r = c.pn.showColumns();
    return r;
  });
  result.forEach((x: any) => {
    console.log(x);
  });
  // console.log(result);
})();
