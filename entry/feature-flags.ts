import { notNilString } from "helpers/nil-helpers";

const isActive =
  process.env.APP_ENDPOINT !== "prod" ||
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "test";

export const featureFlags = [
  { name: "configEditor", isActive: true },
  { name: "createWizard", isActive: true },
  { name: "headerSearch", isActive: true },
  { name: "helpContext", isActive: true },
  { name: "userSettings", isActive: true },
  { name: "importTool", isActive },
  { name: "requirements", isActive },
  { name: "releaseProcess", isActive },
  { name: "analyzer", isActive },
  { name: "diffViewer", isActive },
  { name: "textEditor", isActive },
  { name: "executionMode", isActive },
];

export const isFeatureEnabled = (name: string) => {
  if (!notNilString(name)) {
    return false;
  }

  const foundFlag = featureFlags.find((flag) => {
    return flag.name === name;
  });

  return foundFlag?.isActive || false;
};
