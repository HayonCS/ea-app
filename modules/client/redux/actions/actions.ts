import { Action } from "redux";
import { PureState } from "client/redux/state";
import { ThunkAction } from "redux-thunk";
import { AppActions } from "./actions/app-actions";
import { ComboDataActions } from "./actions/combodata-actions";
import { ProcessDataActions } from "./actions/processdata-actions";
import { AuthenticationActions } from "./actions/authentication-actions";
import { UndoxTypes } from "../undox";

export const Actions = {
  App: AppActions,
  Authentication: AuthenticationActions,
  ComboData: ComboDataActions,
  ProcessData: ProcessDataActions,
};

type UndoxActions = { type: UndoxTypes.UNDO } | { type: UndoxTypes.REDO };

export type Actions =
  | AppActions
  | AuthenticationActions
  | ComboDataActions
  | ProcessDataActions
  | UndoxActions;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  PureState,
  null | undefined,
  Action<Actions["type"]>
>;
