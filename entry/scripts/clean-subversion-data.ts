import {
  cleanUpSubversionRepoDirectory,
  subversionLocalRepoDirectory,
} from "helpers/subversion-seed";

const subversionBaseDirectory = subversionLocalRepoDirectory("*");

const run = async () => {
  if (process.env.NODE_ENV !== "development") {
    console.info("Refusing to clean outside of NODE_ENV=development");
    return;
  }

  await cleanUpSubversionRepoDirectory(subversionBaseDirectory);
};

void run();
