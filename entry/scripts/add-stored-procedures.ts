import * as db from "db";
import * as os from "os";
import * as fs from "fs";
// import { getDomain } from "client/components/editor/editor-helpers";
const path = require("path");

const run = async () => {
  if (process.env.NODE_ENV !== "test") {
    console.info("Refusing to clone non-test db");
    return;
  }

  const NUM_TEST_DBS = process.env.CI ? 6 : os.cpus().length;

  const rootDirectory = path.resolve(__dirname, "../../db/ddl/sp");

  const sp_NewTestPlan = fs.readFileSync(
    `${rootDirectory}/sp_NewTestPlan.ddl.sql`,
    {
      encoding: "utf8",
    }
  );

  const sp_IsUserReadOnly = fs.readFileSync(
    `${rootDirectory}/sp_IsUserReadOnly.ddl.sql`,
    {
      encoding: "utf8",
    }
  );

  const before = new Date().getTime();
  for (var i = 1; i <= NUM_TEST_DBS; i++) {
    for (const dbType of ["production", "engineering"]) {
      const testDBConnection = db.getConnectionForPrefix(
        "Production",
        `test-${i}-`
      );

      await testDBConnection.raw("SET ANSI_NULLS ON");
      await testDBConnection.raw("SET QUOTED_IDENTIFIER ON");
      await testDBConnection.raw("DECLARE @userName varchar(150)");
      await testDBConnection.raw(sp_NewTestPlan);
      await testDBConnection.raw(sp_IsUserReadOnly);

      // const key = `test-${i}-${getDomain(dbType).toLowerCase()}`;
      const key = `test-${i}-production`;
      await db.destroyConnection(key);
    }
  }
  const after = new Date().getTime();

  const elapsed = after - before;
  console.info(`modified ${NUM_TEST_DBS} test DBs in ${elapsed} ms.`);

  await db.destroyAllConnections();
};

void run();
