import * as DataLoader from "dataloader";
import * as Hexagonal from "atomic-object/hexagonal";
import * as _ from "lodash-es";
import * as path from "path";
import * as stringify from "json-stable-stringify";

import { CachePort } from "atomic-object/cache/ports";

import { Library } from "domain-services/versioned-libraries/versioned-library";
import { SmbPort } from "smb/port";
import { SmbPrefixPort, UserNamePort } from "context/ports";
import { VersionedLibrariesPort } from "./port";
import { getLibrariesFromNetworkShare } from "./crawler";
import { graceMs, maxAgeMs, minAgeMs } from "domain-services/cache-policy";

const config = require("config");

export type VersionedLibraries = {
  find: DataLoader<
    {
      libraryName: string;
    },
    Library | undefined
  >;
  findAll: DataLoader<
    {
      libraryName_in?: string[] | null;
      libraryName_re?: string | null;
    },
    Library[]
  >;
  reset: () => Promise<string>;
};

export const versionedLibrariesRepositoryAdapter = Hexagonal.adapter({
  port: VersionedLibrariesPort,
  build: (ctx) => {
    const getLibraries = async () => {
      const libraries = await ctx.get(CachePort).get({
        key: "libraries",
        func: async () => {
          const smbPath = path.join(
            config.smb.versionedLibraries.basePath,
            ctx.get(SmbPrefixPort)
          );

          console.info("🟠 VERSIONED LIBRARY CACHE INVALIDATED", smbPath);

          const share = await ctx.get(SmbPort).open("VersionedLibraries");
          try {
            const allLibraries = await getLibrariesFromNetworkShare(
              share,
              smbPath
            );

            const byLibraryName = _.groupBy(allLibraries, (l) => l.libraryName);

            await share.close();

            console.info("🟠 VERSIONED LIBRARY DATA FETCHED", smbPath);

            return byLibraryName;
          } finally {
            await share.close();
          }
        },
        // https://spin.atomicobject.com/2018/02/12/coordinated-cache-refill-redis-node/
        settings: {
          maxAgeMs,
          minAgeMs,
          graceMs,
        },
      });

      return libraries;
    };

    return {
      // find: new DataLoader<{ libraryName: string }, Library | undefined>(),
      find: new DataLoader<{ libraryName: string }, Library | undefined>(
        async (arrayOfKeys: readonly { libraryName: string }[]) => {
          const libraries = await getLibraries();

          return arrayOfKeys.map((arg) => {
            const versions = _.flatten(
              (libraries[arg.libraryName] || []).map((l) => l.versions)
            );

            if (versions.length === 0) {
              return undefined;
            }

            return {
              libraryName: arg.libraryName,
              versions,
            };
          });
        },
        {
          cacheKeyFn: stringify as any,
        }
      ),
      findAll: new DataLoader<
        { libraryName_in: string[]; libraryName_re: string },
        Library[]
      >(
        async (
          arrayOfKeys: readonly {
            libraryName_in?: string[] | null;
            libraryName_re?: string | null;
          }[]
        ) => {
          const libraries = _.flatten(Object.values(await getLibraries()));

          return arrayOfKeys.map((arg) => {
            if (arg.libraryName_re) {
              return libraries.filter(
                (library) =>
                  arg.libraryName_re &&
                  library.libraryName.match(arg.libraryName_re)
              );
            }

            if (arg.libraryName_in) {
              return libraries.filter(
                (library) =>
                  arg.libraryName_in &&
                  arg.libraryName_in.includes(library.libraryName)
              );
            }

            return libraries;
          });
        },
        {
          cacheKeyFn: stringify as any,
        }
      ),
      reset: async (): Promise<string> => {
        console.info(
          "👤 INVALIDATE DCIGEN LIBRARIES",
          ctx.get(UserNamePort) || "Unknown User"
        );

        await ctx.get(CachePort).clear({
          cacheKeyFn: () => "",
          key: "libraries",
          func: async () => {},
          settings: {
            maxAgeMs,
            minAgeMs,
            graceMs,
          },
        });

        return Promise.resolve("success");
      },
    };
  },
});
