import { AppState, initialAppState } from "client/redux/state/app-state";
import {
  ComboDataState,
  initialComboDataState,
} from "client/redux/state/combodata-state";
import {
  ProcessDataState,
  initialProcessDataState,
} from "client/redux/state/processdata-state";
import {
  AuthenticationState,
  initialAuthenticationState,
} from "./authentication-state";

export type PureState = {
  App: AppState;
  Authentication: AuthenticationState;
  ComboData: ComboDataState;
  ProcessData: ProcessDataState;
};

export const InitialState: PureState = {
  App: initialAppState,
  Authentication: initialAuthenticationState,
  ComboData: initialComboDataState,
  ProcessData: initialProcessDataState,
};
