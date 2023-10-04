import { FirstArgument } from "core/types";
import { combineReducers } from "@reduxjs/toolkit";
import { appReducer } from "client/redux/reducers/app-reducer";
import { authenticationReducer } from "./authentication-reducer";

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Reducer = () =>
  combineReducers({
    App: appReducer,
    Authentication: authenticationReducer,
  });

export type State = NonNullable<FirstArgument<ReturnType<typeof Reducer>>>;
