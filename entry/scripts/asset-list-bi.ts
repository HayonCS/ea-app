import * as IORedis from "ioredis";
import * as config from "config";

config.get("redis.url");
var _redis = new IORedis.Redis(config.get("redis.url"));

async function FlushAllLocks() {
  const pattern = `testplanlockout:*`;

  const keys = await _redis.keys(pattern);

  var count = 0;

  if (keys.length) {
    count = await _redis.del(keys);
  }

  return count >= 1
    ? `Removed ${count} occurrences of locking keys.`
    : `No keys matching pattern "${pattern}" were found.`;
}

async function FlushLocks() {
  await FlushAllLocks().then((output) => {
    console.info(output);
  });
}

void FlushLocks().then(() => {
  _redis.disconnect();
  process.exit();
});
