import { Actions } from "client/redux/actions";

import { PureState } from "client/redux/state";

export type MainReducer<
  TState extends keyof PureState,
  TAdditionalActions = Actions
> = (
  state: PureState[TState] | undefined,
  action: Actions | TAdditionalActions
) => PureState[TState];
