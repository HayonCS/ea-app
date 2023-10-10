// import { JobSpec } from "atomic-object/jobs";
import { UserNamePort } from "context/ports";
// import { Job } from "core/schemas/jobs";
import { ReservedKeywordsPort } from "domain-services/reserved-keywords/port";
import { StationWatcherManager } from "domain-services/execution-stationwatcher/StationWatcherManager";
import { StationWatcherUtils } from "domain-services/execution-stationwatcher/StationWatcherUtils";
import { graphqlLibrary } from "domain-services/versioned-libraries/convert";
import {
  HelpInfo,
  LocalPathInformation,
  QueryResolvers,
  StationWatcherMessage,
} from "graphql-api/server-types.gen";
import { excludeNils } from "helpers/nil-helpers";
import * as _ from "lodash-es";
import { MesSecurityPort } from "rest-endpoints/mes-security/port";
import { UserPicturePort } from "rest-endpoints/user-picture/port";
import { getRedisPubConnection } from "db/redis";
import { EmployeeInfoPort } from "rest-endpoints/employee-directory/port";
// import * as DateTimeIso from "core/date-time-iso";
import { notNilType } from "helpers/nil-helpers";
import { LocalPathUtils } from "domain-services/local-path-data/LocalPathUtils";
import { LocalPathManager } from "domain-services/local-path-data/LocalPathManager";
import { AssetsBiPort } from "domain-services/assets-bi/port";
import { UserAppDataPort } from "domain-services/user-app-data/port";
import { EmployeeDirectoryRedisPort } from "domain-services/employee-directory-redis/port";
import { MesProcessDataPort } from "rest-endpoints/mes-process-data/port";
import { ProcessDataRedisPort } from "domain-services/process-data-redis/port";
import { MesBiPort } from "rest-endpoints/mes-bi/port";
// import { UserSettings } from "core/schemas/user-settings.gen";

const queryResolvers: QueryResolvers = {
  mesUserInfo: async (parent, args, ctx) => {
    const userInfo = await ctx
      .get(MesSecurityPort)
      .mesUserInfo(args.employeeNumberOrUsername, args.includeGroups ?? false);

    return userInfo;
  },

  employeeInfo: async (parent, args, ctx) => {
    const employeeInfo = await ctx
      .get(EmployeeInfoPort)
      .employeeInfo(args.employeeNumberOrEmail);

    return employeeInfo;
  },

  employeeDirectory: async (parent, args, ctx) => {
    // const directory = await ctx.get(EmployeeInfoPort).employeeDirectory();
    // return directory;
    const directory = await ctx
      .get(EmployeeDirectoryRedisPort)
      .getEmployeeDirectory();
    return directory;
  },

  assetListBi: async (parent, args, ctx) => {
    const assetList = await ctx.get(AssetsBiPort).getAssetList();
    return assetList;
  },

  getAssetsName: async (parent, args, ctx) => {
    const assets = await ctx.get(MesBiPort).getAssetsName(args.nameOrKeyword);
    return assets;
  },

  getAssetByName: async (parent, args, ctx) => {
    const asset = await ctx.get(MesBiPort).getAssetByName(args.assetName);
    return asset;
  },

  getProcessDataExport: async (parent, args, ctx) => {
    const processData = await ctx
      .get(MesProcessDataPort)
      .getProcessDataExport(args.asset, args.startDate, args.endDate);

    return processData;
  },

  getProcessDataRedis: async (parent, args, ctx) => {
    const data = await ctx
      .get(ProcessDataRedisPort)
      .getProcessDataRedis(args.asset, args.date);

    return data;
  },

  getAssetsRunningNow: async (parent, args, ctx) => {
    const assets = await ctx.get(MesProcessDataPort).getAssetsRunningNow();
    return assets;
  },

  getUserAppData: async (parent, args, ctx) => {
    const appData = await ctx.get(UserAppDataPort).getUserAppData(args.userId);
    return appData;
  },

  serverInfo: () => {
    return {
      endpoint: process.env.APP_ENDPOINT,
      authType: process.env.AUTH_LOCAL === "true" ? "local" : "oauth",
      prodDatabaseServer: process.env.PROD_DATABASE_SERVER,
      prodDatabaseName: process.env.PROD_DATABASE_NAME,
      engDatabaseServer: process.env.ENG_DATABASE_SERVER,
      engDatabaseName: process.env.ENG_DATABASE_NAME,
      configLocation: `${process.env.SVN_URL}/${process.env.SVN_REPO}`,
      dcigenLocation: `${process.env.SMB_SHARE}/${process.env.SMB_VERSIONED_LIBRARY_BASEPATH}`,
      userValidationAPI: process.env.MES_SECURITY_ENDPOINT,
      userPictureAPI: process.env.MES_USER_PICTURE,
      userInfoAPI: process.env.MES_EMPLOYEE_DIRECTORY,
    };
  },

  reservedKeywords: async (parent, args, ctx) => {
    return {
      keywords: await ctx.get(ReservedKeywordsPort).find.load({}),
    };
  },

  library: async (parent, args, ctx) => {
    const lib = await ctx.versionedLibraries.find.load(args.where);
    if (!lib) {
      return;
    }

    return graphqlLibrary.to(lib);
  },

  libraries: async (parent, args, ctx) => {
    const libs = await ctx.versionedLibraries.findAll.load(args.where || {});

    return excludeNils(libs).map(graphqlLibrary.to);
  },

  userPicture: async (parent, args, ctx) => {
    const userPicturePath = await ctx
      .get(UserPicturePort)
      .userPicture(args.employeeId || "00000");
    return userPicturePath;
  },

  stationWatchers: async (): Promise<StationWatcherMessage[]> => {
    return StationWatcherManager.QueryAllStationWatchers();
  },

  // getUserSettings: async (_parent, args, ctx): Promise<UserSettings> => {
  //   const result = await ctx.get(UserSettingsPort).getUserSettings(args.where);

  //   return result;
  // },

  localPaths: async (_parent, args): Promise<Array<LocalPathInformation>> => {
    const localPaths: LocalPathUtils.LocalPathData | undefined =
      await LocalPathManager.AllLocalPaths(args.domain, args.testPlanName);
    if (localPaths === undefined) {
      return [
        {
          library: [],
        },
      ];
    }

    const files = Object.keys(localPaths);
    return files.map((currentFile): LocalPathInformation => {
      return {
        library: [
          {
            libraryName: currentFile,
            versions: [localPaths[currentFile].library],
          },
        ],
      };
    });
  },
};

export default queryResolvers;
