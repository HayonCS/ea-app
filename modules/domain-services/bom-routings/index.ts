import * as Hexagonal from "atomic-object/hexagonal";
import { BomRoutingsPort } from "./port";
import { getBomRoutings } from "./bom-routings";
import { BomRouting } from "rest-endpoints/mes-bom/mes-bom";

export type BomRoutingsDef = {
  getBomRoutings: () => Promise<BomRouting[]>;
};

export const bomRoutingsAdapter = Hexagonal.adapter({
  port: BomRoutingsPort,
  requires: [],
  build: () => {
    return {
      getBomRoutings: async (): Promise<BomRouting[]> => {
        const routings = await getBomRoutings();
        return routings;
      },
    };
  },
});
