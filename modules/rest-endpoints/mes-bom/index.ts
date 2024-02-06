import * as Hexagonal from "atomic-object/hexagonal";
import { MesBomPort } from "./port";
import { BomRouting, getBomRouting, getBomRoutings } from "./mes-bom";

export type MesBom = {
  getBomRouting: (
    orgCode: number,
    partNumber: string
  ) => Promise<BomRouting | undefined>;

  getBomRoutings: (
    orgCode: number,
    partNumbers: string[]
  ) => Promise<BomRouting[]>;
};

export const mesBomAdapter = Hexagonal.adapter({
  port: MesBomPort,
  requires: [],
  build: () => {
    return {
      getBomRouting: async (orgCode: number, partNumber: string) => {
        return await getBomRouting(orgCode, partNumber);
      },

      getBomRoutings: async (orgCode: number, partNumbers: string[]) => {
        return await getBomRoutings(orgCode, partNumbers);
      },
    };
  },
});
