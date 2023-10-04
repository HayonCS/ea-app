import { UserInformation } from "core/schemas/user-information.gen";
import * as DateFns from "date-fns";
import { getEmployeeInfo } from "rest-endpoints/employee-directory/employee-directory";
import { getMesUserInfo } from "rest-endpoints/mes-security/mes-security";

export const getUserInformation = async (
  userIdOrUsername: string,
  includeGroups?: boolean
) => {
  try {
    const mesInfo = await getMesUserInfo(userIdOrUsername, includeGroups);
    const employeeInfo = await getEmployeeInfo(mesInfo.employeeId);
    const userInfo: UserInformation = {
      employeeId: mesInfo.employeeId,
      firstName: mesInfo.firstName,
      lastName: mesInfo.lastName,
      username: mesInfo.username,
      email: mesInfo.emailAddress,
      cellPhone: employeeInfo.cellPhone,
      workPhone: employeeInfo.workPhone,
      location: employeeInfo.location,
      locationId: employeeInfo.locationId,
      shift: employeeInfo.shift,
      jobTitle: employeeInfo.jobTitle,
      managerEmployeeId: employeeInfo.managerEmployeeNumber,
      level: 0,
      erphrLocation: {
        locationId: employeeInfo.erphrLocation.locationId,
        locationCode: employeeInfo.erphrLocation.locationCode,
        description: employeeInfo.erphrLocation.description,
        inventoryOrgCode: employeeInfo.erphrLocation.inventoryOrgCode,
        inventoryOrgId: employeeInfo.erphrLocation.inventoryOrgId,
      },
      isManager: employeeInfo.isManager,
      status: employeeInfo.status,
      salaryType: employeeInfo.salaryType,
      employeeType: employeeInfo.employeeType,
      personType: employeeInfo.personType,
      payGroup: employeeInfo.payGroup,
      preferredLocale: employeeInfo.preferredLocale,
      preferredDisplayLang: employeeInfo.preferredDisplayLang,
      preferredCurrency: employeeInfo.preferredCurrency,
      primaryTimezone: employeeInfo.primaryTimezone,
      fullTime: employeeInfo.fullTime,
      partTime: employeeInfo.partTime,
      roles: mesInfo.roles,
      distributionLists: mesInfo.distributionLists,
      isServiceAccount: mesInfo.isServiceAccount,
      pager: mesInfo.pager,
    };
    return userInfo;
  } catch (error) {
    console.info(error.message);
  }
  return undefined;
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

export const formatModTimeAsDateTime = (modificationTime: string): string => {
  const returnDate = DateFns.format(
    DateFns.parseISO(modificationTime),
    "M-d-yyyy h:mm aa" //"6-27-2022 3:23 PM"
  );
  return returnDate;
};

export const formatModTimeAsDayDateTime = (
  modificationTime: string
): string => {
  const returnDate = DateFns.format(
    DateFns.parseISO(modificationTime),
    "PPPP p" //"Tuesday, May 12th, 2020 10:41 AM"
  );
  return returnDate;
};

export const formatModTimeAsDate = (modificationTime: string): string => {
  const returnDate = DateFns.format(
    DateFns.parseISO(modificationTime),
    "LLLL do, uuuu" //"May 12th, 2020"
  );
  return returnDate;
};

export const formatModTimeAsDateWithCurrentDayCheck = (
  modificationTime: string
): string => {
  if (DateFns.isToday(DateFns.parseISO(modificationTime))) {
    return `Today at ${DateFns.format(
      DateFns.parseISO(modificationTime),
      "p" //"Today at 12:00 AM"
    )}`;
  } else if (DateFns.isYesterday(DateFns.parseISO(modificationTime))) {
    return `Yesterday at ${DateFns.format(
      DateFns.parseISO(modificationTime),
      "p" //"Yesterday at 12:00 AM"
    )}`;
  } else if (
    DateFns.isSameWeek(new Date(), DateFns.parseISO(modificationTime))
  ) {
    return DateFns.format(
      DateFns.parseISO(modificationTime),
      "'on' EEEE 'at' p" //"on Monday at 11:00 AM"
    );
  }

  return formatModTimeAsDate(modificationTime); //"May 12th, 2020"
};
