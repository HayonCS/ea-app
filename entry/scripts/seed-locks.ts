import * as IORedis from "ioredis";
import * as config from "config";

var _redis = new IORedis.Redis(config.get("redis.url"));

const tpList = [
  "000-0000-000",
  "555-5555-104",
  "700-0425-000",
  "555-5555-123",
  "555-0652-000",
  "700-0428-000",
  "280-0676-000",
];

const lockLengthMs = 3600000;
const lockEmployeeNumber = 12345;

async function AddEngLock(testPlanName: string) {
  const engkey = `testplanlockout:${testPlanName}:Engineering:lockingUserId`;

  var exists = await _redis.exists(engkey);

  if (exists === 0) {
    var success = await _redis.psetex(engkey, lockLengthMs, lockEmployeeNumber);
    return success === "OK"
      ? `${testPlanName}:Eng was successfully locked!`
      : `Failed to lock ${testPlanName}`;
  }

  return `Eng key for ${testPlanName} already exists!`;
}

async function AddProdLock(testPlanName: string) {
  const prodkey = `testplanlockout:${testPlanName}:Production:lockingUserId`;

  var exists = await _redis.exists(prodkey);
  if (exists === 0) {
    var success = await _redis.psetex(
      prodkey,
      lockLengthMs,
      lockEmployeeNumber
    );
    return success === "OK"
      ? `${testPlanName}:Prod was successfully locked!`
      : `Failed to lock ${testPlanName}`;
  }

  return `Prod key for ${testPlanName} already exists!`;
}

async function SeedLocks() {
  for (var i = 0; i < tpList.length; ++i) {
    await AddProdLock(tpList[i]).then((output) => {
      console.info(output);
    });
    await AddEngLock(tpList[i]).then((output) => {
      console.info(output);
    });
  }
}

void SeedLocks().then(() => {
  _redis.disconnect();
  process.exit();
});
