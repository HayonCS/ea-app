import * as path from "path";
import * as Rimraf from "rimraf";
import { promisify } from "util";

const config = require("config");
const rimraf = promisify(Rimraf.rimraf);

async function run() {
  if (process.env.NODE_ENV !== "development") {
    console.info("Refusing to clean outside of NODE_ENV=development");
    return;
  }

  if (config.smb.versionedLibraries.basePath.trim() !== "development") {
    throw new Error(
      "Refusing to clean when config.smb.versionedLibraries.basePath is not set as development"
    );
  }

  const versionedLibraryPath = path.join(
    "/",
    "var",
    "opt",
    "samba",
    config.smb.versionedLibraries.basePath
  );

  await rimraf(versionedLibraryPath, undefined);
}

void run();
