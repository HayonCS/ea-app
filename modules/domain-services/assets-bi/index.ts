import * as Hexagonal from "atomic-object/hexagonal";
import { AssetsBiPort } from "./port";
import { getAssetList } from "./assets-bi";
import { AssetInfo } from "rest-endpoints/mes-bi/mes-bi";

export type AssetsBiDef = {
  getAssetList: () => Promise<AssetInfo[]>;
};

export const assetsBiAdapter = Hexagonal.adapter({
  port: AssetsBiPort,
  requires: [],
  build: () => {
    return {
      getAssetList: async (): Promise<AssetInfo[]> => {
        const list = await getAssetList();
        return list;
      },
    };
  },
});
