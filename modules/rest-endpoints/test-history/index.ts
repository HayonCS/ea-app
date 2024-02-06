import * as Hexagonal from "atomic-object/hexagonal";
import {
  TestHistory,
  getTestHistoriesById,
  getTestHistoryById,
  getTestHistoryByMetadata,
} from "./test-history";
import { MesTestHistoryPort } from "./port";

export type MesTestHistory = {
  getTestHistoriesById: (identifierCode: string) => Promise<TestHistory[]>;

  getTestHistoryById: (
    identifierCode: string,
    operation: number
  ) => Promise<TestHistory | undefined>;

  getTestHistoryByMetadata: (
    metaDataId: string
  ) => Promise<TestHistory | undefined>;
};

export const mesTestHistoryAdapter = Hexagonal.adapter({
  port: MesTestHistoryPort,
  requires: [],
  build: () => {
    return {
      getTestHistoriesById: async (identifierCode: string) => {
        return await getTestHistoriesById(identifierCode);
      },

      getTestHistoryById: async (identifierCode: string, operation: number) => {
        return await getTestHistoryById(identifierCode, operation);
      },

      getTestHistoryByMetadata: async (metaDataId: string) => {
        return await getTestHistoryByMetadata(metaDataId);
      },
    };
  },
});
