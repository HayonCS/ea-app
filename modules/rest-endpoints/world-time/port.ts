import * as Hexagonal from "atomic-object/hexagonal";
import { WorldTime } from "rest-endpoints/world-time";

export type WorldTimePort = typeof WorldTimePort;
export const WorldTimePort = Hexagonal.port<WorldTime, "worldTime">(
  "worldTime"
);
