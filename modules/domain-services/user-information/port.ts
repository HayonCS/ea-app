import * as Hexagonal from "atomic-object/hexagonal";
import { UserInfoDef } from ".";

export type UserInfoPort = typeof UserInfoPort;
export const UserInfoPort = Hexagonal.port<UserInfoDef, "userInfo">("userInfo");
