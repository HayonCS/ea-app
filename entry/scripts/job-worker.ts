import * as Bull from "bull";
import * as config from "config";

// const mainQueue = new Bull("main", {
//   redis: config.get("redis.url"),
//   prefix: config.get("redis.prefix"),
// });
const mainQueue = new Bull("main", {
  redis: {
    path: config.get("redis.url"),
    enableTLSForSentinelMode: false,
    tls: undefined,
    maxRetriesPerRequest: null,
  },
  prefix: config.get("redis.prefix"),
});

console.info(
  `Starting ${config.get<number>("jobs.workers")} workers (job-worker.ts)`
);

const process = require("./main-queue-processor");
void mainQueue.process(config.get<number>("jobs.workers"), process);

void mainQueue.resume();
