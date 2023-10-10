import { getRedisPubConnection } from "db/redis";
import { StationWatcherHandlers } from "domain-services/execution-stationwatcher/StationWatcherHandlers";
import { StationWatcherUtils } from "domain-services/execution-stationwatcher/StationWatcherUtils";
import { TestStationHandlers } from "domain-services/execution-teststation/TestStationHandlers";
import * as GraphQL from "graphql-api/server-types.gen";
import {
  Domain,
  Library,
  StationWatcherMessage,
  StationWatcherUser,
  TestStationMessage,
} from "graphql-api/server-types.gen";
import { TestPlanConfiguration } from "core/schemas/test-plan-configuration.gen";
import { TestPlanDocument } from "core/schemas/test-plan-document.gen";
import { notNilString, notNilType } from "helpers/nil-helpers";
import { LocalPathManager } from "domain-services/local-path-data/LocalPathManager";
import { UserAppDataPort } from "domain-services/user-app-data/port";

export const isConfigValid = (config: TestPlanConfiguration) => {
  const isDefined = notNilType(config);
  if (!isDefined) {
    return false;
  }

  const isNotEmpty = Object.keys(config.values).length !== 0;
  const validRevisionNumber =
    notNilType(config.revisionNumber) && config.revisionNumber > 0;
  const hasDataFields =
    notNilType(config.values) &&
    notNilType(config.ecoNames) &&
    notNilType(config.globalNames) &&
    notNilType(config.limitNames) &&
    notNilType(config.localNames);

  return isDefined && isNotEmpty && validRevisionNumber && hasDataFields;
};

export const isDocumentValid = (name: string, document: TestPlanDocument) => {
  const isDefined = notNilType(document);
  if (!isDefined) {
    return false;
  }

  const isNotEmpty =
    Object.keys(document.elements).length !== 0 &&
    Object.keys(document.structure).length !== 0;
  const validName = notNilString(document.name) && document.name === name;
  const hasRootIdentifier = notNilString(document.rootElementIdentifier);
  const hasDataFields =
    notNilType(document.elements) && notNilType(document.structure);

  return (
    isDefined && isNotEmpty && validName && hasRootIdentifier && hasDataFields
  );
};

const ValidateString = (value: any, fieldName: string): string => {
  if (typeof value === "string") {
    const stringValue = value as string;
    if (stringValue === "") {
      throw new Error(`Field ${fieldName} received empty string.`);
    } else {
      return stringValue;
    }
  }
  throw new Error(`Field ${fieldName} received non-string value.`);
};

const mutationResolvers: GraphQL.MutationResolvers = {
  setUserAppData: async (parent, args, ctx): Promise<boolean> => {
    const result = await ctx
      .get(UserAppDataPort)
      .setUserAppData(args.userId, args.appData);

    return result;
  },

  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  setStationWatcherUser: async (
    parent: any,
    args: any
  ): Promise<StationWatcherUser> => {
    const key = StationWatcherUtils.UserKey(args.userName);
    const stationWatcherUser: StationWatcherUser = {
      computerName: args.computerName,
    };
    await getRedisPubConnection().set(key, JSON.stringify(stationWatcherUser));
    return Promise.resolve(stationWatcherUser);
  },

  updateStationWatcher: async (
    parent: any,
    args: any,
    ctx
  ): Promise<StationWatcherMessage> => {
    parent;
    ctx;
    return Promise.resolve(
      await StationWatcherHandlers.HandleUpdate(
        args.message as StationWatcherMessage | undefined
      )
    );
  },

  updateTestStation: async (
    _parent: any,
    args: any
  ): Promise<TestStationMessage> => {
    return Promise.resolve(
      await TestStationHandlers.HandleUpdate(
        args.message as TestStationMessage | undefined
      )
    );
  },

  postLocalPath: async (
    _parent: any,
    args: any
  ): Promise<{
    library: Array<Library>;
  }> => {
    const domain: Domain = args.domain as Domain;
    const testPlanName: string = ValidateString(
      args.testPlanName,
      "testPlanName"
    );
    const localPath: string = ValidateString(args.localPath, "localPath");
    const xmlContents = ValidateString(args.xmlContents, "xmlContents");
    const result = await LocalPathManager.StoreLocalPath(
      domain,
      testPlanName,
      localPath,
      xmlContents
    );

    return {
      library: [
        {
          libraryName: args.localPath,
          versions: [result],
        },
      ],
    };
  },

  invalidateVersionedLibraries: async (
    _parent: any,
    _args: any,
    ctx
  ): Promise<string> => {
    return ctx.versionedLibraries.reset();
  },
};

export default mutationResolvers;
