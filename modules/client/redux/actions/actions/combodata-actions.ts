import { ActionType } from "client/redux/types";
import { AssetRow, PnRow } from "records/combodata";

export const ComboDataActions = {
  partData: (partData: PnRow[]) =>
    ({
      type: "ComboData/partData",
      payload: {
        partData,
      },
    } as const),

  assetData: (assetData: AssetRow[]) =>
    ({
      type: "ComboData/assetData",
      payload: {
        assetData,
      },
    } as const),
};

export type ComboDataActions = ActionType<typeof ComboDataActions>;
