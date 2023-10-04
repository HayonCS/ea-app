import { ApiContext } from "context";
import { WikiDocumentPort } from "domain-services/wiki-document/wiki-document-port";
import {
  HelpInfo,
  HelpInfoContext,
  HelpSection,
  Maybe,
} from "graphql-api/server-types.gen";
import { HelpContextPort } from "../help-context-port";
import { ClueMapIn, HelpDictionary } from "../help-context-types";

export namespace HelpContextBusinessLogic {
  const NoResult = async (): Promise<HelpInfo> => {
    return Promise.resolve({});
  };

  export const keywordMap = (data: ClueMapIn): { [name: string]: string } => {
    if (data) {
      return data.reduce((acc, c) => {
        if (c && c.name && c.value) {
          acc[c.name] = c.value;
          acc[`(${c.name})`] = `(${c.value})`;
        }
        return acc;
      }, {} as { [name: string]: string });
    }

    return {};
  };

  export const replaceWithClue = (
    str: Maybe<string> | undefined,
    clues: { [name: string]: string }
  ): Maybe<string> | undefined => {
    if (str === undefined || str === null) {
      return str;
    }

    const str2 = Object.keys(clues).reduce((acc, currentClueName) => {
      const commentClueName = `<!-- ${currentClueName.trim()} -->`;
      const clueLength = commentClueName.length;

      let i = acc.indexOf(commentClueName);
      while (i >= 0) {
        acc =
          acc.substring(0, i) +
          clues[currentClueName] +
          acc.substring(i + clueLength);
        i = acc.indexOf(commentClueName, i);
      }

      return acc;
    }, str);

    return str2;
  };

  const createLinkFromHelpKey = (helpKey: string) =>
    `https://dev.azure.com/gentex/gtm_core_software/_wiki/wikis/GTM-Core-Software.wiki/5158/Test-Plan-Editor#${helpKey}`;

  export const findHelpInDictionary = async (
    helpKey: string,
    clues: { [name: string]: string },
    helpDictionary: HelpDictionary
  ): Promise<HelpInfo> => {
    const helpInfoBase = helpDictionary[helpKey];
    if (helpInfoBase === undefined || helpInfoBase === null) {
      return Promise.resolve({});
    }

    const testPlanEditorType = "type" in clues ? clues["type"] : undefined;

    let bodyOfHelp: HelpInfo["body"] = helpInfoBase.helpInfo.body?.map((b) => {
      return {
        ...b,
        text: replaceWithClue(b?.text, clues),
        title: replaceWithClue(b?.title, clues),
      };
    });

    if (
      testPlanEditorType &&
      testPlanEditorType in helpInfoBase.contextSpecificHelpInfo
    ) {
      bodyOfHelp = (bodyOfHelp ?? []).concat({
        helpType: "body",
        text:
          helpInfoBase.contextSpecificHelpInfo[testPlanEditorType].description,
        title: helpInfoBase.contextSpecificHelpInfo[testPlanEditorType].title,
      });

      if (
        helpInfoBase.contextSpecificHelpInfo[testPlanEditorType].buttons
          .length > 0
      ) {
        const bodyOfHelp2 = helpInfoBase.contextSpecificHelpInfo[
          testPlanEditorType
        ].buttons.map((currentButton) => {
          return {
            helpType: "button",
            text: replaceWithClue(currentButton.description, clues),
            title: replaceWithClue(currentButton.title, clues),
          };
        });

        bodyOfHelp = bodyOfHelp.concat(bodyOfHelp2);
      }
    }

    if (bodyOfHelp && bodyOfHelp.length > 0) {
      const linkHelpSection: HelpSection = {
        helpType: "link",
        text: createLinkFromHelpKey(helpKey),
        title: `${bodyOfHelp[0]!.title} Wiki`,
      };
      bodyOfHelp = bodyOfHelp.concat(linkHelpSection);
    }

    return Promise.resolve({
      titleText: helpInfoBase.helpInfo.titleText,
      key: helpKey,
      body: bodyOfHelp,
    });
  };

  export const query = async (
    parent: any,
    helpInfoContext: HelpInfoContext,
    ctx: ApiContext
  ): Promise<HelpInfo> => {
    parent;

    if (helpInfoContext.key === undefined) {
      return NoResult();
    }

    if (helpInfoContext.key !== null) {
      const clues = keywordMap(helpInfoContext.clues);

      const wiki =
        (await ctx.get(WikiDocumentPort).retrieve.load({})).wiki ?? "";

      const helpDictionary: HelpDictionary =
        (
          await ctx.get(HelpContextPort).populate.load({
            wiki,
          })
        ).helpDictionary ?? {};

      return findHelpInDictionary(
        helpInfoContext.key ?? "",
        clues,
        helpDictionary
      );
    }

    return NoResult();
  };
}
