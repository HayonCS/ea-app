import * as React from "react";
import {
  useGetEmployeeInfoQuery,
  useGetMesUserInfoQuery,
} from "client/graphql/types.gen";
import { UserInformation } from "core/schemas/user-information.gen";

type UserInformationResponse =
  | "Loading"
  | "Error"
  | "Unknown"
  | UserInformation;

export const useUserInformation = (
  employeeNumOrUserName: string,
  includeGroups?: boolean
): UserInformationResponse => {
  const [userInformation, setUserInformation] =
    React.useState<UserInformationResponse>("Loading");

  const mesInfoQuery = useGetMesUserInfoQuery({
    skip:
      !employeeNumOrUserName ||
      employeeNumOrUserName === "" ||
      employeeNumOrUserName === "undefined" ||
      employeeNumOrUserName.toLowerCase() === "unknown",
    variables: {
      employeeNumberOrUsername: employeeNumOrUserName,
      includeGroups: includeGroups,
    },
  });

  const employeeInfoQuery = useGetEmployeeInfoQuery({
    skip: !mesInfoQuery.data?.mesUserInfo.employeeId || !!mesInfoQuery.error,
    variables: {
      employeeNumberOrEmail:
        mesInfoQuery.data?.mesUserInfo.employeeId ?? "00000",
    },
  });

  React.useEffect(() => {
    if (
      !employeeNumOrUserName ||
      employeeNumOrUserName === "undefined" ||
      employeeNumOrUserName.toLowerCase() === "unknown"
    ) {
      setUserInformation("Unknown");
    } else if (
      !mesInfoQuery.loading &&
      !mesInfoQuery.error &&
      !employeeInfoQuery.loading &&
      employeeInfoQuery.called &&
      !employeeInfoQuery.error
    ) {
      if (mesInfoQuery.data && employeeInfoQuery.data) {
        if (
          mesInfoQuery.data.mesUserInfo &&
          employeeInfoQuery.data.employeeInfo
        ) {
          const mesInfo = mesInfoQuery.data.mesUserInfo;
          const employeeInfo = employeeInfoQuery.data.employeeInfo;
          setUserInformation({
            employeeId: mesInfo.employeeId!,
            firstName: mesInfo.firstName!,
            lastName: mesInfo.lastName!,
            username: mesInfo.username!,
            email: mesInfo.emailAddress!,
            cellPhone: employeeInfo.cellPhone!,
            workPhone: employeeInfo.workPhone!,
            location: employeeInfo.location!,
            locationId: +employeeInfo.locationId!,
            shift: +employeeInfo.shift!,
            jobTitle: employeeInfo.jobTitle!,
            managerEmployeeId: employeeInfo.managerEmployeeNumber!,
            level: +employeeInfo.level,
            erphrLocation: {
              locationId: +employeeInfo.erphrLocation.locationId!,
              locationCode: employeeInfo.erphrLocation.locationCode!,
              description: employeeInfo.erphrLocation.description!,
              inventoryOrgCode: +employeeInfo.erphrLocation.inventoryOrgCode!,
              inventoryOrgId: +employeeInfo.erphrLocation.inventoryOrgId!,
            },
            isManager: employeeInfo.isManager!,
            status: employeeInfo.status!,
            salaryType: employeeInfo.salaryType!,
            employeeType: employeeInfo.employeeType!,
            personType: employeeInfo.personType!,
            payGroup: employeeInfo.payGroup!,
            preferredLocale: employeeInfo.preferredLocale!,
            preferredDisplayLang: employeeInfo.preferredDisplayLang!,
            preferredCurrency: employeeInfo.preferredCurrency!,
            primaryTimezone: employeeInfo.primaryTimezone!,
            fullTime: employeeInfo.fullTime!,
            partTime: employeeInfo.partTime!,
            roles: mesInfo.roles!,
            distributionLists: mesInfo.distributionLists!,
            isServiceAccount: mesInfo.isServiceAccount!,
            pager: mesInfo.pager!,
          });
        }
      }
    } else if (mesInfoQuery.loading || employeeInfoQuery.loading) {
      setUserInformation("Loading");
    } else if (mesInfoQuery.error || employeeInfoQuery.error) {
      setUserInformation("Error");
    } else if (!mesInfoQuery.loading) {
      setUserInformation("Error");
    }
  }, [mesInfoQuery, employeeInfoQuery]);

  return userInformation;
};
