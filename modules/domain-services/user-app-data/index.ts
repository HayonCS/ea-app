import * as Hexagonal from "atomic-object/hexagonal";
import { UserAppDataPort } from "./port";
import { getUserAppData, setUserAppData } from "./user-app-data";
import { UserAppData } from "core/schemas/user-app-data.gen";

export type UserAppDataDef = {
  getUserAppData: (userId: string) => Promise<UserAppData>;

  setUserAppData: (userId: string, appData: UserAppData) => Promise<boolean>;
};

export const userAppDataAdapter = Hexagonal.adapter({
  port: UserAppDataPort,
  requires: [],
  build: () => {
    return {
      getUserAppData: async (userId: string): Promise<UserAppData> => {
        const appData = await getUserAppData(userId);
        return appData;
      },

      setUserAppData: async (
        userId: string,
        appData: UserAppData
      ): Promise<boolean> => {
        return await setUserAppData(userId, appData);
      },
    };
  },
});
