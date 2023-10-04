import { State } from "../reducers";

export const AuthenticationSelectors = {
  type: (state: State) => state.Authentication.type,
  errorText: (state: State) =>
    state.Authentication.type === "Error"
      ? state.Authentication.error
      : undefined,
  isNotUnauthenticated: (state: State) =>
    state.Authentication.type !== "Unauthenticated" &&
    state.Authentication.type !== "Error",
  currentUserName: (state: State) =>
    state.Authentication.type === "Authenticated"
      ? state.Authentication.user.UserName
      : "unknown",
  currentEmployeeNumber: (state: State) =>
    state.Authentication.type === "Authenticated"
      ? state.Authentication.user.EmployeeNumber
      : "unknown",
};
