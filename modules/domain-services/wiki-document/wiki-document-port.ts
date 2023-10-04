import * as Hexagonal from "atomic-object/hexagonal";
import DataLoader = require("dataloader");

// The wiki input when calling is typically just empty. Nothing is required.
export type WikiDocumentPortGenerateInput = {} | undefined;

// The wiki output contains the output string.
export type WikiDocumentPortGenerateOutput = {
  wiki: string | undefined;
};

export type WikiDocumentPortType = {
  retrieve: DataLoader<
    WikiDocumentPortGenerateInput,
    WikiDocumentPortGenerateOutput
  >;
};

export const WikiDocumentPort = Hexagonal.port<
  WikiDocumentPortType,
  "wikiDocument"
>("wikiDocument");
