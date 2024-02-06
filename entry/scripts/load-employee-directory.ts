import * as IORedis from "ioredis";
import * as config from "config";
import { getEmployeeDirectory } from "rest-endpoints/employee-directory/employee-directory";

var redis = new IORedis.Redis(config.get("redis.url"));

async function loadActiveDirectory() {
  let employees = await getEmployeeDirectory();

  employees.sort(
    (a, b) =>
      a.firstName.localeCompare(b.firstName) ||
      a.lastName.localeCompare(b.lastName)
  );

  if (employees.length > 0) {
    await redis.set("employeeDirectory", JSON.stringify(employees));
    return "Loaded active employee directory into redis.";
  } else {
    return "Failed loading active employee directory into redis. No active employees found.";
  }
}

async function loadDirectory() {
  await loadActiveDirectory().then((output) => {
    console.info(output);
  });
}

void loadDirectory().then(() => {
  redis.disconnect();
  process.exit();
});
