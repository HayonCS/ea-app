import * as Hexagonal from "atomic-object/hexagonal";
import { DcTools } from "rest-endpoints/dctools";

export type DcToolsPort = typeof DcToolsPort;
export const DcToolsPort = Hexagonal.port<DcTools, "dcToolsPort">(
  "dcToolsPort"
);
