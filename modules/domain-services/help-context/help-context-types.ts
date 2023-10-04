import { HelpInfo, HelpInfoClue, Maybe } from "graphql-api/server-types.gen";

export type ButtonInfo = {
  title: string;
  description: string;
};

export type CompoundHelpInfo = {
  helpInfo: HelpInfo;
  contextSpecificHelpInfo: {
    [tpe_type: string]: {
      helpType: string;
      title: string;
      description: string;
      buttons: Array<ButtonInfo>;
    };
  };
};

export type HelpDictionary = { [component: string]: CompoundHelpInfo };

export type ClueMapIn = Maybe<Array<Maybe<HelpInfoClue>>> | undefined | null;
