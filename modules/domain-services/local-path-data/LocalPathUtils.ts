import { Domain } from "graphql-api/server-types.gen";
import * as GraphQL from "graphql-api/server-types.gen";

export namespace LocalPathUtils {
  export type LocalPathData = {
    [path: string]: {
      library: GraphQL.VersionedLibrary;
    };
  };

  export const CreateKey = (domain: Domain, testPlanName: string) => {
    return `localPathData:${domain}:${testPlanName}`;
  };

  export const UpdateLocalPathsMap = (
    localPaths: LocalPathData,
    path: string,
    library: GraphQL.VersionedLibrary
  ): LocalPathData => {
    const toBeUpdated = {
      ...localPaths,
      [path]: {
        library,
      },
    };
    return toBeUpdated;
  };
}
