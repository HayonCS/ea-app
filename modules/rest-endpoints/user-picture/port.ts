import * as Hexagonal from "atomic-object/hexagonal";
import { UserPicture } from "./index";

export type UserPicturePort = typeof UserPicturePort;
export const UserPicturePort = Hexagonal.port<UserPicture, "userPicture">(
  "userPicture"
);
