import { Domain } from "graphql-api/server-types.gen";
import { LocalPathManager } from "../LocalPathManager";

describe("LocalPathManager", () => {
  it("Can store a local path", async () => {
    const result = await LocalPathManager.StoreLocalPath(
      Domain.Production,
      "700-1234-000",
      "c:/tester/local.dll",
      "<xml></xml>"
    );
    expect(result).toEqual({
      documentationLink: undefined,
      enums: [],
      functions: [],
      isCurrentRelease: false,
      libraryName: "c:/tester/local.dll",
      platformName: "",
      versionControlUrl: undefined,
      versionNumber: "0.0.0",
    });
  });

  it("Can store another local path", async () => {
    const result = await LocalPathManager.StoreLocalPath(
      Domain.Production,
      "700-1234-000",
      "c:/tester/local2.dll",
      "<xml>another one</xml>"
    );
    expect(result).toEqual({
      documentationLink: undefined,
      enums: [],
      functions: [],
      isCurrentRelease: false,
      libraryName: "c:/tester/local2.dll",
      platformName: "",
      versionControlUrl: undefined,
      versionNumber: "0.0.0",
    });
  });

  it("Can returned all stored local paths", async () => {
    const allLocalPaths = await LocalPathManager.AllLocalPaths(
      Domain.Production,
      "700-1234-000"
    );

    expect(allLocalPaths).toEqual({
      "c:/tester/local.dll": {
        library: {
          enums: [],
          functions: [],
          isCurrentRelease: false,
          libraryName: "c:/tester/local.dll",
          platformName: "",
          versionNumber: "0.0.0",
        },
      },
      "c:/tester/local2.dll": {
        library: {
          enums: [],
          functions: [],
          isCurrentRelease: false,
          libraryName: "c:/tester/local2.dll",
          platformName: "",
          versionNumber: "0.0.0",
        },
      },
    });
  });
});
