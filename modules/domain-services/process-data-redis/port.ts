import * as Hexagonal from "atomic-object/hexagonal";
import { ProcessDataRedisDef } from ".";

export type ProcessDataRedisPort = typeof ProcessDataRedisPort;
export const ProcessDataRedisPort = Hexagonal.port<
  ProcessDataRedisDef,
  "processDataRedis"
>("processDataRedis");
