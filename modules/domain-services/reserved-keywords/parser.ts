export const parseReservedKeywords = async (
  interfaceFileContents: string
): Promise<string[]> => {
  return interfaceFileContents
    .split(/\r?\n/)
    .filter((line) => line.endsWith('"'))
    .map((line) => line.replace(/^.*"(.+)"$/, "$1"))
    .sort();
};
