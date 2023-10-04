import { EventEmitter } from "events";
import { StationWatcherMessage } from "graphql-api/server-types.gen";
import { PubSub } from "graphql-subscriptions";
import { StationWatcherManager } from "./StationWatcherManager";
import { StationWatcherUtils } from "./StationWatcherUtils";

export namespace StationWatcherHandlers {
  /**
   * s_customEventEmitter (PRIVATE)
   * --------------------
   *
   * This is required so that the number of max connections can be expanded.
   */
  const s_customEventEmitter: EventEmitter = ((): EventEmitter => {
    let em = new EventEmitter();
    em.setMaxListeners(50);
    return em;
  })();

  /**
   * s_stationWatcherPubSub (PRIVATE)
   * ----------------------
   *
   * Custom pubsub object for subscribers listening for changes to a specific
   * station watcher.
   */
  const s_stationWatcherPubSub = new PubSub({
    eventEmitter: s_customEventEmitter,
  });

  /**
   * Subscribe to all StationWatchers that are currently running.
   *
   * @returns an async iterator that's used for posting subscribed messages.
   */
  export const Subscribe = (computerName: string) => {
    return s_stationWatcherPubSub.asyncIterator(
      StationWatcherUtils.Key(computerName)
    );
  };

  /**
   * HandleUpdate_
   * -------------
   *
   * Helper method for handling update messages.
   *
   * @param msg
   */
  const HandleUpdate_ = async (
    msg: StationWatcherMessage
  ): Promise<StationWatcherMessage> => {
    switch (msg.operation) {
      case "status":
        return StationWatcherManager.UpdateStationWatcher(
          msg,
          StationWatcherUtils.Logger
        );

      case "tester_version":
        return StationWatcherHandlers.HandleChangeTesterVersion(msg);

      case "close_and_update":
        return StationWatcherHandlers.HandleCloseAndUpdate(msg);

      case "close":
      case "restart":
        return StationWatcherHandlers.HandleRestart(msg);

      default:
        console.error(`Received an unhandled StationWatcherMessage: ${msg}`);
    }

    return Promise.resolve({
      operation: "",
      webId: "",
    });
  };

  /**
   * HandleUpdate
   * ------------
   *
   * Entry-point for handling update messages.
   *
   * @param msg
   */
  export const HandleUpdate = async (
    msg: StationWatcherMessage | undefined
  ): Promise<StationWatcherMessage> => {
    return HandleUpdate_(StationWatcherUtils.Define(msg));
  };

  /**
   * HandleStatusMessage
   * -------------------
   *
   * A status message is used for polling purposes. After a certain time interval,
   * the StationWatcher posts an update through a mutation into the server. The
   * received call should end up here.
   *
   * @param msg The status message.
   */
  export const HandleStatusMessage = (msg: StationWatcherMessage) => {
    msg;
  };

  /**
   * HandleHelper_
   *
   * @param msg The message to forward on.
   * @param newOp The new operation name.
   */
  const HandleHelper_ = async (
    msg: StationWatcherMessage,
    newOp: string
  ): Promise<StationWatcherMessage> => {
    const computerName = StationWatcherUtils.ComputerName(msg);

    const output = {
      ...msg,
      operation: newOp,
    } as StationWatcherMessage;

    await s_stationWatcherPubSub.publish(
      StationWatcherUtils.Key(computerName),
      [output]
    );

    return Promise.resolve(output);
  };

  /**
   * HandleRestart
   * -------------
   *
   * Handle a restart call for the StationWatcher.
   *
   * @param msg The station watcher message
   *
   */
  export const HandleRestart = async (
    msg: StationWatcherMessage
  ): Promise<StationWatcherMessage> => {
    return HandleHelper_(msg, "close");
  };

  /**
   * HandleCloseAndUpdate
   * -------------
   *
   * Handle a close and update call for the station watcher.
   *
   * @param msg The station watcher message
   *
   */
  export const HandleCloseAndUpdate = async (
    msg: StationWatcherMessage
  ): Promise<StationWatcherMessage> => {
    return HandleHelper_(msg, "close_and_update");
  };

  /**
   * HandleChangeTesterVersion
   * --------------------------
   *
   * Handle changing the tester version.
   *
   * @param msg The station watcher message
   *
   */
  export const HandleChangeTesterVersion = async (
    msg: StationWatcherMessage
  ): Promise<StationWatcherMessage> => {
    return HandleHelper_(msg, "tester_version");
  };
}
