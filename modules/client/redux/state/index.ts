import { AppState, initialAppState } from "client/redux/state/app-state";
import {
  ComboDataState,
  initialComboDataState,
} from "client/redux/state/combodata-state";

export type PureState = {
  App: AppState;
  ComboData: ComboDataState;
};

export const InitialState: PureState = {
  App: initialAppState,
  ComboData: initialComboDataState,
};
