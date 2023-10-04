import { StationWatcherMessage } from "graphql-api/server-types.gen";

export namespace StationWatcherUtils {
  export const Define = (msgIn: StationWatcherMessage | undefined) => {
    return msgIn
      ? msgIn
      : {
          operation: "none",
          webId: "",
        };
  };

  export const ComputerName = (msg: StationWatcherMessage): string => {
    if (msg) {
      if (msg.info) {
        return msg.info.computerName;
      }
    }

    return "";
  };

  /**
   * Key
   * ---
   *
   * Construct a station watcher key that indexes into Redis.
   *
   * @param computerName The name of the computer where the station watcher runs.
   * @returns the key.
   */
  export const Key = (computerName: string): string => {
    return `StationWatcher:${computerName}`;
  };

  /**
   * UserKey
   * -------
   *
   * Construct a station watcher / user key to access data in Redis.
   *
   * @param userName
   */
  export const UserKey = (userName: string): string => {
    return `StationWatcherUser:${userName}`;
  };

  /**
   * NumberOfStations
   *
   * @param msg
   *
   * @returns The number of stations or 0 if no state available.
   */
  export const NumberOfStations = (msg: StationWatcherMessage | undefined) => {
    if (msg && msg.state) {
      return msg.state.numberOfStations;
    }
    return 0;
  };

  /**
   * NumberOfStationsRunning
   *
   * @param msg
   *
   * @returns The number of stations currently running or 0 if no state available.
   */
  export const NumberOfStationsRunning = (
    msg: StationWatcherMessage | undefined
  ) => {
    if (msg && msg.state) {
      return msg.state.numberOfStationsRunning;
    }
    return 0;
  };

  /**
   * Temporary Logger method.
   *
   * @param _msg The message to output.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export const Logger = (_msg: string) => {};
}
