import { exec } from "child_process";
import * as path from "path";
import * as RimRaf from "rimraf";
import { svnCheckout } from "subversion/util";
import { promisify } from "util";

const rimraf = promisify(RimRaf.rimraf);

const createRepo = (repoName: string) => {
  return new Promise<void>((resolve, reject) => {
    exec(`svnadmin create /home/svn/${repoName}`, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

const fixRepoOwnership = (repoName: string) => {
  return new Promise<void>((resolve, reject) => {
    exec(`chmod o+w -R /home/svn/${repoName}`, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

const copySeedFilesToRepository = async (
  repoDirectory: string,
  seedDataFiles: string[]
) => {
  await Promise.all(
    seedDataFiles.map(async (seedDataFile) => {
      await new Promise<void>((resolve, reject) => {
        exec(`cp -r ${seedDataFile} ${repoDirectory}`, (err) => {
          if (err) {
            reject(err);
          }
          resolve();
        });
      });
    })
  );
};

const commitFilesToSvn = async (repoDirectory: string) => {
  await new Promise<void>((resolve, reject) => {
    exec(
      `
          cd ${repoDirectory} && svn cleanup && svn add * && svn commit -m 'Add stuff' --username user --password password`,
      (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      }
    );
  });
};

export const subversionLocalRepoDirectory = (repoName: string) => {
  return path.join("/home", "svn", repoName);
};

export const subversionCheckoutDirectory = (repoName: string) => {
  return path.join("/tmp", repoName);
};

export const cleanUpSubversionRepoDirectory = async (
  subversionDirectory: string
) => {
  await rimraf(subversionDirectory, undefined);
};

export const seedSubversionData = async (
  repoName: string,
  ...seedDataFiles: string[]
) => {
  const subversionRepoDirectory = subversionLocalRepoDirectory(repoName);
  await cleanUpSubversionRepoDirectory(subversionRepoDirectory);
  await createRepo(repoName);
  await fixRepoOwnership(repoName);
  const checkoutDirectory = subversionCheckoutDirectory(repoName);
  await rimraf(checkoutDirectory, undefined);
  await svnCheckout(`http://subversion/svn/${repoName}`, checkoutDirectory, {
    username: "user",
    password: "password",
  } as any);
  await copySeedFilesToRepository(checkoutDirectory, seedDataFiles);
  await commitFilesToSvn(checkoutDirectory);
};
