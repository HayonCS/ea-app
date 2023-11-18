import fetch, { Response } from "node-fetch";
import * as config from "config";

export type EmployeeInfoResponse = {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  cellPhone: string;
  workPhone: string;
  location: string;
  locationId: number;
  shift: number;
  jobTitle: string;
  managerEmployeeNumber: string;
  level: number;
  erphrLocation: {
    locationId: number;
    locationCode: string;
    description: string;
    inventoryOrgCode: number;
    inventoryOrgId: number;
  };
  isManager: true;
  status: string;
  salaryType: string;
  employeeType: string;
  personType: string;
  payGroup: string;
  preferredLocale: string;
  preferredDisplayLang: string;
  preferredCurrency: string;
  primaryTimezone: string;
  recipientType: string;
  fullTime: boolean;
  partTime: boolean;
};

async function fetchEmployeeInfo(
  employeeEmailOrNumber: string
): Promise<Response> {
  // const url = (config as any)["mesRestApi"][
  //   "employeeDirectoryEndpoint"
  // ].replace(/\/+$/, "");
  const url = config
    .get<string>("mesRestApi.employeeDirectoryEndpoint")
    .replace(/\/+$/, "");

  return fetch(
    employeeEmailOrNumber.includes("@")
      ? url + "?email=" + employeeEmailOrNumber
      : url + "/" + employeeEmailOrNumber,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}

export async function getEmployeeInfo(
  employeeEmailOrNumber: string
): Promise<EmployeeInfoResponse> {
  const fetchResponse = await fetchEmployeeInfo(employeeEmailOrNumber);
  const jsonResponse = (await fetchResponse.json()) as any;
  if (fetchResponse.ok) {
    const jsonData: EmployeeInfoResponse = employeeEmailOrNumber.includes("@")
      ? jsonResponse[0]
      : jsonResponse;

    return jsonData;
  } else {
    // handle the graphql errors
    const error = new Error(fetchResponse.statusText + " " + fetchResponse.url);
    return Promise.reject(error);
  }
}

export async function getEmployeeDirectory(): Promise<EmployeeInfoResponse[]> {
  const url = config
    .get<string>("mesRestApi.employeeDirectoryEndpoint")
    .replace(/\/+$/, "");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
  const jsonResponse: EmployeeInfoResponse[] = (await response.json()) as any;
  if (response.ok) {
    return jsonResponse;
  } else {
    // handle the graphql errors
    const error = new Error(response.statusText + " " + response.url);
    return Promise.reject(error);
  }
}
