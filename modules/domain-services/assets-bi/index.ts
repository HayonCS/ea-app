import * as Hexagonal from "atomic-object/hexagonal";
import { AssetsBiPort } from "./port";
import { getAssetList } from "./assets-bi";

export type AssetsBiDef = {
  getAssetList: () => Promise<string[]>;
};

export const assetsBiAdapter = Hexagonal.adapter({
  port: AssetsBiPort,
  requires: [],
  build: () => {
    return {
      getAssetList: async (): Promise<string[]> => {
        const list = await getAssetList();
        return list;
      },
    };
  },
});
