import { dateToString } from "./DataUtility";
import {
  ProcessDataExportRaw,
  ProcessDataExport,
  ProcessDataOperator,
  UserLumenInfo,
  EmployeeInfoGentex,
} from "../utils/DataTypes";
import { JSDOM } from "jsdom";

export const getEmployeeInfoDirectory = async () => {
  try {
    const url = `https://api.gentex.com/employeedemo/v1/employees`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    const result: EmployeeInfoGentex[] = await response.json();
    let employees: EmployeeInfoGentex[] = result.map((item) => {
      let obj: EmployeeInfoGentex = { ...item };
      obj.username = obj.email.replace("@gentex.com", "");
      return obj;
    });
    employees = employees.sort((a, b) =>
      a.employeeNumber.localeCompare(b.employeeNumber)
    );

    return employees;
  } catch (error) {
    console.log("ERROR: " + error);
    return undefined;
  }
};

export const getUserInfoLumen = async (userId: string) => {
  try {
    const url = `https://lumen.gentex.com/PROD/Person/${userId}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    const html = await response.text();
    const dom = new JSDOM(html);

    const nameElems =
      dom.window.document.getElementsByClassName("keyed_name fn");
    const posElems = dom.window.document.getElementsByClassName("descrip");
    const locElems = dom.window.document.getElementsByClassName("item");
    const userElems = dom.window.document.getElementsByClassName("user_name");

    const name =
      nameElems.length > 0 && nameElems[0].textContent
        ? nameElems[0].textContent.replace(/[{()}]/g, "")
        : undefined;
    const position =
      posElems.length > 0 && posElems[0].textContent
        ? posElems[0].textContent
        : undefined;
    const location =
      locElems.length > 1 && locElems[1].textContent
        ? locElems[1].textContent
        : undefined;
    const userName =
      userElems.length > 0 && userElems[0].textContent
        ? userElems[0].textContent
        : undefined;

    if (name) {
      const result: UserLumenInfo = {
        name: name,
        userName: userName ?? "Unknown",
        position: position ?? "Inactive",
        location: location ?? "Inactive",
      };
      return result;
    } else {
      return undefined;
    }
  } catch (error) {
    console.log("ERROR: " + error);
  }
  return undefined;
};

export const getProcessDataExport = async (
  asset: string,
  startDate: Date,
  endDate: Date
) => {
  try {
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);
    const dateStart = dateToString(startDate);
    const dateEnd = dateToString(end);
    const url = `http://zvm-msgprod/MES/ProcessDataExportApi/api/v1/processdataexport/processDataExport?Assets=${asset}&StartDate=${dateStart}&EndDate=${dateEnd}&TopNRows=-1&UserMetadataKeys=line%2Clabel%2Coperator%2Cdescription%2Ccycletime%2Crevision%2Csender%2Ctestplan%2Cbarcode`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    const result: ProcessDataExportRaw[] = await response.json();
    let processData: ProcessDataExport[] = result.map((item, index) => {
      return {
        id: index,
        MetaDataId: item.MetaDataId,
        Asset: item.KeyToValueDictionary.ASSET,
        IdentifierCode: item.KeyToValueDictionary.IDENTIFIERCODE,
        IdentifierCode2: item.KeyToValueDictionary.IDENTIFIERCODE2,
        PartNumber: item.KeyToValueDictionary.PARTNUMBER,
        OpEndTime: new Date(item.KeyToValueDictionary.OPENDTIME),
        PassFail: item.KeyToValueDictionary.PASSFAIL === "PASS" ? true : false,
        OperationId: item.KeyToValueDictionary.OPERATIONID,
        Line: item.KeyToValueDictionary.LINE,
        Label: item.KeyToValueDictionary.LABEL,
        Operator: item.KeyToValueDictionary.OPERATOR,
        Description: item.KeyToValueDictionary.DESCRIPTION,
        CycleTime: item.KeyToValueDictionary.CYCLETIME,
        Revision: item.KeyToValueDictionary.REVISION,
        Sender: item.KeyToValueDictionary.SENDER,
        TestPlan: item.KeyToValueDictionary.TESTPLAN,
        Barcode: item.KeyToValueDictionary.BARCODE,
      };
    });
    processData = processData.sort(
      (a, b) => a.OpEndTime.getTime() - b.OpEndTime.getTime()
    );
    processData = processData.filter(
      (x) =>
        !x.PartNumber.includes("I") &&
        !x.PartNumber.includes("E") &&
        !x.PartNumber.includes("U") &&
        !x.PartNumber.includes("0000")
    );
    if (asset.includes("PCB")) {
      processData = processData.filter(
        (x) =>
          (x.Description && x.Description === "Main_Board") ||
          (x.CycleTime && x.CycleTime !== "")
      );
    }

    return processData;
  } catch (error) {
    console.log("ERROR: " + error);
    return undefined;
  }
};

export const getFinalProcessDataOperatorCombo = (
  processData: ProcessDataExport[]
) => {
  let passCount = 0;
  let failCount = 0;
  let lastOp = "";
  let lastPart = "";
  let lastDate = new Date("1900-09-09");
  const data: ProcessDataOperator[] = processData
    .filter((x) => x.Operator !== undefined)
    .sort((a, b) => a.OpEndTime.getTime() - b.OpEndTime.getTime())
    .map((x, i) => {
      if (
        lastPart !== x.PartNumber ||
        lastOp !== x.Operator ||
        lastDate.getDate() !== x.OpEndTime.getDate()
      ) {
        passCount = 0;
        failCount = 0;
      }
      lastPart = x.PartNumber;
      lastOp = x.Operator ?? "";
      lastDate = x.OpEndTime;
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
        row.Operator !== data[index - 1].Operator ||
        row.StartTime.getDate() !== data[index - 1].EndTime.getDate()
      ) {
        startTime = row.StartTime;
      }
      if (
        index !== 0 &&
        (row.PartNumber !== data[index + 1].PartNumber ||
          row.Operator !== data[index + 1].Operator ||
          row.EndTime.getDate() !== data[index + 1].StartTime.getDate())
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

export const getFinalProcessDataOperatorPress = (
  processData: ProcessDataExport[]
) => {
  let passCount = 0;
  let failCount = 0;
  let lastOp = "";
  let lastPart = "";
  let lastDate = new Date("1900-09-09");
  let data: ProcessDataOperator[] = [];
  processData
    .sort((a, b) => a.OpEndTime.getTime() - b.OpEndTime.getTime())
    .forEach((x, i) => {
      if (
        lastPart !== x.PartNumber ||
        (x.Operator && x.Operator !== "" && lastOp !== x.Operator) ||
        lastDate.getDate() !== x.OpEndTime.getDate()
      ) {
        passCount = 0;
        failCount = 0;
      }
      if (
        (x.Description && x.Description === "Main_Board") ||
        (x.CycleTime && x.CycleTime !== "")
      ) {
        lastPart = x.PartNumber;
        lastOp = x.Operator ?? lastOp;
        lastDate = x.OpEndTime;
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
        data.push(obj);
      }
    });
  let finalData: ProcessDataOperator[] = [];
  let startTime = new Date("1900-09-09");
  data.forEach((row, index) => {
    if (index < data.length - 1) {
      if (index === 0) {
        startTime = row.StartTime;
      } else if (
        row.PartNumber !== data[index - 1].PartNumber ||
        row.Operator !== data[index - 1].Operator ||
        row.StartTime.getDate() !== data[index - 1].EndTime.getDate()
      ) {
        startTime = row.StartTime;
      }
      if (
        index !== 0 &&
        (row.PartNumber !== data[index + 1].PartNumber ||
          row.Operator !== data[index + 1].Operator ||
          row.EndTime.getDate() !== data[index + 1].StartTime.getDate())
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

// export const getFinalProcessDataOperatorTotals = async (
//   processData: ProcessDataOperator[]
// ) => {
//   let processOperators: ProcessDataOperatorTotals[] = [];
//   //let cycleTimeList: { part: string; cycle: number }[] = [];
//   for (let index = 0; index < processData.length; ++index) {
//     const row = processData[index];
//     if (index === 0) {
//       let cycleTime = 0;
//       if (row.Asset.includes("CMB")) {
//         cycleTime = await getPartCycleTimeCombo(row.PartNumber, row.Line ?? "");
//       } else if (row.Asset.includes("MR")) {
//         cycleTime = await getPartCycleTimeMonoRail(
//           row.PartNumber,
//           row.Line ?? ""
//         );
//       } else if (row.Asset.includes("PCB")) {
//         cycleTime = await getPartCycleTimePress(row.PartNumber, row.Line ?? "");
//       }
//       //cycleTimeList.push({ part: row.PartNumber, cycle: cycleTime });
//       const runActual =
//         (row.EndTime.getTime() - row.StartTime.getTime()) / 60000;
//       const runTheory =
//         cycleTime > 0 ? ((row.Passes + row.Fails) * cycleTime) / 60 : 0;
//       const efficiency = runActual > 0 ? (runTheory / runActual) * 100 : 100;
//       const partsPerHour =
//         runActual > 0
//           ? ((row.Passes + row.Fails) / runActual) * 60
//           : row.Passes + row.Fails;

//       const obj: ProcessDataOperatorTotals = {
//         id: row.id,
//         Asset: row.Asset,
//         PartNumber: row.PartNumber,
//         Date: row.Date,
//         StartTime: row.StartTime,
//         EndTime: row.EndTime,
//         Passes: row.Passes,
//         Fails: row.Fails,
//         OperationId: row.OperationId,
//         Line: row.Line ?? "",
//         Label: row.Label ?? "",
//         Operator: row.Operator ?? "",
//         Revision: row.Revision ?? "",
//         Sender: row.Sender ?? "",
//         TestPlan: row.TestPlan ?? "",
//         CycleTime: cycleTime,
//         RunActual: runActual,
//         RunTheory: runTheory,
//         Efficiency: efficiency,
//         PartsPerHour: partsPerHour,
//       };
//       processOperators.push(obj);
//     } else if (processOperators.length > 0) {
//       let matched = false;
//       for (let i = 0; i < processOperators.length; ++i) {
//         const data = processOperators[i];
//         if (
//           data.Date.getDate() === row.Date.getDate() &&
//           data.Operator === row.Operator &&
//           data.PartNumber === row.PartNumber
//         ) {
//           matched = true;
//           let match = { ...data };
//           const runActual =
//             (row.EndTime.getTime() - row.StartTime.getTime()) / 60000;
//           const runTheory =
//             data.CycleTime > 0
//               ? ((row.Passes + row.Fails) * data.CycleTime) / 60
//               : 0;
//           match.RunActual += runActual;
//           match.RunTheory += runTheory;
//           match.Passes += row.Passes;
//           match.Fails += row.Fails;
//           const efficiency =
//             match.RunActual > 0
//               ? (match.RunTheory / match.RunActual) * 100
//               : 100;
//           const partsPerHour =
//             match.RunActual > 0
//               ? ((match.Passes + match.Fails) / match.RunActual) * 60
//               : match.Passes + match.Fails;
//           match.Efficiency = efficiency;
//           match.PartsPerHour = partsPerHour;
//           match.EndTime = row.EndTime;
//           processOperators[i] = match;
//           break;
//         }
//       }
//       if (!matched) {
//         let cycleTime = 0;
//         if (row.Asset.includes("CMB")) {
//           cycleTime = await getPartCycleTimeCombo(
//             row.PartNumber,
//             row.Line ?? ""
//           );
//         } else if (row.Asset.includes("MR")) {
//           cycleTime = await getPartCycleTimeMonoRail(
//             row.PartNumber,
//             row.Line ?? ""
//           );
//         } else if (row.Asset.includes("PCB")) {
//           cycleTime = await getPartCycleTimePress(
//             row.PartNumber,
//             row.Line ?? ""
//           );
//         }
//         // const foundCycle = cycleTimeList.find((x) => x.part === row.PartNumber);
//         // const cycleTime = foundCycle
//         //   ? foundCycle.cycle
//         //   : await getPartCycleTime(row.PartNumber, row.Line);
//         const runActual =
//           (row.EndTime.getTime() - row.StartTime.getTime()) / 60000;
//         const runTheory =
//           cycleTime > 0 ? ((row.Passes + row.Fails) * cycleTime) / 60 : 0;
//         const efficiency = runActual > 0 ? (runTheory / runActual) * 100 : 100;
//         const partsPerHour =
//           runActual > 0
//             ? ((row.Passes + row.Fails) / runActual) * 60
//             : row.Passes + row.Fails;

//         const obj: ProcessDataOperatorTotals = {
//           id: row.id,
//           Asset: row.Asset,
//           PartNumber: row.PartNumber,
//           Date: row.Date,
//           StartTime: row.StartTime,
//           EndTime: row.EndTime,
//           Passes: row.Passes,
//           Fails: row.Fails,
//           OperationId: row.OperationId,
//           Line: row.Line ?? "",
//           Label: row.Label ?? "",
//           Operator: row.Operator ?? "",
//           Revision: row.Revision ?? "",
//           Sender: row.Sender ?? "",
//           TestPlan: row.TestPlan ?? "",
//           CycleTime: cycleTime,
//           RunActual: runActual,
//           RunTheory: runTheory,
//           Efficiency: efficiency,
//           PartsPerHour: partsPerHour,
//         };
//         processOperators.push(obj);
//       }
//     }
//   }
//   processOperators.forEach((x, i) => (x.id = i));

//   return processOperators;
// };
