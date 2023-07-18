import {
  EmployeeInfoGentex,
  LineOperationPart,
  ProcessDataExport,
  ProcessDataExportRaw,
  UserInfoGentex,
} from "./DataTypes";
import { dateToString } from "./DateUtility";
import { getUserInfoLumen } from "./redis";

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
  startDate: string,
  endDate: string
) => {
  try {
    const url = `http://zvm-msgprod/MES/ProcessDataExportApi/api/v1/processdataexport/processDataExport?Assets=${asset}&StartDate=${startDate}&EndDate=${endDate}&TopNRows=0&UserMetadataKeys=line%2Clabel%2Coperator%2Crevision%2Csender%2Ctestplan%2Cbarcode`;
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
    processData = processData.filter(
      (x) =>
        !x.PartNumber.includes("I") &&
        !x.PartNumber.includes("E") &&
        !x.PartNumber.includes("U") &&
        !x.PartNumber.includes("0000") &&
        x.Operator
    );
    return processData;
  } catch (error) {
    console.log("ERROR: " + error);
    return undefined;
  }
};

export const getProcessDataExportRange = async (
  asset: string,
  startDate: Date,
  endDate: Date
) => {
  try {
    let finalData: ProcessDataExport[] = [];
    for (
      let start = new Date(startDate);
      start.getTime() <= endDate.getTime();
      start.setDate(start.getDate() + 1)
    ) {
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      const dateStart = dateToString(start);
      const dateEnd = dateToString(end);
      const processData = await getProcessDataExport(asset, dateStart, dateEnd);
      if (processData) {
        finalData = finalData.concat(processData);
      }
    }
    return finalData;
  } catch (error) {
    console.log("ERROR: " + error);
    return undefined;
  }
};

export const getPartCycleTime = async (partNumber: string, line: string) => {
  try {
    const url = `https://zvm-msgprod.gentex.com/MES/Client/manufacturingweb/api/v1/bi/cycletimes/lineoperationpart?orgCode=14&ebsOperation=O612&partNumber=${partNumber}`;
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
      return result[0].averageCycleTime;
    }
    return 0;
  } catch (error) {
    console.log("ERROR: " + error);
    return 0;
  }
};
