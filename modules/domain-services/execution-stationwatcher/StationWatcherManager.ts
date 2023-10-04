import * as DateTimeIso from "core/date-time-iso";
import { getRedisPubConnection } from "db/redis";
import { EventEmitter } from "events";
import { StationWatcherMessage } from "graphql-api/server-types.gen";
import { PubSub } from "graphql-subscriptions";
import { StationWatcherUtils } from "./StationWatcherUtils";

export namespace StationWatcherManager {
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
   * s_allStationWatcherPubSubs    (PRIVATE)
   * --------------------------
   *
   * Custom pubsub object for subscribers listening on "all station watchers". Functions
   * differently than the subscription for specific station watchers.
   */
  const s_allStationWatcherPubSubs = new PubSub({
    eventEmitter: s_customEventEmitter,
  });

  /**
   * GetAllStationWatchers
   * ---------------------
   *
   * Convenience method that should go out to Redis, fetch all of the station watcher
   * messages that have been registered and return them.
   *
   * @returns A container of station watcher messages.
   */
  export const GetAllStationWatchers = async (
    logger_?: (msg: string) => void
  ): Promise<Array<StationWatcherMessage>> => {
    let logger = logger_
      ? logger_
      : (cb: string) => {
          cb;
        };
    logger;
    const redis = getRedisPubConnection();

    const keys = await redis.keys(StationWatcherUtils.Key("*"));

    const stationWatchersJson = keys.reduce(
      async (acc: Promise<Array<string>>, key: string) => {
        let accumulator = await acc;

        const msg = await redis.get(key);
        if (msg) {
          accumulator = accumulator.concat(msg);
        }

        return Promise.resolve(accumulator);
      },
      Promise.resolve([] as Array<string>)
    );

    const stationWatchers = (await stationWatchersJson).map(
      (currentJson: string) => {
        return JSON.parse(currentJson);
      }
    );

    return Promise.resolve(stationWatchers);
  };

  /**
   * UpdateStationWatcher
   * --------------------
   *
   * Call this to update a station watcher.
   *
   * @param msg A message coming in that would cause the station watcher to update.
   *
   * @return the station watcher message that was processed.
   */
  export const UpdateStationWatcher = async (
    msg: StationWatcherMessage,
    logger_?: (msg: string) => void
  ): Promise<StationWatcherMessage> => {
    const logger = logger_
      ? logger_
      : (cb: string) => {
          cb;
        };
    logger;

    const redis = getRedisPubConnection();
    const newMessage: StationWatcherMessage = {
      ...msg,
      state: {
        lastSeen: `${DateTimeIso.toSecondsSinceEpoch(
          DateTimeIso.now()
        )}`.substr(0, 10),
        numberOfStations: StationWatcherUtils.NumberOfStations(msg),
        numberOfStationsRunning: StationWatcherUtils.NumberOfStationsRunning(
          msg
        ),
      },
    };
    const jsonMsg = JSON.stringify(newMessage);
    redis
      .set(
        StationWatcherUtils.Key(StationWatcherUtils.ComputerName(msg)),
        jsonMsg
      )
      .then(() => {})
      .catch(() => {});

    const allStationWatchers = GetAllStationWatchers(logger_);
    s_allStationWatcherPubSubs
      .publish("all", allStationWatchers)
      .then(() => {})
      .catch(() => {});

    return Promise.resolve({ ...newMessage, operation: "updated" });
  };

  /**
   * Subscribe to all StationWatchers that are currently running.
   *
   * @returns an async iterator that's used for posting subscribed messages.
   */
  export const Subscribe = () => {
    return s_allStationWatcherPubSubs.asyncIterator("all");
  };

  // Collect all station watchers from the
  export const QueryAllStationWatchers = async (): Promise<
    StationWatcherMessage[]
  > => {
    const redis = getRedisPubConnection();
    const keys = await redis.keys(StationWatcherUtils.Key("*"));

    const stationWatcherMessages = await keys.reduce(
      async (acc: Promise<StationWatcherMessage[]>, currentKey: string) => {
        const dataString = await redis.get(currentKey);
        if (dataString) {
          const msgOut = JSON.parse(dataString) as StationWatcherMessage;
          return Promise.resolve((await acc).concat(msgOut));
        }

        return Promise.resolve(acc);
      },
      Promise.resolve([] as StationWatcherMessage[])
    );

    return Promise.resolve(stationWatcherMessages);
  };
}
