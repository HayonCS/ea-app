import * as Hexagonal from "atomic-object/hexagonal";
import { MesProcessDataPort } from "./port";
import { ProcessDataExport, getProcessDataExport } from "./process-data";

export type MesProcessData = {
  getProcessDataExport: (
    asset: string,
    startDate: string,
    endDate: string
  ) => Promise<ProcessDataExport[]>;
};

export const mesProcessDataAdapter = Hexagonal.adapter({
  port: MesProcessDataPort,
  requires: [],
  build: () => {
    return {
      getProcessDataExport: async (
        asset: string,
        startDate: string,
        endDate: string
      ) => {
        return await getProcessDataExport(asset, startDate, endDate);
      },
    };
  },
});
