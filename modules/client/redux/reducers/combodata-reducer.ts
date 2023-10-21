import { initialAppState } from "../state/app-state";
import { MainReducer } from "./main-reducer";
import { InitialState } from "client/redux/state";

export const comboDataReducer: MainReducer<"ComboData"> = (
  state = InitialState.ComboData,
  action
): typeof state => {
  switch (action.type) {
    case "ComboData/partData": {
      const { partData } = action.payload;
      return {
        ...state,
        partData: partData,
      };
    }
    case "ComboData/assetData": {
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
