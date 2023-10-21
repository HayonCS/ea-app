import { initialAppState } from "../state/app-state";
import { MainReducer } from "./main-reducer";
import { InitialState } from "client/redux/state";

export const webdcReducer: MainReducer<"Webdc"> = (
  state = InitialState.Webdc,
  action
): typeof state => {
  switch (action.type) {
    case "Webdc/partData": {
      const { partData } = action.payload;
      return {
        ...state,
        partData: partData,
      };
    }
    case "Webdc/assetData": {
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
