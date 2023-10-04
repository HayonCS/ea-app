import { CachePort } from "atomic-object/cache/ports";
import * as Hexagonal from "atomic-object/hexagonal";
import * as DataLoader from "dataloader";
import { graceMs, maxAgeMs, minAgeMs } from "domain-services/cache-policy";
import { parseReservedKeywords } from "domain-services/reserved-keywords/parser";
import { SubversionPort } from "subversion/port";
import { ReservedKeywordsPort as ReservedKeywordsRepositoryPort } from "./port";

export type ReservedKeywords = {
  find: DataLoader<{}, string[]>;
};

export const reservedKeywordsRepositoryAdapter = Hexagonal.adapter({
  port: ReservedKeywordsRepositoryPort,
  build: (ctx) => {
    return {
      find: new DataLoader<{}, string[]>(
        async (args) => {
          const keywords = await ctx.get(CachePort).get({
            key: "keywords",
            func: async () => {
              const repo = ctx.get(SubversionPort).repo();

              const interfaceFile = await repo.getFileContents({
                path: "/reserved-words.ipp",
              });

              if (interfaceFile.type !== "text") {
                throw new Error("Unexpected file type for reserved words.");
              }

              return parseReservedKeywords(interfaceFile.contents);
            },
            // https://spin.atomicobject.com/2018/02/12/coordinated-cache-refill-redis-node/
            settings: {
              maxAgeMs,
              minAgeMs,
              graceMs,
            },
          });

          return args.map(() => keywords);
        },
        {
          cacheKeyFn: () => "",
        }
      ),
    };
  },
});
