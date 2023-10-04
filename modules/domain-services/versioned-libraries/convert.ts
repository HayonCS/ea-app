import * as Domain from "domain-services/versioned-libraries/versioned-library";
import * as GraphQL from "graphql-api/server-types.gen";

import { Isomorphism } from "@atomic-object/lenses";

export const graphqlDirection: Isomorphism<
  Domain.LibraryFunctionParamDirection,
  GraphQL.LibraryFunctionParamDirection
> = {
  to: (domainDirection) => {
    switch (domainDirection) {
      case "IN":
        return GraphQL.LibraryFunctionParamDirection.In;
      case "OUT":
        return GraphQL.LibraryFunctionParamDirection.Out;
      case "RETURN":
      default:
        return GraphQL.LibraryFunctionParamDirection.Return;
    }
  },
  from: (graphqlDirection) => {
    switch (graphqlDirection) {
      case "IN":
        return "IN";
      case "OUT":
        return "OUT";
      case "RETURN":
      default:
        return "RETURN";
    }
  },
};

export const graphqlLibrary: Isomorphism<Domain.Library, GraphQL.Library> = {
  to: (domainLib) => ({
    ...domainLib,
    versions: (domainLib.versions || []).map((version) => {
      return {
        ...version,
        functions: (version.functions || []).map((fn) => {
          return {
            ...fn,
            params: (fn.params || []).map((param) => {
              return {
                ...param,
                direction: graphqlDirection.to(param.direction),
              };
            }),
          };
        }),
      };
    }),
  }),
  from: (graphqlLib) => ({
    ...graphqlLib,
    versions: (graphqlLib.versions || []).map((version) => {
      return {
        ...version,
        libraryName: graphqlLib.libraryName,
        documentationLink: version.documentationLink || "",
        versionControlUrl: version.versionControlUrl || "",
        functions: (version.functions || []).map((fn) => {
          return {
            ...fn,
            className: fn.className || "GLOBALS",
            classDescription: fn.classDescription || "",
            params: (fn.params || []).map((param) => {
              return {
                ...param,
                direction: graphqlDirection.from(param.direction),
              };
            }),
          };
        }),
      };
    }),
  }),
};
