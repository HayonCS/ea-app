import { Action } from "redux";
import { PureState } from "client/redux/state";
import { ThunkAction } from "redux-thunk";
import { AuthenticationActions } from "./actions/authentication-actions";
import { AppActions } from "./actions/app-actions";

export const Actions = {
  App: AppActions,
  Authentication: AuthenticationActions,
};

export type Actions = AppActions | AuthenticationActions;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  PureState,
  null | undefined,
  Action<Actions["type"]>
>;
