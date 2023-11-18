import { initialAppState } from "../state/app-state";
import { MainReducer } from "./main-reducer";
import { InitialState } from "client/redux/state";

export const processDataReducer: MainReducer<"ProcessData"> = (
  state = InitialState.ProcessData,
  action
): typeof state => {
  switch (action.type) {
    case "ProcessData/partData": {
      const { partData } = action.payload;
      return {
        ...state,
        partData: partData,
      };
    }
    case "ProcessData/assetData": {
      const { assetData } = action.payload;
      return {
        ...state,
        assetData: assetData,
      };
    }
    default:
      return state;
  }
};
