import * as Reducers from "client/redux/reducers";
import * as Redux from "redux";
import { Action } from "redux";
import { enableBatching } from "redux-batched-actions";
import { composeWithDevTools } from "redux-devtools-extension";
import Thunk, { ThunkMiddleware } from "redux-thunk";
import { Actions } from "../actions/actions";
import { PureState } from "../state";

//eslint-disable-next-line  @typescript-eslint/no-unused-vars
const logger = (store: any) => (next: any) => (action: any) => {
  let result = next(action);
  return result;
};

// export const history = History.createBrowserHistory();
export const configureStore = (state?: Partial<Reducers.State>) => {
  return Redux.createStore(
    enableBatching(Reducers.Reducer()),
    (state as any) || {},
    composeWithDevTools(
      Redux.applyMiddleware(
        Thunk as ThunkMiddleware<PureState, Action<Actions["type"]>>,
        logger
      )
    )
  );
};
