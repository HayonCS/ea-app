import { ActionType } from "client/redux/types";
import { AssetRow, PnRow } from "records/combodata";

export const WebdcActions = {
  partData: (partData: PnRow[]) =>
    ({
      type: "Webdc/partData",
      payload: {
        partData,
      },
    } as const),

  assetData: (assetData: AssetRow[]) =>
    ({
      type: "Webdc/assetData",
      payload: {
        assetData,
      },
    } as const),
};

export type WebdcActions = ActionType<typeof WebdcActions>;
