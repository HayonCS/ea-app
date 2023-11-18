import * as Hexagonal from "atomic-object/hexagonal";
import { MesProcessData } from "rest-endpoints/mes-process-data";

export type MesProcessDataPort = typeof MesProcessDataPort;
export const MesProcessDataPort = Hexagonal.port<
  MesProcessData,
  "mesProcessData"
>("mesProcessData");
