/* eslint-disable react/display-name */
import { asyncComponent } from "react-async-component";
import * as React from "react";

export const NotFoundErrorPageRouteLoader = asyncComponent({
  resolve: async () => {
    return () => <div>Not Found</div>;
  },
  name: "NotFoundErrorPage",
});
export const ServerErrorPageRouteLoader = asyncComponent({
  resolve: async () => {
    return () => <div>Server error</div>;
  },
  name: "ServerErrorPage",
});
