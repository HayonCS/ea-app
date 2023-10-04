import * as config from "config";

export type UserPictureResponse = {
  picturePath: string;
};

export function getUserPicture(employeeId: string): UserPictureResponse {
  const userPictureUrl =
    config.get<string>("mesRestApi.mesUserPictureUrl") + employeeId;

  return {
    picturePath: userPictureUrl,
  };
}
