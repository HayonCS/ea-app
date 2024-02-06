import * as Hexagonal from "atomic-object/hexagonal";
import { MesBiPort } from "./port";
import {
  AssetInfo,
  LineConfiguration,
  LineOperationPart,
  getAssetByName,
  getAssetsAll,
  getAssetsName,
  getCycleTimesLineOperationPart,
  getLineConfiguration,
  getLineConfigurationsAll,
} from "./mes-bi";

export type MesBi = {
  getAssetsAll: () => Promise<AssetInfo[]>;

  getAssetsName: (nameOrKeyword: string) => Promise<AssetInfo[]>;

  getAssetByName: (assetName: string) => Promise<AssetInfo | undefined>;

  getCycleTimesLineOperationPart: () => Promise<LineOperationPart[]>;

  getLineConfiguration: (
    lineName: string,
    orgCode: number
  ) => Promise<LineConfiguration | undefined>;

  getLineConfigurationsAll: () => Promise<LineConfiguration[]>;
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
      getCycleTimesLineOperationPart: async () => {
        return await getCycleTimesLineOperationPart();
      },
      getLineConfiguration: async (lineName: string, orgCode: number) => {
        return await getLineConfiguration(lineName, orgCode);
      },
      getLineConfigurationsAll: async () => {
        return await getLineConfigurationsAll();
      },
    };
  },
});
