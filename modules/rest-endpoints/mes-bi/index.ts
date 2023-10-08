import * as Hexagonal from "atomic-object/hexagonal";
import { MesBiPort } from "./port";
import {
  AssetInfo,
  getAssetByName,
  getAssetsAll,
  getAssetsName,
} from "./mes-bi";

export type MesBi = {
  getAssetsAll: () => Promise<AssetInfo[]>;

  getAssetsName: (nameOrKeyword: string) => Promise<AssetInfo[]>;

  getAssetByName: (assetName: string) => Promise<AssetInfo | undefined>;
};

export const mesBiAdapter = Hexagonal.adapter({
  port: MesBiPort,
  requires: [],
  build: () => {
    return {
      getAssetsAll: async () => {
        return await getAssetsAll();
      },
      getAssetsName: async (nameOrKeyword: string) => {
        return await getAssetsName(nameOrKeyword);
      },
      getAssetByName: async (assetName: string) => {
        return await getAssetByName(assetName);
      },
    };
  },
});
