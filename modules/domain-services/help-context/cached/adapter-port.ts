import * as Hexagonal from "atomic-object/hexagonal";
import * as DataLoader from "dataloader";
import {
  HelpContextPort,
  HelpContextPortPopulateInput,
  HelpContextPortPopulateOutput,
} from "../help-context-port";
import * as stringify from "json-stable-stringify";
import { WikiParser } from "./wiki-parser";
import {
  ButtonInfo,
  CompoundHelpInfo,
  HelpDictionary,
} from "../help-context-types";
import { CachePort } from "atomic-object/cache/ports";
import { graceMs, maxAgeMs, minAgeMs } from "domain-services/cache-policy";

type AdditionalTypeInfo = {
  [tpe_type: string]: {
    helpType: string;
    title: string;
    description: string;
    buttons: Array<ButtonInfo>;
  };
};

const generateHelpContext = (wikiContents: string) => {
  const parsedElements: Array<WikiParser.DocSection> =
    WikiParser.parse(wikiContents);

  const helpDictionary: HelpDictionary = parsedElements.reduce(
    (acc, currentDocSection) => {
      const key = currentDocSection.key;
      const baseButtons = currentDocSection.buttons.map((bb) => {
        return {
          helpType: "button",
          title: bb.action,
          text: bb.description,
        };
      });

      const contextSpecificHelpInfo: AdditionalTypeInfo =
        currentDocSection.additional.reduce(
          (acc2, currentDocSectionAdditional) => {
            if (currentDocSectionAdditional.tpe_type === undefined) {
              return acc2;
            }

            acc2[currentDocSectionAdditional.tpe_type] = {
              helpType: "body",
              title: currentDocSectionAdditional.title,
              buttons: currentDocSectionAdditional.buttons,
              description: currentDocSectionAdditional.description,
            };
            return acc2;
          },
          {} as AdditionalTypeInfo
        );

      const compoundInfo: CompoundHelpInfo = {
        helpInfo: {
          key,
          titleText: currentDocSection.title,
          body: [
            {
              helpType: "body",
              text: currentDocSection.description,
              title: currentDocSection.title,
            },
          ].concat(baseButtons),
        },
        contextSpecificHelpInfo,
      };

      acc[key] = compoundInfo;
      return acc;
    },
    {} as HelpDictionary
  );
  return helpDictionary;
};

const invalidateCacheEntry = async (ctx: any, name: string): Promise<void> => {
  console.info(`🔴 INVALIDATE ${name.toUpperCase().replace("_", " ")}`);
  await ctx.get(CachePort).clear({
    cacheKeyFn: () => "",
    key: name,
    func: async () => {},
    settings: {
      graceMs: 10,
      maxAgeMs: 10,
      minAgeMs: 10,
    },
  });
  return Promise.resolve(undefined);
};

export const helpContextCachedAdapter = Hexagonal.adapter({
  port: HelpContextPort,
  build: (ctx) => {
    return {
      populate: new DataLoader<
        HelpContextPortPopulateInput,
        HelpContextPortPopulateOutput
      >(
        async (inputs) => {
          const helpContext = await ctx.get(CachePort).get({
            key: "help_context",
            func: async () => {
              console.info("🔵 HELP CONTEXT CACHE INVALIDATED");

              if (inputs[0].wiki.length === 0) {
                await invalidateCacheEntry(ctx, "help_wiki");
              }
              return Promise.resolve(generateHelpContext(inputs[0].wiki));
            },
            settings: {
              maxAgeMs,
              minAgeMs,
              graceMs,
            },
          });

          if (Object.keys(helpContext).length === 0) {
            await invalidateCacheEntry(ctx, "help_context");
          }

          return Promise.resolve([
            {
              helpDictionary: helpContext,
            },
          ]);
        },
        {
          cacheKeyFn: stringify as any,
        }
      ),
    };
  },
});
