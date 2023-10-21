import { QueryResolvers } from "graphql-api/server-types.gen";
import * as _ from "lodash-es";
import { MesSecurityPort } from "rest-endpoints/mes-security/port";
import { UserPicturePort } from "rest-endpoints/user-picture/port";
import { EmployeeInfoPort } from "rest-endpoints/employee-directory/port";
import { AssetsBiPort } from "domain-services/assets-bi/port";
import { UserAppDataPort } from "domain-services/user-app-data/port";
import { EmployeeDirectoryRedisPort } from "domain-services/employee-directory-redis/port";
import { MesProcessDataPort } from "rest-endpoints/mes-process-data/port";
import { ProcessDataRedisPort } from "domain-services/process-data-redis/port";
import { MesBiPort } from "rest-endpoints/mes-bi/port";
import { RepositoriesPort } from "records";

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

  userPicture: async (parent, args, ctx) => {
    const userPicturePath = await ctx
      .get(UserPicturePort)
      .userPicture(args.employeeId || "00000");
    return userPicturePath;
  },

  partDataWebdc: async (parent, args, ctx) => {
    const partData = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const rows = await domCtx.combodata.pn.getRows();
        return rows;
      });
    return partData;
  },

  assetDataWebdc: async (parent, args, ctx) => {
    const partData = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const rows = await domCtx.combodata.asset.getRows();
        return rows;
      });
    return partData;
  },

  testRowsDateRange: async (parent, args, ctx) => {
    const testRows = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const start = new Date(args.start);
        const end = new Date(args.end);
        const rows = await domCtx.combodata.sn.getRowsDateRange(start, end);
        return rows;
      });
    return testRows;
  },

  testRowsByPartDateRange: async (parent, args, ctx) => {
    const testRows = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const start = new Date(args.start);
        const end = new Date(args.end);
        const rows = await domCtx.combodata.sn.getRowsByPartDateRange(
          args.partId,
          start,
          end
        );
        return rows;
      });
    return testRows;
  },

  testRowsByAssetDateRange: async (parent, args, ctx) => {
    const testRows = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const start = new Date(args.start);
        const end = new Date(args.end);
        const rows = await domCtx.combodata.sn.getRowsByAssetDateRange(
          args.assetId,
          start,
          end
        );
        return rows;
      });
    return testRows;
  },

  testRowsByAssetPartDateRange: async (parent, args, ctx) => {
    const testRows = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const start = new Date(args.start);
        const end = new Date(args.end);
        const rows = await domCtx.combodata.sn.getRowsByAssetPartDateRange(
          args.assetId,
          args.partId,
          start,
          end
        );
        return rows;
      });
    return testRows;
  },
};

export default queryResolvers;
