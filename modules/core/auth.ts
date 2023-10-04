import { SavedUserRecord, SavedUserRecordAndAppKey } from "records/user";
export type NotAuthenticatedResponse = {
  auth: false;
};

export type AuthenticatedResponse = {
  auth: true;
  token: string;
};

export type AuthenticationResponse =
  | AuthenticatedResponse
  | NotAuthenticatedResponse;

export const isAnyTypeOfAuthenticationResponse = (
  response: any
): response is AuthenticationResponse => {
  return (
    isAuthenticatedResponse(response) || isNotAuthenticatedResponse(response)
  );
};

export const isAuthenticatedResponse = (
  response: any
): response is AuthenticatedResponse =>
  "auth" in response &&
  typeof response.auth === "boolean" &&
  response.auth === true &&
  "token" in response &&
  typeof response.token === "string";

export const isNotAuthenticatedResponse = (
  response: any
): response is NotAuthenticatedResponse =>
  "auth" in response &&
  typeof response.auth === "boolean" &&
  response.auth === false;

export const isSavedUserRecord = (data: any): data is SavedUserRecord =>
  "Name" in data &&
  typeof data.Name === "string" &&
  "Phone" in data &&
  typeof data.Phone === "string" &&
  "EMail" in data &&
  typeof data.EMail === "string" &&
  "Manager" in data &&
  typeof data.Manager === "string" &&
  "Location" in data &&
  typeof data.Location === "string" &&
  "ReadOnly" in data &&
  typeof data.ReadOnly === "boolean" &&
  "UserID" in data &&
  typeof data.UserID === "number" &&
  "EmployeeNumber" in data &&
  typeof data.EmployeeNumber === "string";

export const isSavedUserRecordAndAppKey = (
  data: any
): data is SavedUserRecordAndAppKey =>
  "Name" in data &&
  typeof data.Name === "string" &&
  "Phone" in data &&
  typeof data.Phone === "string" &&
  "EMail" in data &&
  typeof data.EMail === "string" &&
  "Manager" in data &&
  typeof data.Manager === "string" &&
  "Location" in data &&
  typeof data.Location === "string" &&
  "ReadOnly" in data &&
  typeof data.ReadOnly === "boolean" &&
  "UserID" in data &&
  typeof data.UserID === "number" &&
  "EmployeeNumber" in data &&
  typeof data.EmployeeNumber === "string" &&
  "AppKey" in data &&
  typeof data.AppKey === "string";
