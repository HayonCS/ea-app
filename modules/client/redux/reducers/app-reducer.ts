import { initialAppState } from "../state/app-state";
import { MainReducer } from "./main-reducer";
import { InitialState } from "client/redux/state";
import { Actions } from "client/redux/actions";
import { PureState } from "client/redux/state";

export type AppReducer<
  TState extends keyof PureState,
  TAdditionalActions = Actions
> = (
  state: PureState[TState] | undefined,
  action: Actions | TAdditionalActions
) => PureState[TState];

export const appReducer: MainReducer<"App"> = (
  state = InitialState.App,
  action
): typeof state => {
  switch (action.type) {
    case "App/assetList": {
      const { assetList } = action.payload;
      return {
        ...state,
        assetInfo: assetList,
      };
    }
    case "App/cycleTimeInfo": {
      const { cycleTimeInfo } = action.payload;
      return {
        ...state,
        cycleTimeInfo: cycleTimeInfo,
      };
    }
    case "App/bomRoutings": {
      const { bomRoutings } = action.payload;
      return {
        ...state,
        bomRoutings: bomRoutings,
      };
    }
    case "App/lineConfigurations": {
      const { lineConfigurations } = action.payload;
      return {
        ...state,
        lineConfigurations: lineConfigurations,
      };
    }
    case "App/currentUserAppData": {
      const { userData } = action.payload;
      return {
        ...state,
        currentUserAppData: userData,
      };
    }
    case "App/currentUserInfo": {
      const { userInfo } = action.payload;
      return {
        ...state,
        currentUserInfo: userInfo,
      };
    }
    case "App/clearCurrentUser": {
      return {
        ...state,
        currentUserInfo: { ...initialAppState.currentUserInfo },
      };
    }
    case "App/employeeActiveDirectory": {
      const { activeDirectory } = action.payload;
      return {
        ...state,
        employeeActiveDirectory: activeDirectory,
      };
    }
    default:
      return state;
  }
};
