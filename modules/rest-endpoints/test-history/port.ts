import * as Hexagonal from "atomic-object/hexagonal";
import { MesTestHistory } from ".";

export type MesTestHistoryPort = typeof MesTestHistoryPort;
export const MesTestHistoryPort = Hexagonal.port<
  MesTestHistory,
  "mesTestHistory"
>("mesTestHistory");
