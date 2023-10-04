import * as Hexagonal from "atomic-object/hexagonal";
import DataLoader = require("dataloader");
import { HelpDictionary } from "./help-context-types";

// The wiki input when calling is typically just empty. Nothing is required.
export type WikiDocumentPortGenerateInput = {} | undefined;

// The wiki output contains the output string.
export type WikiDocumentPortGenerateOutput = {
  wiki: string;
};

// The standard inputs for this population input.
export type HelpContextPortPopulateInput = {
  wiki: string;
};

export type HelpContextPortPopulateOutput = {
  helpDictionary: HelpDictionary;
};

export type HelpContextPortType = {
  populate: DataLoader<
    HelpContextPortPopulateInput,
    HelpContextPortPopulateOutput
  >;
};

export const HelpContextPort = Hexagonal.port<
  HelpContextPortType,
  "helpContext"
>("helpContext");
