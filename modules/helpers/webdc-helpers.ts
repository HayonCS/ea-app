import { groupBy } from "client/utilities/array-util";
import { StatsDataOperatorRow } from "client/utilities/webdc-data";
import { SnRow } from "records/combodata";

// export function getPerformanceRows(rows: SnRow[]) {
//   let finalStats: StatsDataOperatorRow[] = [];
//   let passCount = 0;
//   let failCount = 0;
//   let startTime = new Date("1900-09-09");
//   for (let i = 0; i < rows.length; ++i) {
//     const currRow = rows[i];
//     if (i === 0) startTime = new Date(currRow.TestDateTime);
//     if (!currRow.Failed) passCount += 1;
//     else failCount += 1;

//     if (
//       i < rows.length - 1 &&
//       new Date(rows[i + 1].TestDateTime).getTime() -
//         new Date(rows[i].TestDateTime).getTime() >
//         300 * 1000
//     ) {
//       // if more than 5 minutes

//       const totalCount = passCount + failCount;
//       const runActual =
//         (new Date(currRow.TestDateTime).getTime() - startTime.getTime()) /
//         1000 /
//         60;
//       const pph = runActual > 0 ? totalCount / (runActual / 60) : 0;
//       const row: StatsDataOperatorRow = {
//         id: i,
//         Asset: currRow.AssetID.toString(),
//         PartNumber: currRow.PNID.toString(),
//         Date: startTime,
//         StartTime: startTime,
//         EndTime: new Date(currRow.TestDateTime),
//         Passes: passCount,
//         Fails: failCount,
//         Line: "",
//         Operator: currRow.OperatorID?.toString() ?? "00000",
//         CycleTime: 0,
//         RunActual: runActual,
//         RunTheory: 0,
//         Efficiency: 0,
//         PartsPerHour: pph,
//       };
//       finalStats.push(row);

//       passCount = 0;
//       failCount = 0;
//       startTime = new Date(rows[i + 1].TestDateTime);
//     } else if (i === rows.length - 1) {
//       const runActual =
//         (new Date(currRow.TestDateTime).getTime() - startTime.getTime()) /
//         1000 /
//         60;
//       const totalCount = passCount + failCount;
//       const pph = runActual > 0 ? totalCount / (runActual / 60) : 0;
//       const row: StatsDataOperatorRow = {
//         id: i,
//         Asset: currRow.AssetID.toString(),
//         PartNumber: currRow.PNID.toString(),
//         Date: startTime,
//         StartTime: startTime,
//         EndTime: new Date(currRow.TestDateTime),
//         Passes: passCount,
//         Fails: failCount,
//         Line: "",
//         Operator: currRow.OperatorID?.toString() ?? "00000",
//         CycleTime: 0,
//         RunActual: runActual,
//         RunTheory: 0,
//         Efficiency: 0,
//         PartsPerHour: pph,
//       };
//       finalStats.push(row);
//     }
//   }
//   return finalStats;
// }

export const getPerformanceRows = (statsData: SnRow[]) => {
  let finalStats: StatsDataOperatorRow[] = [];
  const groupStatsOperator = groupBy(statsData, "OperatorID");
  for (const operatorKey of Object.keys(groupStatsOperator)) {
    const statsDataOperator: SnRow[] = groupStatsOperator[operatorKey];
    if (statsDataOperator) {
      const groupStatsAsset = groupBy(statsDataOperator, "AssetID");
      for (const assetKey of Object.keys(groupStatsAsset)) {
        const statsDataAsset: SnRow[] = groupStatsAsset[assetKey];
        if (statsDataAsset) {
          const groupStatsPart = groupBy(statsDataAsset, "PNID");
          // const assetInfo = assetData.find((x) => x.AssetID === +assetKey);
          // const biInfo = assetBiInfo.find(
          //   (x) => x.assetName === assetInfo?.Asset
          // );
          for (const partKey of Object.keys(groupStatsPart)) {
            const statsDataPart: SnRow[] = groupStatsPart[partKey];
            if (statsDataPart) {
              let passCount = 0;
              let failCount = 0;
              let startTime = new Date("1900-09-09");
              // let lastPartInfo: PnRow | undefined = undefined;
              let lastCycleTime = -1;
              for (let i = 0; i < statsDataPart.length; ++i) {
                const currStatsPart = statsDataPart[i];
                if (i === 0) startTime = new Date(currStatsPart.TestDateTime);
                if (!currStatsPart.Failed) passCount += 1;
                else failCount += 1;

                if (
                  i < statsDataPart.length - 1 &&
                  new Date(statsDataPart[i + 1].TestDateTime).getTime() -
                    new Date(statsDataPart[i].TestDateTime).getTime() >
                    600 * 1000
                ) {
                  // if more than 5 minutes

                  const totalCount = passCount + failCount;
                  const runActual =
                    (new Date(currStatsPart.TestDateTime).getTime() -
                      startTime.getTime()) /
                    1000 /
                    60;
                  const pph = runActual > 0 ? totalCount / (runActual / 60) : 0;

                  let testDate = currStatsPart.TestDateTime;
                  let palletCount = 1;
                  for (let o = i - 1; o >= 0; o--) {
                    const timeDiff = Math.abs(
                      statsDataPart[o].TestDateTime.getTime() -
                        testDate.getTime()
                    );
                    if (timeDiff < 5000) {
                      palletCount += 1;
                    } else {
                      break;
                    }
                  }

                  const row: StatsDataOperatorRow = {
                    id: i,
                    Asset: currStatsPart.AssetID.toString(),
                    PartNumber: currStatsPart.PNID.toString(),
                    Date: startTime,
                    StartTime: startTime,
                    EndTime: new Date(currStatsPart.TestDateTime),
                    Passes: passCount,
                    Fails: failCount,
                    Line: "",
                    Operator: currStatsPart.OperatorID?.toString() ?? "00000",
                    CycleTime: lastCycleTime,
                    RunActual: runActual,
                    RunTheory: 0,
                    Efficiency: 0,
                    PartsPerHour: pph,
                    PartsPerPallet: palletCount,
                  };
                  // if (
                  //   row.Operator !== "00000" ||
                  //   row.Asset.startsWith("CMB-")
                  // ) {
                  //   finalStats.push(row);
                  // }
                  finalStats.push(row);

                  passCount = 0;
                  failCount = 0;
                  startTime = new Date(statsDataPart[i + 1].TestDateTime);
                } else if (i === statsDataPart.length - 1) {
                  const runActual =
                    (new Date(currStatsPart.TestDateTime).getTime() -
                      startTime.getTime()) /
                    1000 /
                    60;
                  const totalCount = passCount + failCount;
                  const pph = runActual > 0 ? totalCount / (runActual / 60) : 0;

                  let testDate = currStatsPart.TestDateTime;
                  let palletCount = 1;
                  for (let o = i - 1; o >= 0; o--) {
                    const timeDiff = Math.abs(
                      statsDataPart[o].TestDateTime.getTime() -
                        testDate.getTime()
                    );
                    if (timeDiff < 5000) {
                      palletCount += 1;
                    } else {
                      break;
                    }
                  }

                  const row: StatsDataOperatorRow = {
                    id: i,
                    Asset: currStatsPart.AssetID.toString(),
                    PartNumber: currStatsPart.PNID.toString(),
                    Date: startTime,
                    StartTime: startTime,
                    EndTime: new Date(currStatsPart.TestDateTime),
                    Passes: passCount,
                    Fails: failCount,
                    Line: "",
                    Operator: currStatsPart.OperatorID?.toString() ?? "00000",
                    CycleTime: lastCycleTime,
                    RunActual: runActual,
                    RunTheory: 0,
                    Efficiency: 0,
                    PartsPerHour: pph,
                    PartsPerPallet: palletCount,
                  };
                  // if (
                  //   row.Operator !== "00000" ||
                  //   row.Asset.startsWith("CMB-")
                  // ) {
                  //   finalStats.push(row);
                  // }
                  finalStats.push(row);
                }
              }
            }
          }
        }
      }
    }
  }
  finalStats = finalStats.sort(
    (a, b) => a.StartTime.getTime() - b.StartTime.getTime()
  );
  finalStats = finalStats.sort((a, b) => a.Asset.localeCompare(b.Asset));
  // finalStats = finalStats.filter((x) => x.PartNumber);
  // finalStats = finalStats.filter(
  //   (x) => x.Operator !== "00000" && !x.Asset.startsWith("CMB-")
  // );
  finalStats.forEach((x, i) => (x.id = i));
  return finalStats;
};
