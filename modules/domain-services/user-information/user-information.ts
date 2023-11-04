import { UserInformation } from "core/schemas/user-information.gen";
import { getEmployeeInfo } from "rest-endpoints/employee-directory/employee-directory";
import { getMesUserInfo } from "rest-endpoints/mes-security/mes-security";

const fetchUserInfo = async (
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
      level: employeeInfo.level,
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

export const getUserInfo = async (
  userIdOrUsername: string,
  includeGroups?: boolean
): Promise<UserInformation> => {
  const user = await fetchUserInfo(userIdOrUsername, includeGroups);
  if (user) {
    return user;
  }
  const unknown: UserInformation = {
    employeeId: !isNaN(+userIdOrUsername) ? userIdOrUsername : "00000",
    firstName: "",
    lastName: "",
    username: isNaN(+userIdOrUsername) ? userIdOrUsername : "Unknown",
    email: "unknown@gentex.com",
    cellPhone: "6167721800",
    workPhone: "6167721800",
    location: "",
    locationId: 0,
    shift: 0,
    jobTitle: "",
    managerEmployeeId: "",
    level: 0,
    erphrLocation: {
      locationId: 0,
      locationCode: "",
      description: "",
      inventoryOrgCode: 0,
      inventoryOrgId: 0,
    },
    isManager: false,
    status: "",
    salaryType: "",
    employeeType: "",
    personType: "",
    payGroup: "",
    preferredLocale: "",
    preferredDisplayLang: "",
    preferredCurrency: "",
    primaryTimezone: "",
    fullTime: false,
    partTime: false,
    roles: [],
    distributionLists: [],
    isServiceAccount: false,
    pager: "",
  };
  return unknown;
};

export const getUsersInfo = async (
  userIdsOrUsernames: string[],
  includeGroups?: boolean
): Promise<UserInformation[]> => {
  let users: UserInformation[] = [];
  for (const u of userIdsOrUsernames) {
    const info = await fetchUserInfo(u, includeGroups);
    if (info) {
      users.push(info);
    } else {
      const unknown: UserInformation = {
        employeeId: !isNaN(+u) ? u : "00000",
        firstName: "",
        lastName: "",
        username: isNaN(+u) ? u : "Unknown",
        email: "unknown@gentex.com",
        cellPhone: "6167721800",
        workPhone: "6167721800",
        location: "",
        locationId: 0,
        shift: 0,
        jobTitle: "",
        managerEmployeeId: "",
        level: 0,
        erphrLocation: {
          locationId: 0,
          locationCode: "",
          description: "",
          inventoryOrgCode: 0,
          inventoryOrgId: 0,
        },
        isManager: false,
        status: "",
        salaryType: "",
        employeeType: "",
        personType: "",
        payGroup: "",
        preferredLocale: "",
        preferredDisplayLang: "",
        preferredCurrency: "",
        primaryTimezone: "",
        fullTime: false,
        partTime: false,
        roles: [],
        distributionLists: [],
        isServiceAccount: false,
        pager: "",
      };
      users.push(unknown);
    }
  }
  return users;
};
