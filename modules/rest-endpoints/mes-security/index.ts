import * as Hexagonal from "atomic-object/hexagonal";
import { MesSecurityPort } from "./port";
import { MesUserInfo, getMesUserInfo, getMesManagerInfo } from "./mes-security";

export type MesSecurity = {
  mesUserInfo: (
    userId: string,
    includeGroupInfo?: boolean
  ) => Promise<MesUserInfo>;
  mesManagerInfo: (
    userId: string,
    includeGroupInfo?: boolean
  ) => Promise<MesUserInfo>;
};

export const mesSecurityAdapter = Hexagonal.adapter({
  port: MesSecurityPort,
  requires: [],
  build: () => {
    return {
      mesUserInfo: async (userId: string, includeGroupInfo?: boolean) => {
        return await getMesUserInfo(userId, includeGroupInfo);
      },
      mesManagerInfo: async (userId: string, includeGroupInfo?: boolean) => {
        return await getMesManagerInfo(userId, includeGroupInfo);
      },
    };
  },
});
