import * as React from "react";
import { useGetUserPictureQuery } from "client/graphql/types.gen";

type UserPictureUrl = string & Record<never, never>;

type UserPictureResponseType = "Loading" | "Error" | UserPictureUrl;

export const useUserPicture = (userId: string) => {
  const [userPictureUrl, setUserPictureUrl] =
    React.useState<UserPictureResponseType>("Loading");

  /*
   * User picture query.
   */
  let userPictureResponse = useGetUserPictureQuery({
    variables: {
      employeeId: userId || "",
    },
    fetchPolicy: "cache-and-network",
    // displayName: "UserPictureQuery",
    skip:
      !userId ||
      userId === "" ||
      userId === "undefined" ||
      userId.toLowerCase() === "unknown",
  });

  React.useEffect(() => {
    if (userPictureResponse) {
      if (userPictureResponse.loading) {
        setUserPictureUrl("Loading");
      } else if (userPictureResponse.error) {
        setUserPictureUrl("Error");
      } else {
        setUserPictureUrl(
          userPictureResponse.data?.userPicture?.picturePath || ""
        );
      }
    }
  }, [userPictureResponse]);

  return userPictureUrl;
};
