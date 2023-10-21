import { ActionType } from "client/redux/types";
import { AssetRow, PnRow } from "records/processdata";

export const ProcessDataActions = {
  partData: (partData: PnRow[]) =>
    ({
      type: "ProcessData/partData",
      payload: {
        partData,
      },
    } as const),

  assetData: (assetData: AssetRow[]) =>
    ({
      type: "ProcessData/assetData",
      payload: {
        assetData,
      },
    } as const),
};

export type ProcessDataActions = ActionType<typeof ProcessDataActions>;
