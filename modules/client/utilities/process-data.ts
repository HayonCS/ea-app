import {
  ProcessDataExport,
  ProcessDataOperator,
  ProcessDataOperatorTotals,
} from "./types";
import { getPartCycleTime } from "./mes";

export const getFinalProcessDataOperator = (
  processData: ProcessDataExport[]
) => {
  let passCount = 0;
  let failCount = 0;
  let lastOp = "";
  let lastPart = "";
  const data: ProcessDataOperator[] = processData.map((x, i) => {
    if (lastPart !== x.PartNumber || lastOp !== x.Operator) {
      passCount = 0;
      failCount = 0;
    }
    lastPart = x.PartNumber;
    lastOp = x.Operator ?? "";
    if (x.PassFail) passCount += 1;
    else failCount += 1;

    const obj: ProcessDataOperator = {
      id: i,
      Asset: x.Asset,
      PartNumber: x.PartNumber,
      Date: x.OpEndTime,
      StartTime: x.OpEndTime,
      EndTime: x.OpEndTime,
      Passes: passCount,
      Fails: failCount,
      OperationId: x.OperationId,
      Line: x.Line,
      Label: x.Label,
      Operator: x.Operator,
      Description: x.Description,
      CycleTime: x.CycleTime,
      Revision: x.Revision,
      Sender: x.Sender,
      TestPlan: x.TestPlan,
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

export const getFinalProcessDataPart = (processData: ProcessDataExport[]) => {
  let passCount = 0;
  let failCount = 0;
  let lastPart = "";
  const data: ProcessDataOperator[] = processData.map((x, i) => {
    if (lastPart !== x.PartNumber) {
      passCount = 0;
      failCount = 0;
    }
    lastPart = x.PartNumber;
    if (x.PassFail) passCount += 1;
    else failCount += 1;

    const obj: ProcessDataOperator = {
      id: i,
      Asset: x.Asset,
      PartNumber: x.PartNumber,
      Date: x.OpEndTime,
      StartTime: x.OpEndTime,
      EndTime: x.OpEndTime,
      Passes: passCount,
      Fails: failCount,
      OperationId: x.OperationId,
      Line: x.Line,
      Label: x.Label,
      Operator: x.Operator,
      Description: x.Description,
      CycleTime: x.CycleTime,
      Revision: x.Revision,
      Sender: x.Sender,
      TestPlan: x.TestPlan,
    };
    return obj;
  });
  let finalData: ProcessDataOperator[] = [];
  let startTime = new Date("1900-09-09");
  data.forEach((row, index) => {
    if (index < data.length - 1) {
      if (index === 0) {
        startTime = row.StartTime;
      } else if (row.PartNumber !== data[index - 1].PartNumber) {
        startTime = row.StartTime;
      }
      if (row.PartNumber !== data[index + 1].PartNumber) {
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

export const getFinalProcessDataPartTotals = async (
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

export const compareObjectArrays = function (value: any, other: any) {
  // Get the value type
  var type = Object.prototype.toString.call(value);

  // If the two objects are not the same type, return false
  if (type !== Object.prototype.toString.call(other)) return false;

  // If items are not an object or array, return false
  if (["[object Array]", "[object Object]"].indexOf(type) < 0) return false;

  // Compare the length of the length of the two items
  var valueLen =
    type === "[object Array]" ? value.length : Object.keys(value).length;
  var otherLen =
    type === "[object Array]" ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) return false;

  // Compare two items
  var compare = function (item1: any, item2: any) {
    // Get the object type
    var itemType = Object.prototype.toString.call(item1);

    // If an object or array, compare recursively
    if (["[object Array]", "[object Object]"].indexOf(itemType) >= 0) {
      if (!compareObjectArrays(item1, item2)) return false;
    }

    // Otherwise, do a simple comparison
    else {
      // If the two items are not the same type, return false
      if (itemType !== Object.prototype.toString.call(item2)) return false;

      // Else if it's a function, convert to a string and compare
      // Otherwise, just compare
      if (itemType === "[object Function]") {
        if (item1.toString() !== item2.toString()) return false;
      } else {
        if (item1 !== item2) return false;
      }
    }
  };

  // Compare properties
  if (type === "[object Array]") {
    for (var i = 0; i < valueLen; i++) {
      if (compare(value[i], other[i]) === false) return false;
    }
  } else {
    for (var key in value) {
      //Ignore expanded state
      if (
        "expanded" === key ||
        "isModified" === key ||
        "isNewNode" === key ||
        "userName" === key ||
        "modificationTime" === key
      ) {
        continue;
      }

      // eslint-disable-next-line no-prototype-builtins
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], other[key]) === false) return false;
      }
    }
  }

  // If nothing failed, return true
  return true;
};
