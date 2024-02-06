import { SavedUserRecord } from "records/user";

export type UncheckedState = {
  type: "Unchecked";
};

export type AuthenticatedState = {
  type: "Authenticated";
  user: SavedUserRecord;
};

export type UnauthenticatedState = {
  type: "Unauthenticated";
};

export type AuthenticatingState = {
  type: "Authenticating";
};

export type AuthenticationErrorState = {
  type: "Error";
  error: string;
};

export type AuthenticationState =
  | UncheckedState
  | AuthenticatedState
  | AuthenticatingState
  | UnauthenticatedState
  | AuthenticationErrorState;

export const initialAuthenticationState: AuthenticationState = {
  type: "Unchecked",
};
