import { EmployeeInfoGentex, ProcessDataExport, UserLumenInfo } from "./types";
import { dateToString } from "./date-util";

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
//     const url = `http://localhost:8000/api/processdata/${asset}/${start}/${end}`;
//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//       },
//     });
//     if (!response.ok) {
//       throw new Error(`Error! status: ${response.status}`);
//     }
//     const result = await response.json();
//     if (result && result.data) {
//       let finalData: ProcessDataExport[] = result.data.map((x: any) => {
//         let data: ProcessDataExport = { ...x };
//         data.OpEndTime = new Date(x.OpEndTime);
//         return data;
//       });
//       finalData = finalData.filter((x) => x.Operator && x.Operator !== "");
//       return finalData;
//     }
//   } catch (error) {
//     console.log(error);
//   }
//   return undefined;
// };
