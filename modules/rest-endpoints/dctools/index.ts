import * as Hexagonal from "atomic-object/hexagonal";
import { DcToolsPort } from "./port";
import { getFailedTagsByMetadata, getResultFileByMetadata } from "./dctools";

export type DcTools = {
  getResultFileByMetadata: (metaDataId: string) => Promise<string>;

  getFailedTagsByMetadata: (metaDataId: string) => Promise<string[]>;
};

export const dcToolsAdapter = Hexagonal.adapter({
  port: DcToolsPort,
  requires: [],
  build: () => {
    return {
      getResultFileByMetadata: async (metaDataId: string) => {
        return await getResultFileByMetadata(metaDataId);
      },

      getFailedTagsByMetadata: async (metaDataId: string) => {
        return await getFailedTagsByMetadata(metaDataId);
      },
    };
  },
});
