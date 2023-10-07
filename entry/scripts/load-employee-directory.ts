import * as IORedis from "ioredis";
import * as config from "config";
import { getAssetsAll } from "rest-endpoints/mes-bi/mes-bi";
import { getEmployeeDirectory } from "rest-endpoints/employee-directory/employee-directory";

var redis = new IORedis.Redis(config.get("redis.url"));

async function loadAllEmployees() {
  let employees = await getEmployeeDirectory();

  if (employees && employees.length > 0) {
    employees = employees.sort((a, b) =>
      a.employeeNumber.localeCompare(b.employeeNumber)
    );
    await redis.set("employeeDirectory", JSON.stringify(employees));
    return "Loaded entire employee directory into redis.";
  } else {
    return "Failed loading employee directory into redis. No employees received.";
  }
}

async function loadEmployees() {
  await loadAllEmployees().then((output) => {
    console.info(output);
  });
}

void loadEmployees().then(() => {
  redis.disconnect();
  process.exit();
});
