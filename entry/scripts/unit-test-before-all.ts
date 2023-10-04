const { getConnection, destroyConnection, truncateAll } = require("db");
const redis = require("db/redis");

module.exports = async () => {
  if (process.env.NODE_ENV !== "test") {
    console.error("Set NODE_ENV to test to run tests");
    process.exit(1);
  }

  await truncateAll(getConnection("Production"));
  await destroyConnection();

  const keys = await redis.getRedisPubConnection().keys("test:*");
  if (keys.length > 0) await redis.getRedisPubConnection().del(...keys);
  await redis.destroyPubConnection();
};
