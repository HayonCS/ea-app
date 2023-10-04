import * as React from "react";
import { logout } from "client/redux/actions/thunks/authentication-thunks";
import { clearAuthToken } from "client/auth";

export const LogOut: React.FC<{}> = () => {
  React.useEffect(() => {
    clearAuthToken();
    logout();
  });

  /**
   * NOTE: Using a manual link below will insure that we do not have any
   * weird race conditions with React Router. If you use Link (which is
   * proper), some of the timing on the dispatches doesn't work and you
   * end up getting back into the site momentarily without credentials.
   */
  return (
    <div>
      <div>LOGGED OUT</div>
      <div>
        <a href="/login">Login</a>
      </div>
    </div>
  );
};
