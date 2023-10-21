import { Action } from "redux";
import { PureState } from "client/redux/state";
import { ThunkAction } from "redux-thunk";
import { AppActions } from "./actions/app-actions";
import { WebdcActions } from "./actions/webdc-actions";

export const Actions = {
  App: AppActions,
  Webdc: WebdcActions,
};

export type Actions = AppActions | WebdcActions;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  PureState,
  null | undefined,
  Action<Actions["type"]>
>;
