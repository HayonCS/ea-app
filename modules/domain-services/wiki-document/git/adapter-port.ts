import * as Hexagonal from "atomic-object/hexagonal";
import * as DataLoader from "dataloader";
import {
  WikiDocumentPort,
  WikiDocumentPortGenerateInput,
  WikiDocumentPortGenerateOutput,
} from "../wiki-document-port";
import * as stringify from "json-stable-stringify";
import { CachePort } from "atomic-object/cache/ports";
import { maxAgeMs } from "domain-services/cache-policy";
import { WikiGitUtils } from "./wiki-git-utils";

export const wikiDocumentGitAdapter = Hexagonal.adapter({
  port: WikiDocumentPort,
  build: (ctx) => {
    return {
      retrieve: new DataLoader<
        WikiDocumentPortGenerateInput,
        WikiDocumentPortGenerateOutput
      >(
        async () => {
          const wikiContents = await ctx.get(CachePort).get({
            key: "help_wiki",
            func: async () => {
              const cloneOrUpdateResult = await WikiGitUtils.cloneOrUpdate();
              if (
                cloneOrUpdateResult.update ||
                cloneOrUpdateResult.firstTimeClone
              ) {
                console.info("🔵 HELP WIKI CONTENTS CACHE INVALIDATED");
                await ctx.get(CachePort).clear({
                  cacheKeyFn: () => "",
                  key: "help_context",
                  func: async () => {},
                  settings: {
                    graceMs: 10,
                    maxAgeMs: 10,
                    minAgeMs: 10,
                  },
                });
              }
              return Promise.resolve(cloneOrUpdateResult.contents);
            },
            settings: {
              maxAgeMs,
              minAgeMs: 10, // constantly attempt to see if we need to update.
              graceMs: 10000, // ~10 seconds to recompute.
            },
          });

          return Promise.resolve([
            {
              wiki: wikiContents,
            },
          ]);
        },
        {
          cacheKeyFn: stringify,
        }
      ),
    };
  },
});
