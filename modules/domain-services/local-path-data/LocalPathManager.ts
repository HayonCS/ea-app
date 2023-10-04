import { Domain } from "graphql-api/server-types.gen";
import { LocalPathUtils } from "./LocalPathUtils";
import * as GraphQL from "graphql-api/server-types.gen";
import { getVersionedLibrary } from "domain-services/versioned-libraries/dcigen-xmlparser";
import { getRedisConnection } from "db/redis";

export namespace LocalPathManager {
  export const AllLocalPaths = async (
    domain: Domain,
    testPlanName: string
  ): Promise<LocalPathUtils.LocalPathData | undefined> => {
    const key = LocalPathUtils.CreateKey(domain, testPlanName);
    const redis = getRedisConnection();
    const keyExists = await redis.exists(key);
    if (keyExists && keyExists > 0) {
      const value = await redis.get(key);
      if (value !== null) {
        return JSON.parse(value) as LocalPathUtils.LocalPathData;
      }
    }
    return undefined;
  };

  export const StoreLocalPath = async (
    domain: Domain,
    testPlanName: string,
    localPath: string,
    xmlContents: string
  ): Promise<GraphQL.VersionedLibrary> => {
    const key = LocalPathUtils.CreateKey(domain, testPlanName);
    const result: GraphQL.VersionedLibrary = (await getVersionedLibrary(
      xmlContents,
      {
        versionNumber: "0.0.0",
        platformName: "",
        libraryName: localPath,
      }
    )) as GraphQL.VersionedLibrary;

    if (result !== null && result !== undefined) {
      const allLocalPaths = await AllLocalPaths(domain, testPlanName);
      const newLocalPaths = LocalPathUtils.UpdateLocalPathsMap(
        allLocalPaths ?? {},
        localPath,
        result
      );
      const redis = getRedisConnection();
      await redis.set(key, JSON.stringify(newLocalPaths));
    }

    return result;
  };
}
