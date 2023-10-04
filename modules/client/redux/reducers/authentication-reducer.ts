import { MainReducer } from "./main-reducer";
import { InitialState } from "client/redux/state";

export const authenticationReducer: MainReducer<"Authentication"> = (
  state = InitialState.Authentication,
  action
): typeof state => {
  switch (action.type) {
    case "Authentication/loginError": {
      return {
        type: "Error",
        error: action.payload.error,
      };
    }
    case "Authentication/loginPending": {
      return {
        type: "Authenticating",
      };
    }
    case "Authentication/loginSuccessful": {
      return {
        type: "Authenticated",
        user: action.payload.user,
      };
    }
    case "Authentication/logout": {
      return {
        type: "Unauthenticated",
      };
    }
    case "Authentication/signout": {
      return {
        type: "Unauthenticated",
      };
    }
    default:
      return state;
  }
};
