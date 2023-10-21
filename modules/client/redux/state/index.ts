import { AppState, initialAppState } from "client/redux/state/app-state";
import { WebdcState, initialWebdcState } from "client/redux/state/webdc-state";

export type PureState = {
  App: AppState;
  Webdc: WebdcState;
};

export const InitialState: PureState = {
  App: initialAppState,
  Webdc: initialWebdcState,
};
