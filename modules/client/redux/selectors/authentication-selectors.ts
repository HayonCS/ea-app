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
      ? state.Authentication.user.Name
      : "unknown",
  currentEmployeeNumber: (state: State) =>
    state.Authentication.type === "Authenticated"
      ? state.Authentication.user.EmployeeNumber
      : "unknown",
  // NOTE: The isUserReadOnly auth selector will only be updated when a user logs in because it is stored in a long lived JWT.
  // It will not change immediately when database permissions change or even when the page is reloaded.
  // A user would need to first log out and clear the JWT or be using an incognito tab in order to see this change.
  // It's not typical for a user to log out and log back in very often.
  // Consider using the `useIsUserDBLocked` hook instead if your component needs to be able to see database permission changes after a page reload.
  // If your component needs to see database permission updates immediately, use the `useIsUserReadOnlyForDomain` where you can control the fetch policy.
  isUserReadOnly: (state: State) =>
    state.Authentication.type === "Authenticated"
      ? state.Authentication.user.ReadOnly
      : true,
};
