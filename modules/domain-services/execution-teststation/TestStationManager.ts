import { getRedisPubConnection } from "db/redis";
import { EventEmitter } from "events";
import { TestStationMessage } from "graphql-api/server-types.gen";
import { PubSub } from "graphql-subscriptions";
import { TestStationUtils } from "./TestStationUtils";

export namespace TestStationManager {
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
   * s_allTestStationPubSubs    (PRIVATE)
   * -----------------------
   *
   * Custom pubsub object for subscribers listening on "all test stations". Functions
   * differently than the subscription for specific test stations.
   */
  const s_allTestStationPubSubs = new PubSub({
    eventEmitter: s_customEventEmitter,
  });

  /**
   * GetAllTestStations
   * ------------------
   *
   * Convenience method that should go out to Redis, fetch all of the test station
   * messages that have been registered and return them.
   *
   * @returns A container of test stations.
   */
  export const GetAllTestStations = async (): Promise<
    Array<TestStationMessage>
  > => {
    const redis = getRedisPubConnection();

    const keys = await redis.keys(TestStationUtils.Key("*", "*"));

    const testStationsJson = keys.reduce(
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

    const testStations = (await testStationsJson).map((currentJson: string) => {
      return JSON.parse(currentJson);
    });

    return Promise.resolve(testStations);
  };

  /**
   * UpdateTestStation
   * -----------------
   *
   * Call this to update a test station.
   *
   * @param msg A message coming in that would cause the station watcher to update.
   *
   * @return the station watcher message that was processed.
   */
  export const UpdateTestStation = async (
    msg: TestStationMessage
  ): Promise<TestStationMessage> => {
    const redis = getRedisPubConnection();
    const jsonMsg = JSON.stringify(msg);
    await redis.set(
      TestStationUtils.Key(
        TestStationUtils.ComputerName(msg),
        TestStationUtils.StationName(msg)
      ),
      jsonMsg
    );

    const allTestStations = GetAllTestStations();
    await s_allTestStationPubSubs.publish("all", allTestStations);

    return Promise.resolve({ ...msg, operation: "updated" });
  };

  /**
   * Subscribe to all StationWatchers that are currently running.
   *
   * @returns an async iterator that's used for posting subscribed messages.
   */
  export const Subscribe = () => {
    return s_allTestStationPubSubs.asyncIterator("all");
  };
}
