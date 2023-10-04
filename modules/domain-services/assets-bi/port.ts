import * as Hexagonal from "atomic-object/hexagonal";
import { AssetsBiDef } from ".";

export type AssetsBiPort = typeof AssetsBiPort;
export const AssetsBiPort = Hexagonal.port<AssetsBiDef, "assetsBi">("assetsBi");
