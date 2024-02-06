import { FirstArgument } from "core/types";
import { combineReducers } from "@reduxjs/toolkit";
import { appReducer } from "client/redux/reducers/app-reducer";
import { comboDataReducer } from "client/redux/reducers/combodata-reducer";
import { processDataReducer } from "client/redux/reducers/processdata-reducer";
import { authenticationReducer } from "./authentication-reducer";

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Reducer = () =>
  combineReducers({
    App: appReducer,
    Authentication: authenticationReducer,
    ComboData: comboDataReducer,
    ProcessData: processDataReducer,
  });

export type State = NonNullable<FirstArgument<ReturnType<typeof Reducer>>>;
