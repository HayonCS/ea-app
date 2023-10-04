import * as fs from "fs";
import * as path from "path";
import * as Rimraf from "rimraf";
import * as childProcess from "child_process";

import { promisify } from "util";

const config = require("config");

const exec = promisify(childProcess.exec);
const rimraf = promisify(Rimraf.rimraf);
const copyFile = promisify(fs.copyFile);
const rename = promisify(fs.rename);

async function run() {
  if (process.env.NODE_ENV !== "development") {
    console.info("Refusing to seed outside of NODE_ENV=development");
    return;
  }

  if (config.smb.versionedLibraries.basePath.trim() !== "development") {
    throw new Error(
      "Refusing to seed when config.smb.versionedLibraries.basePath is not set as development"
    );
  }

  const sambaPath = path.join("/", "var", "opt", "samba");

  const versionedLibraryPath = path.join(
    sambaPath,
    config.smb.versionedLibraries.basePath
  );

  const zipFileSource = path.resolve(
    ".",
    "entry",
    "scripts",
    "artifacts",
    "samba",
    "versioned-libraries",
    "libraries.tar.gz"
  );

  const zipFileDestination = path.join(sambaPath, "libraries.tar.gz");

  await rimraf(versionedLibraryPath, undefined);

  await copyFile(zipFileSource, zipFileDestination);

  await exec(`tar -xf ${zipFileDestination} -C ${sambaPath}`);

  await rimraf(zipFileDestination, undefined);

  await rename(path.join(sambaPath, "Libraries"), versionedLibraryPath);
}

void run();
