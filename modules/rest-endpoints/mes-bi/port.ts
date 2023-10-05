import * as Hexagonal from "atomic-object/hexagonal";
import { MesBi } from "rest-endpoints/mes-bi";

export type MesBiPort = typeof MesBiPort;
export const MesBiPort = Hexagonal.port<MesBi, "mesBi">(
  "mesBi"
);
