export function groupBy(arr: any, property: any) {
  return arr.reduce(function (memo: any, x: any) {
    if (!memo[x[property]]) {
      memo[x[property]] = [];
    }
    memo[x[property]].push(x);
    return memo;
  }, {});
}
