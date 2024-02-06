import { SavedUserRecord } from "records/user";
import { ActionType } from "client/redux/types";

export const AuthenticationActions = {
  loginPending: () =>
    ({
      type: "Authentication/loginPending",
    } as const),
  loginSuccessful: (user: SavedUserRecord) =>
    ({
      type: "Authentication/loginSuccessful",
      payload: {
        user,
      },
    } as const),
  loginError: (error: string) =>
    ({
      type: "Authentication/loginError",
      payload: {
        error,
      },
    } as const),
  logout: () =>
    ({
      type: "Authentication/logout",
    } as const),
  signout: () =>
    ({
      type: "Authentication/signout",
    } as const),
};

export type AuthenticationActions = ActionType<typeof AuthenticationActions>;
