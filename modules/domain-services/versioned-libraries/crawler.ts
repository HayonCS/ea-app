import * as _ from "lodash-es";
import * as path from "path";

import { Library, VersionedLibrary } from "./versioned-library";

import { SmbShare } from "smb";
import { getVersionedLibrary } from "./dcigen-xmlparser";
import { sortObjectArrayNaturally } from "helpers/sort-naturally";

import * as BlueBirdPromise from "bluebird";
/**
 * Directory Structure is as follows:
 *
 * Base Location: //znas1/Production/TM/Libraries
 *
 * libraryname (ex. gtm.libraries.container)
 *   |
 *   +- X.Y.Z (where X,Y,Z are major/minor/patch)
 *      |
 *      +- [ProgramFilesDirectory]
 *         |
 *         +- platform (most of the time it's windows-x32-vc10) windows-x64-any
 *            |
 *            +- files (dlls, changelog, images, etc.)
 *            +- dcigen.xml <--- This is where the money is.
 *
 *
 * Extra Piece of data: whether or not this is the current version?
 *
 */

export const getLibrariesFromNetworkShare = async (
  share: SmbShare,
  basePath: string = ""
): Promise<Library[]> => {
  const readPlatform = async (args: {
    libraryName: string;
    versionNumber: string;
    platformName: string;
  }): Promise<VersionedLibrary> => {
    const fileName = path.join(
      basePath,
      args.libraryName,
      args.versionNumber,
      "[ProgramFilesDirectory]",
      args.platformName,
      "dcigen.xml"
    );

    const MAX_ATTEMPTS = 4;
    let retryCounter = 0;
    let lastError = "";
    while (retryCounter < MAX_ATTEMPTS) {
      ++retryCounter;

      try {
        const dcigenContents = await share.readFile(fileName);

        const versionedLibrary = await getVersionedLibrary(dcigenContents, {
          libraryName: args.libraryName,
          versionNumber: args.versionNumber,
          platformName: args.platformName,
        });

        return versionedLibrary;
      } catch (e) {
        lastError = e ? e.toString() : "Unknown error";
        if (-1 === lastError.indexOf("STATUS_PENDING")) {
          break;
        }
      }
    }

    console.error(
      "🔄 SmbShare.readFile ATTEMPTS",
      retryCounter,
      fileName,
      lastError
    );

    return {
      libraryName: args.libraryName,
      platformName: args.platformName,
      versionNumber: args.versionNumber,
      documentationLink: "",
      enums: [],
      functions: [],
      isCurrentRelease: false,
      versionControlUrl: "",
    };
  };

  const readVersion = async (args: {
    libraryName: string;
    versionNumber: string;
  }) => {
    const platformNames = _.orderBy(
      await share.readDir(
        path.join(
          basePath,
          args.libraryName,
          args.versionNumber,
          "[ProgramFilesDirectory]"
        )
      )
    );

    return BlueBirdPromise.map(
      platformNames,
      async (platformName: any) =>
        await readPlatform({
          libraryName: args.libraryName,
          versionNumber: args.versionNumber,
          platformName,
        }),
      { concurrency: 10 }
    );
  };

  const readLibrary = async (args: { libraryName: string }) => {
    const versionNumbers = _.orderBy(
      await share.readDir(path.join(basePath, args.libraryName))
    );

    return _.flatten(
      await BlueBirdPromise.map(
        versionNumbers.filter((ver) => {
          return ver !== "0.0.0";
        }),
        async (versionNumber: any) => {
          return await readVersion({
            libraryName: args.libraryName,
            versionNumber,
          });
        },
        { concurrency: 10 }
      )
    );
  };

  const readLibraries = async () => {
    const libraryNames = _.orderBy(await share.readDir(basePath));

    return _.flatten(
      await BlueBirdPromise.map(
        libraryNames,
        async (libraryName: any) => {
          return await readLibrary({
            libraryName,
          });
        },
        { concurrency: 10 }
      )
    );
  };

  // const versionedLibraries = sortObjectArrayNaturally(await readLibraries(), [
  //   {
  //     sortField: "libraryName",
  //   },
  //   { sortField: "versionNumber" },
  // ]);

  const versionedLibraries: any[] = [];

  const versionedLibrariesByLibraryName = _.groupBy(
    versionedLibraries,
    "libraryName"
  );

  const libraries = _.orderBy(Object.keys(versionedLibrariesByLibraryName)).map(
    (libraryName) => {
      return {
        libraryName,
        versions: versionedLibrariesByLibraryName[libraryName],
      };
    }
  );

  return libraries;
};
