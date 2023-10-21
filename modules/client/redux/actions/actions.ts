import { Action } from "redux";
import { PureState } from "client/redux/state";
import { ThunkAction } from "redux-thunk";
import { AppActions } from "./actions/app-actions";
import { ComboDataActions } from "./actions/combodata-actions";
import { ProcessDataActions } from "./actions/processdata-actions";

export const Actions = {
  App: AppActions,
  ComboData: ComboDataActions,
  ProcessData: ProcessDataActions,
};

export type Actions = AppActions | ComboDataActions | ProcessDataActions;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  PureState,
  null | undefined,
  Action<Actions["type"]>
>;
