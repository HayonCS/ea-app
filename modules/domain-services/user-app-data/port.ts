import * as Hexagonal from "atomic-object/hexagonal";
import { UserAppDataDef } from ".";

export type UserAppDataPort = typeof UserAppDataPort;
export const UserAppDataPort = Hexagonal.port<UserAppDataDef, "userAppData">(
  "userAppData"
);
