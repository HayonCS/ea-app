import * as GraphQL from "graphql-api/server-types.gen";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { getRedisSubConnection } from "db/redis";
import { StationWatcherHandlers } from "domain-services/execution-stationwatcher/StationWatcherHandlers";
import { StationWatcherManager } from "domain-services/execution-stationwatcher/StationWatcherManager";
import { TestStationManager } from "domain-services/execution-teststation/TestStationManager";
import { TestStationHandlers } from "domain-services/execution-teststation/TestStationHandlers";
import { TestStationUtils } from "domain-services/execution-teststation/TestStationUtils";

const redisSub = getRedisSubConnection();

const pubsub = new RedisPubSub({
  publisher: redisSub as any,
  subscriber: redisSub as any,
});

const subscriptionResolvers: GraphQL.SubscriptionResolvers = {
  lockChanged: {
    subscribe: (async () => {
      return pubsub.asyncIterator("lockChanged");
    }) as any,
    resolve: (parent: any) => {
      return parent;
    },
  },

  stationWatchers: {
    subscribe: (async (parent: any, args: any) => {
      if (args.computerName === "all") {
        return StationWatcherManager.Subscribe();
      } else {
        return StationWatcherHandlers.Subscribe(args.computerName);
      }
    }) as any,
    resolve: (parent: any) => {
      return parent;
    },
  },

  testStations: {
    subscribe: (async (parent: any, args: any) => {
      if (args.computerName === "all") {
        return TestStationManager.Subscribe();
      } else {
        return TestStationHandlers.Subscribe(
          args.computerName,
          args.stationName
        );
      }
    }) as any,
    resolve: (parent: any) => {
      if (parent === undefined) {
        return TestStationUtils.Empty();
      }
      return parent;
    },
  },
};

export default subscriptionResolvers;
