import { LocalPathUtils } from "../LocalPathUtils";
import { Domain } from "graphql-api/server-types.gen";
import * as GraphQL from "graphql-api/server-types.gen";

describe("CreateKey", () => {
  it("Can create a production key", () => {
    const key1 = LocalPathUtils.CreateKey(Domain.Production, "000-0000-000");
    expect(key1).toEqual("localPathData:Production:000-0000-000");
  });

  it("Can create an Engineering key", () => {
    const key2 = LocalPathUtils.CreateKey(
      Domain.Engineering,
      "bobs engineering test plan"
    );
    expect(key2).toEqual(
      "localPathData:Engineering:bobs engineering test plan"
    );
  });
});

describe("UpdateLocalPathsMap", () => {
  it("Can return an updated local paths map", () => {
    const original: LocalPathUtils.LocalPathData = {
      ["c:/tester/libary.dll"]: {
        library: {
          enums: [],
          functions: [],
          isCurrentRelease: false,
          platformName: "windows-x32-vc6",
          versionNumber: "1.0.0",
          documentationLink: "documentationLink",
          versionControlUrl: "versionControlUrl",
        },
      },
    };

    const newLibrary: GraphQL.VersionedLibrary = {
      enums: [],
      functions: [],
      isCurrentRelease: false,
      platformName: "windows-x64-vc10",
      versionNumber: "2.0.0",
      documentationLink: "documentationLink2",
      versionControlUrl: "versionControlUrl2",
    };

    const updated: LocalPathUtils.LocalPathData = LocalPathUtils.UpdateLocalPathsMap(
      original,
      "c:/tester/libary2.dll",
      newLibrary
    );

    expect(updated).toEqual({
      "c:/tester/libary.dll": {
        library: {
          documentationLink: "documentationLink",
          enums: [],
          functions: [],
          isCurrentRelease: false,
          platformName: "windows-x32-vc6",
          versionControlUrl: "versionControlUrl",
          versionNumber: "1.0.0",
        },
      },
      "c:/tester/libary2.dll": {
        library: {
          documentationLink: "documentationLink2",
          enums: [],
          functions: [],
          isCurrentRelease: false,
          platformName: "windows-x64-vc10",
          versionControlUrl: "versionControlUrl2",
          versionNumber: "2.0.0",
        },
      },
    });
  });
});
