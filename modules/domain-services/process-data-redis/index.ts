import * as Hexagonal from "atomic-object/hexagonal";
import { ProcessDataRedisPort } from "./port";
import { getProcessDataRedis } from "./process-data-redis";
import { ProcessDataExport } from "rest-endpoints/mes-process-data/mes-process-data";

export type ProcessDataRedisDef = {
  getProcessDataRedis: (
    asset: string,
    date: string
  ) => Promise<ProcessDataExport[]>;
};

export const processDataRedisAdapter = Hexagonal.adapter({
  port: ProcessDataRedisPort,
  requires: [],
  build: () => {
    return {
      getProcessDataRedis: async (
        asset: string,
        date: string
      ): Promise<ProcessDataExport[]> => {
        return await getProcessDataRedis(asset, date);
      },
    };
  },
});
