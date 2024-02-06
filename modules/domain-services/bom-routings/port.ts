import * as Hexagonal from "atomic-object/hexagonal";
import { BomRoutingsDef } from ".";

export type BomRoutingsPort = typeof BomRoutingsPort;
export const BomRoutingsPort = Hexagonal.port<BomRoutingsDef, "bomRoutings">(
  "bomRoutings"
);
