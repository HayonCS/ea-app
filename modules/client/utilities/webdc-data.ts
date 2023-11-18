import { AssetRow, PnRow, SnRow } from "records/combodata";
import { ProcessDataOperator, ProcessDataOperatorTotals } from "./types";
import { AssetInfo, LineOperationPart } from "rest-endpoints/mes-bi/mes-bi";
import { groupBy } from "./array-util";

export interface StatsDataOperatorRow {
  id: number;
  Asset: string;
  PartNumber: string;
  Date: Date;
  StartTime: Date;
  EndTime: Date;
  Passes: number;
  Fails: number;
  Line: string;
  Operator: string;
  CycleTime: number;
  RunActual: number;
  RunTheory: number;
  Efficiency: number;
  PartsPerHour: number;
}

const getPartCycleTime = (
  partNumber: string,
  orgCode: number,
  assetType: "Combo" | "Combo2" | "MonoRail" | "Press",
  cycleTimeInfo: LineOperationPart[]
) => {
  const result = cycleTimeInfo.filter(
    (x) => x.partNumber.includes(partNumber) && x.orgCode === orgCode
  );
  // const result: LineOperationPart[] = await response.json();
  if (result.length > 0) {
    for (let i = 0; i < result.length; ++i) {
      const op = result[i].ebsOperation;
      const cycle = result[i].minimumRepeatable;
      switch (assetType) {
        case "Combo":
          if (op === "O610") return cycle;
          break;
        case "Combo2":
          if (op === "O612") return cycle;
          break;
        case "MonoRail":
          if (op === "O614") return cycle;
          break;
        case "Press":
          if (op === "O540") return cycle;
          break;
        default:
          return cycle;
      }
    }
  }
  return 0;
};

export const getStatsDataOperatorRows = (
  statsData: SnRow[],
  partData: PnRow[],
  assetData: AssetRow[],
  cycleTimeInfo: LineOperationPart[],
  assetBiInfo: AssetInfo[]
) => {
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
          const assetInfo = assetData.find((x) => x.AssetID === +assetKey);
          // console.log(assetInfo);
          const biInfo = assetBiInfo.find(
            (x) => x.assetName === assetInfo?.Asset
          );
          for (const partKey of Object.keys(groupStatsPart)) {
            const statsDataPart: SnRow[] = groupStatsPart[partKey];
            if (statsDataPart) {
              let passCount = 0;
              let failCount = 0;
              let startTime = new Date("1900-09-09");
              let lastPartInfo: PnRow | undefined = undefined;
              let lastCycleTime = -1;
              for (let i = 0; i < statsDataPart.length; ++i) {
                const currStatsPart = statsDataPart[i];
                if (i === 0) startTime = new Date(currStatsPart.TestDateTime);
                if (!currStatsPart.Failed) passCount += 1;
                else failCount += 1;

                if (!lastPartInfo)
                  lastPartInfo = partData.find(
                    (x) => x.PNID === currStatsPart.PNID
                  );
                if (lastCycleTime < 0) {
                  const filterCycleInfo = cycleTimeInfo.filter(
                    (x) =>
                      x.orgCode === (biInfo ? +biInfo.orgCode : 14) &&
                      x.partNumber.includes(lastPartInfo?.PartNumber ?? "")
                  );
                  if (biInfo?.assetName.includes("CMB2")) {
                    lastCycleTime =
                      filterCycleInfo.find((x) => x.ebsOperation === "O612")
                        ?.minimumRepeatable ?? 0;
                  } else if (biInfo?.assetName.includes("CMB")) {
                    lastCycleTime =
                      filterCycleInfo.find((x) => x.ebsOperation === "O610")
                        ?.minimumRepeatable ?? 0;
                  } else if (biInfo?.assetName.includes("MR")) {
                    lastCycleTime =
                      filterCycleInfo.find((x) => x.ebsOperation === "O614")
                        ?.minimumRepeatable ?? 0;
                  } else if (biInfo?.assetName.includes("PCB")) {
                    lastCycleTime =
                      filterCycleInfo.find((x) => x.ebsOperation === "O540")
                        ?.minimumRepeatable ?? 0;
                  } else {
                    lastCycleTime = 0;
                  }
                }

                if (
                  i < statsDataPart.length - 1 &&
                  new Date(statsDataPart[i + 1].TestDateTime).getTime() -
                    new Date(statsDataPart[i].TestDateTime).getTime() >
                    300 * 1000
                ) {
                  // if more than 30 minutes

                  const totalCount = passCount + failCount;
                  const runActual =
                    (new Date(currStatsPart.TestDateTime).getTime() -
                      startTime.getTime()) /
                    1000 /
                    60;
                  const runTheory =
                    lastCycleTime > 0
                      ? ((totalCount > 0 ? totalCount - 1 : 0) *
                          lastCycleTime) /
                        60
                      : 0;
                  const efficiency =
                    runActual > 0 ? (runTheory / runActual) * 100 : 0;
                  const pph = runActual > 0 ? totalCount / (runActual / 60) : 0;
                  const row: StatsDataOperatorRow = {
                    id: i,
                    Asset: assetInfo?.Asset ?? currStatsPart.AssetID.toString(),
                    // PartNumber:
                    //   lastPartInfo?.PartNumber ?? currStatsPart.PNID.toString(),
                    PartNumber: lastPartInfo?.PartNumber ?? "",
                    Date: startTime,
                    StartTime: startTime,
                    EndTime: new Date(currStatsPart.TestDateTime),
                    Passes: passCount,
                    Fails: failCount,
                    Line: assetInfo?.Line ?? biInfo?.line ?? "",
                    Operator: currStatsPart.OperatorID?.toString() ?? "00000",
                    CycleTime: lastCycleTime,
                    RunActual: runActual,
                    RunTheory: runTheory,
                    Efficiency: efficiency,
                    PartsPerHour: pph,
                  };
                  if (
                    row.Operator !== "00000" ||
                    row.Asset.startsWith("CMB-")
                  ) {
                    finalStats.push(row);
                  }

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
                  const runTheory =
                    lastCycleTime > 0
                      ? ((totalCount > 0 ? totalCount - 1 : 0) *
                          lastCycleTime) /
                        60
                      : 0;
                  const efficiency =
                    runActual > 0 ? (runTheory / runActual) * 100 : 0;
                  const pph = runActual > 0 ? totalCount / (runActual / 60) : 0;
                  const row: StatsDataOperatorRow = {
                    id: i,
                    Asset: assetInfo?.Asset ?? currStatsPart.AssetID.toString(),
                    // PartNumber:
                    //   lastPartInfo?.PartNumber ?? currStatsPart.PNID.toString(),
                    PartNumber: lastPartInfo?.PartNumber ?? "",
                    Date: startTime,
                    StartTime: startTime,
                    EndTime: new Date(currStatsPart.TestDateTime),
                    Passes: passCount,
                    Fails: failCount,
                    Line: assetInfo?.Line ?? biInfo?.line ?? "",
                    Operator: currStatsPart.OperatorID?.toString() ?? "00000",
                    CycleTime: lastCycleTime,
                    RunActual: runActual,
                    RunTheory: runTheory,
                    Efficiency: efficiency,
                    PartsPerHour: pph,
                  };
                  if (
                    row.Operator !== "00000" ||
                    row.Asset.startsWith("CMB-")
                  ) {
                    finalStats.push(row);
                  }
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
  finalStats = finalStats.filter((x) => x.PartNumber);
  // finalStats = finalStats.filter(
  //   (x) => x.Operator !== "00000" && !x.Asset.startsWith("CMB-")
  // );
  finalStats.forEach((x, i) => (x.id = i));
  return finalStats;
};

export const getFinalDataOperator = (
  processData: SnRow[],
  partData: PnRow[],
  assetData: AssetRow[]
) => {
  let passCount = 0;
  let failCount = 0;
  let lastOp = 0;
  let lastPart = 0;
  let data: ProcessDataOperator[] = [];
  for (let i = 0; i < processData.length; ++i) {
    const x = processData[i];
    if (
      lastPart !== x.PNID ||
      (x.OperatorID &&
        x.OperatorID !== null &&
        x.OperatorID !== 0 &&
        lastOp !== x.OperatorID)
    ) {
      passCount = 0;
      failCount = 0;
    }
    lastPart = x.PNID;
    lastOp = x.OperatorID ?? lastOp;
    if (!x.Failed) passCount += 1;
    else failCount += 1;

    const assetName = assetData.find((a) => a.AssetID === x.AssetID);
    const partNum = partData.find((a) => a.PNID === lastPart);

    if (partNum === undefined) continue;

    const obj: ProcessDataOperator = {
      id: i,
      Asset: assetName?.Asset ?? "-",
      PartNumber: partNum?.PartNumber ?? "000-0000",
      Date: new Date(x.TestDateTime),
      StartTime: new Date(x.TestDateTime),
      EndTime: new Date(x.TestDateTime),
      Passes: passCount,
      Fails: failCount,
      OperationId: x.OperationID ?? "",
      Line: assetName?.Line ?? "LINE",
      Label: "label",
      Operator: lastOp.toString(),
      Description: "",
      CycleTime: "",
      Revision: x.RevID?.toString() ?? "",
      Sender: "",
      TestPlan: "",
    };
    // return obj;
    data.push(obj);
  }
  let finalData: ProcessDataOperator[] = [];
  let startTime = new Date("1900-09-09");
  data.forEach((row, index) => {
    if (index < data.length - 1) {
      if (index === 0) {
        startTime = row.StartTime;
      } else if (
        row.PartNumber !== data[index - 1].PartNumber ||
        row.Operator !== data[index - 1].Operator
      ) {
        startTime = row.StartTime;
      }
      if (
        row.PartNumber !== data[index + 1].PartNumber ||
        row.Operator !== data[index + 1].Operator
      ) {
        let obj = { ...row };
        obj.Date = startTime;
        obj.StartTime = startTime;
        finalData.push(obj);
      }
    } else {
      let obj = { ...row };
      obj.Date = startTime;
      obj.StartTime = startTime;
      finalData.push(obj);
    }
  });
  return finalData;
};

export const getFinalProcessDataOperatorTotals = async (
  processData: ProcessDataOperator[],
  orgCode: number,
  cycleTimeList: { part: string; asset: string; cycle: number }[],
  cycleTimeInfo: LineOperationPart[]
) => {
  let processOperators: ProcessDataOperatorTotals[] = [];
  //   let cycleTimeList: { part: string; asset: string; cycle: number }[] = [];
  for (let index = 0; index < processData.length; ++index) {
    const row = processData[index];
    if (index === 0) {
      let cycleTime = 0;
      const foundCycle = cycleTimeList.find(
        (x) => x.part === row.PartNumber && x.asset === row.Asset
      );
      if (foundCycle) {
        cycleTime = foundCycle.cycle;
      } else {
        if (row.Asset.includes("CMB2")) {
          cycleTime = getPartCycleTime(
            row.PartNumber,
            orgCode,
            "Combo2",
            cycleTimeInfo
          );
        } else if (row.Asset.includes("CMB")) {
          cycleTime = getPartCycleTime(
            row.PartNumber,
            orgCode,
            "Combo",
            cycleTimeInfo
          );
        } else if (row.Asset.includes("MR")) {
          cycleTime = getPartCycleTime(
            row.PartNumber,
            orgCode,
            "MonoRail",
            cycleTimeInfo
          );
        } else if (row.Asset.includes("PCB")) {
          cycleTime = getPartCycleTime(
            row.PartNumber,
            orgCode,
            "Press",
            cycleTimeInfo
          );
        }
        cycleTimeList.push({
          part: row.PartNumber,
          asset: row.Asset,
          cycle: cycleTime,
        });
      }

      const runActual =
        (row.EndTime.getTime() - row.StartTime.getTime()) / 60000;
      const runTheory =
        cycleTime > 0 ? ((row.Passes + row.Fails - 1) * cycleTime) / 60 : 0;
      const efficiency = runActual > 0 ? (runTheory / runActual) * 100 : 100;
      const partsPerHour =
        runActual > 0
          ? ((row.Passes + row.Fails - 1) / runActual) * 60
          : row.Passes + row.Fails - 1;

      const obj: ProcessDataOperatorTotals = {
        id: row.id,
        Asset: row.Asset,
        PartNumber: row.PartNumber,
        Date: row.Date,
        StartTime: row.StartTime,
        EndTime: row.EndTime,
        Passes: row.Passes,
        Fails: row.Fails,
        OperationId: row.OperationId,
        Line: row.Line ?? "",
        Label: row.Label ?? "",
        Operator: row.Operator ?? "",
        Revision: row.Revision ?? "",
        Sender: row.Sender ?? "",
        TestPlan: row.TestPlan ?? "",
        CycleTime: cycleTime,
        RunActual: runActual,
        RunTheory: runTheory,
        Efficiency: efficiency,
        PartsPerHour: partsPerHour,
      };
      processOperators.push(obj);
    } else if (processOperators.length > 0) {
      let cycleTime = 0;
      const foundCycle = cycleTimeList.find(
        (x) => x.part === row.PartNumber && x.asset === row.Asset
      );
      if (foundCycle) {
        cycleTime = foundCycle.cycle;
      } else {
        if (row.Asset.includes("CMB2")) {
          cycleTime = getPartCycleTime(
            row.PartNumber,
            orgCode,
            "Combo2",
            cycleTimeInfo
          );
        } else if (row.Asset.includes("CMB")) {
          cycleTime = getPartCycleTime(
            row.PartNumber,
            orgCode,
            "Combo",
            cycleTimeInfo
          );
        } else if (row.Asset.includes("MR")) {
          cycleTime = getPartCycleTime(
            row.PartNumber,
            orgCode,
            "MonoRail",
            cycleTimeInfo
          );
        } else if (row.Asset.includes("PCB")) {
          cycleTime = getPartCycleTime(
            row.PartNumber,
            orgCode,
            "Press",
            cycleTimeInfo
          );
        }
        cycleTimeList.push({
          part: row.PartNumber,
          asset: row.Asset,
          cycle: cycleTime,
        });
      }

      const runActual =
        (row.EndTime.getTime() - row.StartTime.getTime()) / 60000;
      const runTheory =
        cycleTime > 0 ? ((row.Passes + row.Fails - 1) * cycleTime) / 60 : 0;
      const efficiency = runActual > 0 ? (runTheory / runActual) * 100 : 100;
      const partsPerHour =
        runActual > 0
          ? ((row.Passes + row.Fails - 1) / runActual) * 60
          : row.Passes + row.Fails - 1;

      const obj: ProcessDataOperatorTotals = {
        id: row.id,
        Asset: row.Asset,
        PartNumber: row.PartNumber,
        Date: row.Date,
        StartTime: row.StartTime,
        EndTime: row.EndTime,
        Passes: row.Passes,
        Fails: row.Fails,
        OperationId: row.OperationId,
        Line: row.Line ?? "",
        Label: row.Label ?? "",
        Operator: row.Operator ?? "",
        Revision: row.Revision ?? "",
        Sender: row.Sender ?? "",
        TestPlan: row.TestPlan ?? "",
        CycleTime: cycleTime,
        RunActual: runActual,
        RunTheory: runTheory,
        Efficiency: efficiency,
        PartsPerHour: partsPerHour,
      };
      processOperators.push(obj);
    }
  }
  processOperators.forEach((x, i) => (x.id = i));

  return processOperators;
};
