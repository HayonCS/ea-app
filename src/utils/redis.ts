import {
  EmployeeInfoGentex,
  ProcessDataOperatorTotals,
  UserData,
  UserLumenInfo,
} from "./DataTypes";
import { dateToString } from "./DateUtility";

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
      const userData: UserData = JSON.parse(result.data);
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
  userData: UserData
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

// export const saveUserDataToRedis = async (
//   userName: string,
//   userData: UserData
// ) => {
//   try {
//     const dataBody = JSON.stringify(userData);
//     const url = `http://localhost:8000/api/user/${userName}`;
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//       },
//       body: dataBody,
//     });
//     console.log("Body sent: " + JSON.stringify(dataBody));
//     if (!response.ok) {
//       throw new Error(`Error! status: ${response.status}`);
//     }
//     const result = await response.json();
//     if (result && result.data) {
//       console.log(result.data);
//       return result.data as boolean;
//     }

//     return false;
//   } catch (error) {
//     console.log("ERROR: " + error);
//     return false;
//   }
// };

export const getProcessOperatorTotalsRange = async (
  asset: string,
  startDate: Date,
  endDate: Date
) => {
  try {
    let finalData: ProcessDataOperatorTotals[] = [];
    for (
      let start = new Date(startDate);
      start.getTime() <= endDate.getTime();
      start.setDate(start.getDate() + 1)
    ) {
      const dateStr = dateToString(start);
      const url = `http://localhost:8000/api/processdata/${asset}/${dateStr}`;
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
      if (result && result.data && result.data.length > 0) {
        let redisData = result.data;
        const newData: ProcessDataOperatorTotals[] = redisData.map((x: any) => {
          let obj: ProcessDataOperatorTotals = { ...x };
          obj.Date = new Date(x.Date);
          obj.StartTime = new Date(x.StartTime);
          obj.EndTime = new Date(x.EndTime);
          return obj;
        });
        finalData = finalData.concat(newData);
      }
    }
    return finalData;
  } catch (error) {
    console.log("ERROR: " + error);
    return undefined;
  }
};
