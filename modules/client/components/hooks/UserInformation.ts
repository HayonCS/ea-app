import * as React from "react";
import {
  useGetEmployeeInfoQuery,
  useGetMesUserInfoQuery,
} from "client/graphql/types.gen";
import { UserInformation } from "core/schemas/user-information.gen";

type UserInformationResponse = "Loading" | "Error" | UserInformation;

export const useUserInformation = (
  employeeNumOrUserName: string,
  includeGroups?: boolean
): UserInformationResponse => {
  const [userInformation, setUserInformation] = React.useState<
    UserInformationResponse
  >("Loading");

  const { data, loading, error } = useGetMesUserInfoQuery({
    skip:
      !employeeNumOrUserName ||
      employeeNumOrUserName.toLowerCase() === "unknown",
    variables: {
      employeeNumberOrUsername: employeeNumOrUserName,
      includeGroups: includeGroups,
    },
  });

  const employeeInfo = useGetEmployeeInfoQuery({
    skip: !data?.mesUserInfo.employeeId,
    variables: {
      employeeNumberOrEmail: data?.mesUserInfo.employeeId ?? "00000",
    },
  });

  React.useEffect(() => {
    if (
      !loading &&
      !error &&
      !employeeInfo.loading &&
      employeeInfo.called &&
      !employeeInfo.error
    ) {
      if (data && employeeInfo.data) {
        if (data.mesUserInfo && employeeInfo.data.employeeInfo) {
          setUserInformation({
            employeeId: data.mesUserInfo.employeeId!,
            firstName: data.mesUserInfo.firstName!,
            lastName: data.mesUserInfo.lastName!,
            username: data.mesUserInfo.username!,
            email: data.mesUserInfo.emailAddress!,
            cellPhone: employeeInfo.data.employeeInfo.cellPhone!,
            workPhone: employeeInfo.data.employeeInfo.workPhone!,
            location: employeeInfo.data.employeeInfo.location!,
            locationId: employeeInfo.data.employeeInfo.locationId!,
            shift: employeeInfo.data.employeeInfo.shift!,
            jobTitle: employeeInfo.data.employeeInfo.jobTitle!,
            managerEmployeeId: employeeInfo.data.employeeInfo
              .managerEmployeeNumber!,
            level: employeeInfo.data.employeeInfo.level,
            erphrLocation: {
              locationId: employeeInfo.data.employeeInfo.erphrLocation
                .locationId!,
              locationCode: employeeInfo.data.employeeInfo.erphrLocation
                .locationCode!,
              description: employeeInfo.data.employeeInfo.erphrLocation
                .description!,
              inventoryOrgCode: employeeInfo.data.employeeInfo.erphrLocation
                .inventoryOrgCode!,
              inventoryOrgId: employeeInfo.data.employeeInfo.erphrLocation
                .inventoryOrgId!,
            },
            isManager: employeeInfo.data.employeeInfo.isManager!,
            status: employeeInfo.data.employeeInfo.status!,
            salaryType: employeeInfo.data.employeeInfo.salaryType!,
            employeeType: employeeInfo.data.employeeInfo.employeeType!,
            personType: employeeInfo.data.employeeInfo.personType!,
            payGroup: employeeInfo.data.employeeInfo.payGroup!,
            preferredLocale: employeeInfo.data.employeeInfo.preferredLocale!,
            preferredDisplayLang: employeeInfo.data.employeeInfo
              .preferredDisplayLang!,
            preferredCurrency: employeeInfo.data.employeeInfo
              .preferredCurrency!,
            primaryTimezone: employeeInfo.data.employeeInfo.primaryTimezone!,
            fullTime: employeeInfo.data.employeeInfo.fullTime!,
            partTime: employeeInfo.data.employeeInfo.partTime!,
            roles: data.mesUserInfo.roles!,
            distributionLists: data.mesUserInfo.distributionLists!,
            isServiceAccount: data.mesUserInfo.isServiceAccount!,
            pager: data.mesUserInfo.pager!,
          });
        }
      }
    }
  }, [
    data,
    employeeInfo.called,
    employeeInfo.data,
    employeeInfo.error,
    employeeInfo.loading,
    error,
    loading,
  ]);

  return userInformation;
};
