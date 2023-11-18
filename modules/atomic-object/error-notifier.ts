/**
 * Provides a logger-like interface for calling into an error-notification
 * service, currently rollbar.
 *
 * This is designed to be usable on both the client and the server, assuming the
 * underlying service client can run in both contexts. If using rollbar,
 * ROLLBAR_CLIENT_ACCESS_TOKEN must be present in the environment at build time.
 * See the use of `DefinePlugin` in `client.config.js`.
 *
 * On the server, ROLLBAR_ACCESS_TOKEN is used.
 */
var Rollbar = require("rollbar");
/** The rollbar access token. In the client, this will be ROLLBAR_CLIENT_ACCESS_TOKEN. See client.config.js */
let ACCESS_TOKEN: string | null = null;
export let ROLLBAR_INSTANCE: any = null;

type SetupOptions = {
  captureUncaught: boolean;
  captureUnhandledRejections: boolean;
};
export function setup(
  accessToken: string | undefined,
  opts?: Partial<SetupOptions>
) {
  const settings: SetupOptions = {
    captureUncaught: true,
    captureUnhandledRejections: true,
    ...opts,
  };
  ACCESS_TOKEN = accessToken || null;
  if (ACCESS_TOKEN) {
    ROLLBAR_INSTANCE = new Rollbar({
      accessToken,
      ...settings,
    });
  }
}

export enum ErrorLevel {
  critical = "critical",
  error = "error",
  warning = "warning",
  info = "info",
  debug = "debug",
}

export function makeWrapper(level: ErrorLevel): (...args: any[]) => void {
  if (__TEST__) {
    return () => {};
  } else {
    return (...args: any[]) => {
      if (ROLLBAR_INSTANCE) {
        ROLLBAR_INSTANCE[level].apply(ROLLBAR_INSTANCE, args);
      }
    };
  }
}

export const critical = makeWrapper(ErrorLevel.critical);
export const error = makeWrapper(ErrorLevel.error);
export const warning = makeWrapper(ErrorLevel.warning);
export const info = makeWrapper(ErrorLevel.info);
export const debug = makeWrapper(ErrorLevel.debug);
