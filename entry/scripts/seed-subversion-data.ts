import * as path from "path";

import { seedSubversionData } from "helpers/subversion-seed";

const run = async () => {
  if (process.env.NODE_ENV !== "development") {
    console.info("Refusing to seed outside of NODE_ENV=development");
    return;
  }

  await seedSubversionData(
    "gentex-repo",
    path.resolve(
      ".",
      "entry",
      "scripts",
      "artifacts",
      "subversion",
      "config-data"
    ),
    path.resolve(
      ".",
      "entry",
      "scripts",
      "artifacts",
      "subversion",
      "reserved-words.ipp"
    )
  );
};

void run();
