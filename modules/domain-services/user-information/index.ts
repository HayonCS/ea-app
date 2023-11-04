import * as Hexagonal from "atomic-object/hexagonal";
import { UserInfoPort } from "./port";
import { UserInformation } from "core/schemas/user-information.gen";
import { getUserInfo, getUsersInfo } from "./user-information";

export type UserInfoDef = {
  getUserInfo: (
    userIdOrUsername: string,
    includeGroups?: boolean
  ) => Promise<UserInformation>;

  getUsersInfo: (
    userIdsOrUsernames: string[],
    includeGroups?: boolean
  ) => Promise<UserInformation[]>;
};

export const userInfoAdapter = Hexagonal.adapter({
  port: UserInfoPort,
  requires: [],
  build: () => {
    return {
      getUserInfo: async (
        userIdOrUsername: string,
        includeGroups?: boolean
      ): Promise<UserInformation> => {
        const info = await getUserInfo(userIdOrUsername, includeGroups);
        return info;
      },

      getUsersInfo: async (
        userIdsOrUsernames: string[],
        includeGroups?: boolean
      ): Promise<UserInformation[]> => {
        return await getUsersInfo(userIdsOrUsernames, includeGroups);
      },
    };
  },
});
