import * as ErrorNotifier from "atomic-object/error-notifier";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import { App } from "../modules/client";
import { BrowserRouter } from "react-router-dom";
import { buildGraphqlClient } from "client/graphql/client";
import { createBrowserHistory } from "history";
import { configureStore } from "client/redux/store";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/styles";
import { CssBaseline } from "@mui/material";
import { AppTheme } from "client/styles/mui-theme";
import { FlagsProvider } from "react-feature-flags";
import { featureFlags } from "./feature-flags";
import { checkAuthStatus } from "client/redux/actions/thunks/authentication-thunks";

const history = createBrowserHistory();

const bootstrapClient = () => {
  ErrorNotifier.setup(process.env.ROLLBAR_CLIENT_ACCESS_TOKEN, {
    captureUncaught: false,
    captureUnhandledRejections: false,
  });

  window.onerror = (message, filename?, lineno?, colno?, error?) => {
    console.error("OnError: ", message, error);
    ErrorNotifier.error(message, error);
    // history.push("/error");
  };

  window.onunhandledrejection = (event: any) => {
    const error = event.reason;
    console.error("OnUnhandledRejection: ", error);
    ErrorNotifier.error(error);
    // history.push("/error");
  };

  const store = configureStore();
  const graphqlClient = buildGraphqlClient(store, history);
  void store.dispatch(checkAuthStatus());

  const root = ReactDOM.createRoot(
    document.getElementById("app") as HTMLElement
  );
  root.render(
    <ApolloProvider client={graphqlClient}>
      <ThemeProvider theme={AppTheme}>
        <CssBaseline />
        <Provider store={store}>
          <BrowserRouter>
            <FlagsProvider value={featureFlags}>
              <App />
            </FlagsProvider>
          </BrowserRouter>
        </Provider>
      </ThemeProvider>
    </ApolloProvider>
  );
};

bootstrapClient();
