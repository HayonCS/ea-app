import { Action } from "redux";
import { PureState } from "client/redux/state";
import { ThunkAction } from "redux-thunk";
import { AppActions } from "./actions/app-actions";

export const Actions = {
  App: AppActions,
};

export type Actions = AppActions;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  PureState,
  null | undefined,
  Action<Actions["type"]>
>;
