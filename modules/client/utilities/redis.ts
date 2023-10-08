import { UserAppData } from "core/schemas/user-app-data.gen";
import {
  EmployeeInfoGentex,
  ProcessDataExport,
  UserLumenInfo,
} from "./DataTypes";
import { dateToString } from "./DateUtility";
import { useGetProcessDataRedisQuery } from "client/graphql/types.gen";

export const getAssetListRedis = async () => {
  try {
    const url = `http://localhost:8000/api/assetList`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    const result = await response.json();
    if (result && result.data) {
      const assetList: string[] = result.data;
      return assetList;
    }
  } catch (error) {
    console.log("ERROR: " + error);
  }
  return undefined;
};

export const getEmployeeDirectoryRedis = async () => {
  try {
    const url = `http://localhost:8000/api/employeeDirectory`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    const result = await response.json();
    if (result && result.data) {
      const userData: EmployeeInfoGentex[] = JSON.parse(result.data);
      return userData;
    }

    return undefined;
  } catch (error) {
    console.log("ERROR: " + error);
    return undefined;
  }
};

export const getUserInfoLumen = async (userId: string) => {
  try {
    const url = `http://localhost:8000/api/lumen/${userId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    const result = await response.json();
    if (result && result.data) {
      const userData: UserLumenInfo = JSON.parse(result.data);
      return userData;
    }

    return undefined;
  } catch (error) {
    console.log("ERROR: " + error);
    return undefined;
  }
};

export const getUserDataFromRedis = async (userName: string) => {
  try {
    const url = `http://localhost:8000/api/user/${userName}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    const result = await response.json();
    if (result && result.data) {
      const userData: UserAppData = JSON.parse(result.data);
      return userData;
    }

    return undefined;
  } catch (error) {
    console.log("ERROR: " + error);
    return undefined;
  }
};

export const saveUserDataToRedis = async (
  userName: string,
  userData: UserAppData
) => {
  try {
    const dataBody = JSON.stringify(userData);
    const url = `http://localhost:8000/api/user/${userName}`;
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", url, false);
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.send(dataBody);
    xmlHttp.onerror = () => {
      throw new Error(`Error!`);
    };
    return true;
  } catch (error) {
    console.log("ERROR: " + error);
    return false;
  }
};

export const getProcessDataExport = async (asset: string, date: Date) => {
  try {
    const url = `http://localhost:8000/api/processdata/${asset}/${dateToString(
      date
    )}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    const result = await response.json();
    if (result && result.data) {
      let finalData: ProcessDataExport[] = result.data.map((x: any) => {
        let data: ProcessDataExport = { ...x };
        data.OpEndTime = new Date(x.OpEndTime);
        return data;
      });
      finalData = finalData.filter((x) => x.Operator && x.Operator !== "");
      return finalData;
    }
  } catch (error) {
    console.log(error);
  }
  return undefined;
};

const processDataRedis = async (asset: string, date: string) => {
  try {
    const url = `http://${window.location.host}/graphql`;
    const body = JSON.stringify({
      query: `query { getProcessDataRedis(asset: \"${asset}\", date: \"${date}\") }`,
    });
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    const result = await response.json();
    if (result && result.data && result.data.getProcessDataRedis) {
      let finalData: ProcessDataExport[] = result.data.getProcessDataRedis.map(
        (x: any) => {
          let data: ProcessDataExport = { ...x };
          data.OpEndTime = new Date(x.OpEndTime);
          return data;
        }
      );
      finalData = finalData.filter((x) => x.Operator && x.Operator !== "");
      finalData = finalData.filter(
        (x) =>
          !x.PartNumber.includes("I") &&
          !x.PartNumber.includes("E") &&
          !x.PartNumber.includes("U") &&
          !x.PartNumber.includes("0000")
      );
      if (asset.includes("PCB")) {
        finalData = finalData.filter(
          (x) =>
            (x.Description && x.Description === "Main_Board") ||
            (x.CycleTime && x.CycleTime !== "")
        );
      }
      return finalData;
    }
  } catch (error) {
    console.log(error);
  }
  return undefined;
};

export const getProcessDataExportRange = async (
  asset: string,
  startDate: Date,
  endDate: Date
) => {
  try {
    // const start = dateToString(startDate);
    // const end = dateToString(endDate);

    let totalData: ProcessDataExport[] = [];
    for (
      let start = new Date(startDate);
      start.getTime() <= endDate.getTime();
      start.setDate(start.getDate() + 1)
    ) {
      const date = dateToString(start);
      const data = await processDataRedis(asset, date);
      if (data) totalData = totalData.concat(data);

      //   const result = await apolloClient.query({
      //     query: qr ,
      //     variables: {}
      // })
      // console.log(data);
    }

    totalData = totalData.filter((x) => x.Operator && x.Operator !== "");
    totalData = totalData.sort(
      (a, b) => a.OpEndTime.getTime() - b.OpEndTime.getTime()
    );
    return totalData;
  } catch (error) {
    console.log(error);
  }
  return undefined;
};

// export const getProcessDataExportRange = async (
//   asset: string,
//   startDate: Date,
//   endDate: Date
// ) => {
//   try {
//     const start = dateToString(startDate);
//     const end = dateToString(endDate);
//     // const url = `http://localhost:8000/api/processdata/${asset}/${start}/${end}`;
//     const url = `http://zvm-msgprod/MES/ProcessDataExportApi/api/v1/processdataexport/processDataExport?Assets=${asset}&StartDate=${start}&EndDate=${end}&TopNRows=-1&UserMetadataKeys=line%2Clabel%2Coperator%2Cdescription%2Ccycletime%2Crevision%2Csender%2Ctestplan%2Cbarcode`;
//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Error! status: ${response.status}`);
//     }
//     const jsonData = await response.json();
//     if (jsonData && jsonData.length > 0) {
//       let finalData: ProcessDataExport[] = jsonData.map((x: any) => {
//         // let data: ProcessDataExport = { ...x };
//         // console.log(x["KeyToValueDictionary"]["OPENDTIME"]);
//         // console.log(new Date(x["KeyToValueDictionary"]["OPENDTIME"]));
//         let data: ProcessDataExport = {
//           MetaDataId: x["MetaDataId"],
//           Asset: x["KeyToValueDictionary"]["ASSET"],
//           IdentifierCode: x["KeyToValueDictionary"]["IDENTIFIERCODE"],
//           IdentifierCode2: x["KeyToValueDictionary"]["IDENTIFIERCODE2"],
//           PartNumber: x["KeyToValueDictionary"]["PARTNUMBER"],
//           OpEndTime: new Date(x["KeyToValueDictionary"]["OPENDTIME"]),
//           PassFail: x["KeyToValueDictionary"]["PASSFAIL"],
//           OperationId: x["KeyToValueDictionary"]["OPERATIONID"],
//           Line: x["KeyToValueDictionary"]["LINE"],
//           Label: x["KeyToValueDictionary"]["LABEL"],
//           Operator: x["KeyToValueDictionary"]["OPERATOR"],
//           Description: x["KeyToValueDictionary"]["DESCRIPTION"],
//           CycleTime: x["KeyToValueDictionary"]["CYCLETIME"],
//           Revision: x["KeyToValueDictionary"]["REVISION"],
//           Sender: x["KeyToValueDictionary"]["SENDER"],
//           TestPlan: x["KeyToValueDictionary"]["TESTPLAN"],
//           Barcode: x["KeyToValueDictionary"]["BARCODE"],
//         };
//         data.OpEndTime = new Date(x["KeyToValueDictionary"]["OPENDTIME"]);
//         return data;
//       });
//       finalData = finalData.filter((x) => x.Operator && x.Operator !== "");
//       finalData = finalData.sort(
//         (a, b) => a.OpEndTime.getTime() - b.OpEndTime.getTime()
//       );
//       return finalData;
//     }
//   } catch (error) {
//     console.log(error);
//   }
//   return undefined;
// };

// export const getProcessOperatorTotalsRange = async (
//   asset: string,
//   startDate: Date,
//   endDate: Date
// ) => {
//   try {
//     let finalData: ProcessDataOperatorTotals[] = [];
//     for (
//       let start = new Date(startDate);
//       start.getTime() <= endDate.getTime();
//       start.setDate(start.getDate() + 1)
//     ) {
//       const dateStr = dateToString(start);
//       const url = `http://localhost:8000/api/processdata/${asset}/${dateStr}`;
//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//         },
//       });
//       if (!response.ok) {
//         throw new Error(`Error! status: ${response.status}`);
//       }
//       const result = await response.json();
//       if (result && result.data && result.data.length > 0) {
//         let redisData = result.data;
//         const newData: ProcessDataOperatorTotals[] = redisData.map((x: any) => {
//           let obj: ProcessDataOperatorTotals = { ...x };
//           obj.Date = new Date(x.Date);
//           obj.StartTime = new Date(x.StartTime);
//           obj.EndTime = new Date(x.EndTime);
//           return obj;
//         });
//         finalData = finalData.concat(newData);
//       }
//     }
//     return finalData;
//   } catch (error) {
//     console.log("ERROR: " + error);
//     return undefined;
//   }
// };
