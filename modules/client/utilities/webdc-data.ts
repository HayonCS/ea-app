import { AssetRow, PnRow, SnRow } from "records/combodata";
import { ProcessDataOperator, ProcessDataOperatorTotals } from "./types";
import { getPartCycleTime } from "./mes";

export const getFinalDataOperator = (
  processData: SnRow[],
  partData: PnRow[],
  assetData: AssetRow[]
) => {
  let passCount = 0;
  let failCount = 0;
  let lastOp = 0;
  let lastPart = 0;
  const data: ProcessDataOperator[] = processData.map((x, i) => {
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
      Line: "LINE",
      Label: "label",
      Operator: lastOp.toString(),
      Description: "",
      CycleTime: "",
      Revision: x.RevID?.toString() ?? "",
      Sender: "",
      TestPlan: "",
    };
    return obj;
  });
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
  orgCode: number
) => {
  let processOperators: ProcessDataOperatorTotals[] = [];
  let cycleTimeList: { part: string; asset: string; cycle: number }[] = [];
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
          cycleTime = await getPartCycleTime(row.PartNumber, orgCode, "Combo2");
        } else if (row.Asset.includes("CMB")) {
          cycleTime = await getPartCycleTime(row.PartNumber, orgCode, "Combo");
        } else if (row.Asset.includes("MR")) {
          cycleTime = await getPartCycleTime(
            row.PartNumber,
            orgCode,
            "MonoRail"
          );
        } else if (row.Asset.includes("PCB")) {
          cycleTime = await getPartCycleTime(row.PartNumber, orgCode, "Press");
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
          cycleTime = await getPartCycleTime(row.PartNumber, orgCode, "Combo2");
        } else if (row.Asset.includes("CMB")) {
          cycleTime = await getPartCycleTime(row.PartNumber, orgCode, "Combo");
        } else if (row.Asset.includes("MR")) {
          cycleTime = await getPartCycleTime(
            row.PartNumber,
            orgCode,
            "MonoRail"
          );
        } else if (row.Asset.includes("PCB")) {
          cycleTime = await getPartCycleTime(row.PartNumber, orgCode, "Press");
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
