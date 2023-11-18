import * as Hexagonal from "atomic-object/hexagonal";
import { MesSecurity } from "rest-endpoints/mes-security";

export type MesSecurityPort = typeof MesSecurityPort;
export const MesSecurityPort = Hexagonal.port<MesSecurity, "mesSecurity">(
  "mesSecurity"
);
