import fetch from "node-fetch";
import * as config from "config";

export type MesUserInfo = {
  employeeId: string;
  username: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  roles: string[];
  distributionLists: string[];
  isServiceAccount: boolean;
  pager: string;
};

export async function getMesUserInfo(
  currentUserId: string,
  includeGroups?: boolean
): Promise<MesUserInfo> {
  // const url =
  //   (config as any)["mesRestApi"]["mesSecurityEndpoint"] +
  //   "user/" +
  //   currentUserId +
  //   "?includeGroups=" +
  //   (includeGroups ?? false);
  const url =
    config.get<string>("mesRestApi.mesSecurityEndpoint") +
    "user/" +
    currentUserId +
    "?includeGroups=" +
    (includeGroups ?? false);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

  const defaultUser: MesUserInfo = {
    employeeId: "",
    username: "",
    firstName: "",
    lastName: "",
    emailAddress: "",
    roles: [],
    distributionLists: [],
    isServiceAccount: false,
    pager: "",
  };

  const result = await response.json();
  return result ? (result as MesUserInfo) : defaultUser;
}

export async function getMesManagerInfo(
  currentUserId: string,
  includeGroups?: boolean
): Promise<MesUserInfo> {
  const url =
    config.get<string>("mesRestApi.mesSecurityEndpoint") +
    "manager/" +
    currentUserId +
    "?includeGroups=" +
    (includeGroups ?? false);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

  const result = await response.json();
  return result as MesUserInfo;
}
