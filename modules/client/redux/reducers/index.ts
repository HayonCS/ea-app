import { FirstArgument } from "core/types";
import { combineReducers } from "@reduxjs/toolkit";
import { appReducer } from "client/redux/reducers/app-reducer";
import { comboDataReducer } from "client/redux/reducers/combodata-reducer";

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Reducer = () =>
  combineReducers({
    App: appReducer,
    ComboData: comboDataReducer,
  });

export type State = NonNullable<FirstArgument<ReturnType<typeof Reducer>>>;
