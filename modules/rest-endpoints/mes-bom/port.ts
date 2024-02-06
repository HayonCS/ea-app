import * as Hexagonal from "atomic-object/hexagonal";
import { MesBom } from "rest-endpoints/mes-bom";

export type MesBomPort = typeof MesBomPort;
export const MesBomPort = Hexagonal.port<MesBom, "mesBom">("mesBom");
