import { ProcessDataExport, ProcessDataOperator } from "./DataTypes";

export const formatUserPhone = (employeeWorkPhone: string) => {
  //Just a desk phone extension
  var extensionRe = /^[x|x\-|ext|\s]*\s*(\d{4})\s*$/i;
  if (extensionRe.test(employeeWorkPhone)) {
    const match = extensionRe.exec(employeeWorkPhone);
    if (match && match[1]) {
      return `+1 (616) 772-1590 x${match[1]}`;
    }
  }

  //Regular phone number with or without an extension
  var re =
    /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
  var matchArray = re.exec(employeeWorkPhone);
  if (matchArray && matchArray.length === 6) {
    const countryCode: string | undefined = matchArray[1];
    const areaCode: string | undefined = matchArray[2];
    const prefix: string | undefined = matchArray[3];
    const lineNumber: string | undefined = matchArray[4];
    const extension: string | undefined = matchArray[5];
    return `+${countryCode ?? "1"} (${areaCode ?? "616"}) ${prefix ?? "772"}-${
      lineNumber ?? "1800"
    } ${extension ? `x${extension}` : ""}`.trim();
  } else {
    //Extension found anywhere in the number or just grab the last 4 digits
    var extAnywhere = /[x|x\-|ext|\s]*\s*(\d{4})\s*$/i;
    var extensionMatch = extAnywhere.exec(employeeWorkPhone);
    if (extensionMatch && extensionMatch[1]) {
      return `+1 (616) 772-1590 x-${extensionMatch[1]}`;
    }
  }

  //Default Gentex phone number
  return `+1 (616) 772-1800`;
};

export const getFinalProcessDataOperator = (
  processData: ProcessDataExport[]
) => {
  let passCount = 0;
  let failCount = 0;
  let lastOp = "";
  let lastPart = "";
  let lastDate = new Date("1900-09-09");
  const data: ProcessDataOperator[] = processData.map((x, i) => {
    if (
      lastPart !== x.PartNumber ||
      lastOp !== x.Operator ||
      lastDate.getDate() !== x.OpEndTime.getDate()
    ) {
      passCount = 0;
      failCount = 0;
    }
    lastPart = x.PartNumber;
    lastOp = x.Operator;
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
  let d = new Date("1900-09-09");
  data.forEach((row, index) => {
    if (d.getTime() > row.StartTime.getTime()) {
    }
    d = row.StartTime;

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

const capitalizeFirstPartOfName = (word: string): string => {
  if (word.length > 3 && word.toLowerCase().startsWith("mc")) {
    return `Mc` + word.charAt(2).toUpperCase() + word.slice(3);
  }

  if (word.length > 3 && word.toLowerCase().startsWith("o’")) {
    return `O'` + word.charAt(2).toUpperCase() + word.slice(3);
  }

  if (word.length > 3 && word.toLowerCase().startsWith("o'")) {
    return `O'` + word.charAt(2).toUpperCase() + word.slice(3);
  }

  return word.charAt(0).toUpperCase() + word.slice(1);
};
export const formatUserName = (userName: string): string => {
  const trimmedName = userName.trim().toLowerCase();
  const re = /([\w’']+)\W*([\w’']*)/i;
  const matches = re.exec(trimmedName);
  if (matches && matches.length > 1) {
    if (matches.length > 2) {
      return `${capitalizeFirstPartOfName(
        matches[1]
      )} ${capitalizeFirstPartOfName(matches[2])}`.trim();
    }
    return capitalizeFirstPartOfName(matches[1]);
  }
  return trimmedName;
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
