import { AppState, initialAppState } from "client/redux/state/app-state";
import {
  ComboDataState,
  initialComboDataState,
} from "client/redux/state/combodata-state";
import {
  ProcessDataState,
  initialProcessDataState,
} from "client/redux/state/processdata-state";

export type PureState = {
  App: AppState;
  ComboData: ComboDataState;
  ProcessData: ProcessDataState;
};

export const InitialState: PureState = {
  App: initialAppState,
  ComboData: initialComboDataState,
  ProcessData: initialProcessDataState,
};
