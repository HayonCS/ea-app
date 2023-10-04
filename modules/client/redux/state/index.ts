import { AppState, initialAppState } from "client/redux/state/app-state";
import {
  AuthenticationState,
  initialAuthenticationState,
} from "./authentication-state";

export type PureState = {
  App: AppState;
  Authentication: AuthenticationState;
};

export const InitialState: PureState = {
  App: initialAppState,
  Authentication: initialAuthenticationState,
};
