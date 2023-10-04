import { UserAppData } from "core/schemas/user-app-data.gen";
import {
  EmployeeInfoGentex,
  ProcessDataExport,
  UserLumenInfo,
} from "./DataTypes";
import { dateToString } from "./DateUtility";

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

export const getProcessDataExportRange = async (
  asset: string,
  startDate: Date,
  endDate: Date
) => {
  try {
    const start = dateToString(startDate);
    const end = dateToString(endDate);
    const url = `http://localhost:8000/api/processdata/${asset}/${start}/${end}`;
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
