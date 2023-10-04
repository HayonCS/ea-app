import * as config from "config";
import * as throng from "throng";

import { startServer } from "server";

if (config.get<boolean>("server.cluster")) {
  console.info(`Starting ${config.get<number>("server.workers")} workers`);
  throng(config.get<number>("server.workers"), startServer);
} else {
  startServer();
}
