import { AppThunk } from "../actions";
import { AuthenticationActions } from "../actions/authentication-actions";
import * as AuthRoutes from "client/auth/authentication-routes";
import * as querystring from "querystring";
import jwtDecode from "jwt-decode";
import {
  isAnyTypeOfAuthenticationResponse,
  isNotAuthenticatedResponse,
  isSavedUserRecord,
} from "core/auth";
import { setAuthToken, getAuthToken, clearAuthToken } from "client/auth";

export const checkAuthStatus =
  (): AppThunk<Promise<void>> => async (dispatch) => {
    const token = getAuthToken();
    if (!token) {
      dispatch(AuthenticationActions.logout());
      return;
    }
    try {
      const user = jwtDecode(token);
      if (!isSavedUserRecord(user)) {
        dispatch(AuthenticationActions.logout());
        return;
      }
      const result = await fetch(`${AuthRoutes.CHECK_AUTH}`, {
        method: "get",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.status === 401) {
        clearAuthToken();
        dispatch(AuthenticationActions.logout());
      } else {
        dispatch(AuthenticationActions.loginSuccessful(user));
      }
    } catch (e) {
      dispatch(AuthenticationActions.logout());
    }
  };

export const login =
  (username: string): AppThunk =>
  async (dispatch) => {
    // dispatch(AuthenticationActions.loginPending());
    console.log("Authentication-Thunks: " + username);
    const loginQueryString = querystring.encode({
      username,
    });
    const result = await fetch(`${AuthRoutes.LOGIN}?${loginQueryString}`, {
      method: "post",
      credentials: "include",
    });
    console.log(result);
    if (result.status === 401 || result.status !== 200) {
      dispatch(AuthenticationActions.loginError("Authentication Failed"));
      return;
    }
    const payload = await result.json();

    if (!isAnyTypeOfAuthenticationResponse(payload)) {
      dispatch(AuthenticationActions.loginError("Bad Response From Server"));
      return;
    }

    if (isNotAuthenticatedResponse(payload)) {
      dispatch(AuthenticationActions.loginError("Authentication Failed"));
      return;
    }

    try {
      const user = jwtDecode(payload.token);
      setAuthToken(payload.token);
      // if (isSavedUserRecord(user)) {
      //   setAuthToken(payload.token);

      //   dispatch(AuthenticationActions.loginSuccessful(user));
      // } else {
      //   dispatch(
      //     AuthenticationActions.loginError("Parsed token did not contain user")
      //   );
      // }
    } catch (e) {
      dispatch(
        AuthenticationActions.loginError(
          "Could not parse authentication token from server"
        )
      );
    }
  };

export const logout = (): AppThunk => async (dispatch) => {
  await fetch(`${AuthRoutes.LOGOUT}`, {
    method: "post",
  });
  clearAuthToken();
  dispatch(AuthenticationActions.logout());
};
