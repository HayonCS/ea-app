import { AppState, initialAppState } from "client/redux/state/app-state";

export type PureState = {
  App: AppState;
};

export const InitialState: PureState = {
  App: initialAppState,
};
