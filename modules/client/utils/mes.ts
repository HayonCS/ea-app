import {
  BiAssetInfo,
  EmployeeInfoGentex,
  LineOperationPart,
  ProcessDataExport,
  ProcessDataExportRaw,
  UserInfoGentex,
} from "./DataTypes";
import { dateToString } from "./DateUtility";
import { getUserInfoLumen } from "./redis";

export const getPartCycleTime = async (
  partNumber: string,
  orgCode: string,
  assetType?: "Combo" | "Combo2" | "MonoRail" | "Press"
) => {
  try {
    const url = `https://zvm-msgprod.gentex.com/MES/Client/manufacturingweb/api/v1/bi/cycletimes/lineoperationpart?orgCode=${orgCode}&partNumber=${partNumber}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    const result: LineOperationPart[] = await response.json();
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
  } catch (error) {
    console.log(error);
  }
  return 0;
};

export const getEmployeeInfoGentex = async (userId: string) => {
  try {
    if (userId === "00000" || userId.length < 5) {
      const blank: EmployeeInfoGentex = {
        employeeNumber: userId,
        firstName: "unknown",
        lastName: "",
        username: "unknown",
        email: "unknown@gentex.com",
        cellPhone: "+16167721800",
        workPhone: "",
        location: "Unknown",
        locationId: "",
        shift: "0",
        jobTitle: "unknown",
      };
      return blank;
    }

    const url = `https://api.gentex.com/employeedemo/v1/employees/${userId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      const userInfo = await getEmployeeInfoFromUserInfo(userId);
      if (userInfo) {
        return userInfo;
      } else {
        throw new Error(`Error! status: ${response.status}`);
      }
    }
    const result: EmployeeInfoGentex = await response.json();
    if (result) {
      let r: EmployeeInfoGentex = { ...result };
      r.username = r.email.replace("@gentex.com", "");
      return result;
    }
    return undefined;
  } catch (error) {
    const userInfo = await getEmployeeInfoFromUserInfo(userId);
    if (userInfo) {
      return userInfo;
    }
    console.log("ERROR: " + error);
    return undefined;
  }
};

export const getEmployeeInfoFromUserInfo = async (userId: string) => {
  try {
    const userInfo = await getUserInfoGentex(userId);
    if (userInfo) {
      const user: EmployeeInfoGentex = {
        employeeNumber: userId,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        username: userInfo.username,
        email: userInfo.emailAddress,
        location: "Inactive",
        jobTitle: "Unknown",
      };
      return user;
    } else {
      const lumenInfo = await getUserInfoLumen(userId);
      if (lumenInfo) {
        let nameSplit = lumenInfo.name
          .split(/(\s+)/)
          .filter((e) => e.trim().length > 0);
        const first = nameSplit.length > 0 ? nameSplit[0] : "";
        nameSplit.shift();
        const last = nameSplit.length > 0 ? nameSplit.join(" ") : "";
        const user: EmployeeInfoGentex = {
          employeeNumber: userId,
          firstName: first,
          lastName: last,
          username: lumenInfo.userName,
          email: lumenInfo.userName + "@gentex.com",
          location: lumenInfo.location,
          jobTitle: lumenInfo.position,
        };
        return user;
      }
    }
    return undefined;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const getUserInfoGentex = async (
  user: string,
  includeGroups?: boolean
) => {
  try {
    const url = `https://zvm-msgprod.gentex.com/SecurityWeb/api/v1/user/${user}?includeGroups=${
      includeGroups ?? false
    }`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result: UserInfoGentex = await response.json();
    if (result) {
      return result;
    }
  } catch (error) {
    console.log(error);
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
    const url = `http://zvm-msgprod.gentex.com/MES/ProcessDataExportApi/api/v1/processdataexport/processDataExport?Assets=${asset}&StartDate=${dateStart}&EndDate=${dateEnd}&TopNRows=-1&UserMetadataKeys=Operator%2Cline%2Clabel%2Cdescription%2Ccycletime%2Crevision%2Csender%2Ctestplan%2Cbarcode`;
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
    let lastOperator = "";
    let processData: ProcessDataExport[] = result.map((item: any) => {
      if (item.KeyToValueDictionary.OPERATOR)
        lastOperator = item.KeyToValueDictionary.OPERATOR;
      return {
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
        Operator: item.KeyToValueDictionary.OPERATOR ?? lastOperator,
        Description: item.KeyToValueDictionary.DESCRIPTION,
        CycleTime: item.KeyToValueDictionary.CYCLETIME,
        Revision: item.KeyToValueDictionary.REVISION,
        Sender: item.KeyToValueDictionary.SENDER,
        TestPlan: item.KeyToValueDictionary.TESTPLAN,
        Barcode: item.KeyToValueDictionary.BARCODE,
      };
    });
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

    processData = processData.sort(
      (a, b) => a.OpEndTime.getTime() - b.OpEndTime.getTime()
    );

    return processData;
  } catch (error) {
    console.log("ERROR: " + error);
    return undefined;
  }
};

// export const getProcessDataExport = async (
//   asset: string,
//   startDate: Date,
//   endDate: Date
// ) => {
//   try {
//     const end = new Date(endDate);
//     end.setDate(end.getDate() + 1);
//     const dateStart = dateToString(startDate);
//     const dateEnd = dateToString(end);
//     const url = `http://zvm-msgprod.gentex.com/MES/ProcessDataExportApi/api/v1/processdataexport/processDataExport?Assets=${asset}&StartDate=${dateStart}&EndDate=${dateEnd}&TopNRows=-1&UserMetadataKeys=Operator%2Cline%2Clabel%2Cdescription%2Ccycletime%2Crevision%2Csender%2Ctestplan%2Cbarcode`;
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
//     console.log(result);
//     let processData: ProcessDataExport[] = result.map((item: any) => {
//       return {
//         MetaDataId: item.MetaDataId,
//         Asset: item.KeyToValueDictionary.ASSET,
//         IdentifierCode: item.KeyToValueDictionary.IDENTIFIERCODE,
//         IdentifierCode2: item.KeyToValueDictionary.IDENTIFIERCODE2,
//         PartNumber: item.KeyToValueDictionary.PARTNUMBER,
//         OpEndTime: new Date(item.KeyToValueDictionary.OPENDTIME),
//         PassFail: item.KeyToValueDictionary.PASSFAIL === "PASS" ? true : false,
//         OperationId: item.KeyToValueDictionary.OPERATIONID,
//         Line: item.KeyToValueDictionary.LINE,
//         Label: item.KeyToValueDictionary.LABEL,
//         Operator: item.KeyToValueDictionary.OPERATOR,
//         Description: item.KeyToValueDictionary.DESCRIPTION,
//         CycleTime: item.KeyToValueDictionary.CYCLETIME,
//         Revision: item.KeyToValueDictionary.REVISION,
//         Sender: item.KeyToValueDictionary.SENDER,
//         TestPlan: item.KeyToValueDictionary.TESTPLAN,
//         Barcode: item.KeyToValueDictionary.BARCODE,
//       };
//     });
//     processData = processData.filter(
//       (x) =>
//         !x.PartNumber.includes("I") &&
//         !x.PartNumber.includes("E") &&
//         !x.PartNumber.includes("U") &&
//         !x.PartNumber.includes("0000")
//     );
//     if (asset.includes("PCB")) {
//       processData = processData.filter(
//         (x) =>
//           (x.Description && x.Description === "Main_Board") ||
//           (x.CycleTime && x.CycleTime !== "")
//       );
//     }

//     processData = processData.sort(
//       (a, b) => a.OpEndTime.getTime() - b.OpEndTime.getTime()
//     );

//     return processData;
//   } catch (error) {
//     console.log("ERROR: " + error);
//     return undefined;
//   }
// };

export const getBiAssetInfo = async (asset: string) => {
  try {
    const url = `https://zvm-msgprod.gentex.com/MES/Client/manufacturingweb/api/v1/bi/assets?assetName=${asset}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result: BiAssetInfo[] = await response.json();
    if (result.length > 0) {
      return result[0];
    }
  } catch (error) {
    console.log(error);
  }
  return undefined;
};
