import * as Hexagonal from "atomic-object/hexagonal";
import { UserPicturePort } from "./port";
import { getUserPicture } from "./user-picture";
import { UserPictureResponse } from "graphql-api/server-types.gen";

export type UserPicture = {
  userPicture: (employeeId: string) => Promise<UserPictureResponse>;
};
export const userPictureAdapter = Hexagonal.adapter({
  port: UserPicturePort,
  requires: [],
  build: () => {
    return {
      userPicture: async (employeeId: string): Promise<UserPictureResponse> => {
        return getUserPicture(employeeId);
      },
    };
  },
});
