import { QueryResolvers } from "graphql-api/server-types.gen";
import * as _ from "lodash-es";
import { MesSecurityPort } from "rest-endpoints/mes-security/port";
import { UserPicturePort } from "rest-endpoints/user-picture/port";
import { EmployeeInfoPort } from "rest-endpoints/employee-directory/port";
import { UserAppDataPort } from "domain-services/user-app-data/port";
import { MesProcessDataPort } from "rest-endpoints/mes-process-data/port";
import { ProcessDataRedisPort } from "domain-services/process-data-redis/port";
import { MesBiPort } from "rest-endpoints/mes-bi/port";
import { RepositoriesPort } from "records";
import { SnRow } from "records/processdata";
import { UserInfoPort } from "domain-services/user-information/port";
import { EmployeeInfoRedisPort } from "domain-services/employee-directory-redis/port";
import { MesBomPort } from "rest-endpoints/mes-bom/port";
import { BomRoutingsPort } from "domain-services/bom-routings/port";
import { MesTestHistoryPort } from "rest-endpoints/test-history/port";
import { DcToolsPort } from "rest-endpoints/dctools/port";

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
      .get(EmployeeInfoRedisPort)
      .getEmployeeDirectoryRedis();
    // const directory = await ctx.get(EmployeeInfoPort).employeeDirectory();
    return directory;
  },

  getUserInfo: async (parent, args, ctx) => {
    const user = await ctx
      .get(UserInfoPort)
      .getUserInfo(args.userIdOrUsername, args.includeGroups ?? undefined);
    return user;
  },

  getUsersInfo: async (parent, args, ctx) => {
    const users = await ctx
      .get(UserInfoPort)
      .getUsersInfo(args.userIdsOrUsernames, args.includeGroups ?? undefined);
    return users;
  },

  assetListBi: async (parent, args, ctx) => {
    // const assetList = await ctx.get(MesBiPort).getAssetsAll();
    // return assetList;
    const combos = (await ctx.get(MesBiPort).getAssetsName("C")).filter((x) =>
      x.assetName.startsWith("C")
    );
    const monorails = (await ctx.get(MesBiPort).getAssetsName("MR")).filter(
      (x) => x.assetName.startsWith("MR")
    );
    const presses = (await ctx.get(MesBiPort).getAssetsName("PCB")).filter(
      (x) => x.assetName.startsWith("PCB")
    );
    const other = (await ctx.get(MesBiPort).getAssetsName("I")).filter((x) =>
      x.assetName.startsWith("I")
    );
    let assets = [...combos, ...monorails, ...presses, ...other];
    assets = assets.sort((a, b) => a.assetName.localeCompare(b.assetName));
    return assets;
  },

  getAssetsName: async (parent, args, ctx) => {
    const assets = await ctx.get(MesBiPort).getAssetsName(args.nameOrKeyword);
    return assets;
  },

  getAssetByName: async (parent, args, ctx) => {
    const asset = await ctx.get(MesBiPort).getAssetByName(args.assetName);
    return asset;
  },

  cycleTimesLineOperationPart: async (parent, args, ctx) => {
    const cycleTimes = await ctx
      .get(MesBiPort)
      .getCycleTimesLineOperationPart();
    return cycleTimes;
  },

  getLineConfiguration: async (parent, args, ctx) => {
    const config = await ctx
      .get(MesBiPort)
      .getLineConfiguration(args.lineName, args.orgCode);
    return config;
  },

  getLineConfigurationsAll: async (parent, args, ctx) => {
    const configs = await ctx.get(MesBiPort).getLineConfigurationsAll();
    return configs;
  },

  getBomRouting: async (parent, args, ctx) => {
    const bomRouting = await ctx
      .get(MesBomPort)
      .getBomRouting(args.orgCode, args.partNumber);
    return bomRouting;
  },

  getBomRoutings: async (parent, args, ctx) => {
    const routings = await ctx
      .get(MesBomPort)
      .getBomRoutings(args.orgCode, args.partNumbers);
    return routings;
  },

  getAllBomRoutings: async (parent, args, ctx) => {
    const routings = await ctx.get(BomRoutingsPort).getBomRoutings();
    return routings;
  },

  getProcessDataExport: async (parent, args, ctx) => {
    const processData = await ctx
      .get(MesProcessDataPort)
      .getProcessDataExport(args.asset, args.startDate, args.endDate);

    return processData;
  },

  getTestHistoriesById: async (parent, args, ctx) => {
    const testHistories = await ctx
      .get(MesTestHistoryPort)
      .getTestHistoriesById(args.identifierCode);
    return testHistories;
  },

  getTestHistoryById: async (parent, args, ctx) => {
    const test = await ctx
      .get(MesTestHistoryPort)
      .getTestHistoryById(args.identifierCode, args.operation);
    return test;
  },

  getTestHistoryByMetadata: async (parent, args, ctx) => {
    const test = await ctx
      .get(MesTestHistoryPort)
      .getTestHistoryByMetadata(args.metaDataId);
    return test;
  },

  getResultFileByMetadata: async (parent, args, ctx) => {
    const result = await ctx
      .get(DcToolsPort)
      .getResultFileByMetadata(args.metaDataId);
    return result;
  },

  getFailedTagsByMetadata: async (parent, args, ctx) => {
    const tags = await ctx
      .get(DcToolsPort)
      .getFailedTagsByMetadata(args.metaDataId);
    return tags;
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

  comboPartData: async (parent, args, ctx) => {
    let partData = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const rows = await domCtx.combodata.pn.getRows();
        return rows;
      });
    partData = partData.filter(
      (x) =>
        !x.PartNumber.includes("I") &&
        !x.PartNumber.includes("E") &&
        !x.PartNumber.includes("U") &&
        !x.PartNumber.includes("A") &&
        !x.PartNumber.includes("L") &&
        !x.PartNumber.includes("0000")
    );
    return partData;
  },

  comboAssetData: async (parent, args, ctx) => {
    let assetData = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const rows = await domCtx.combodata.asset.getRows();
        return rows;
      });
    // assetData = assetData.filter(
    //   (x) => x.Asset.startsWith("CMB") || x.Asset.startsWith("MR")
    // );
    return assetData;
  },

  processPartData: async (parent, args, ctx) => {
    let partData = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const rows = await domCtx.processdata.pn.getRows();
        return rows;
      });
    partData = partData.filter(
      (x) =>
        !x.PartNumber.includes("I") &&
        !x.PartNumber.includes("E") &&
        !x.PartNumber.includes("U") &&
        !x.PartNumber.includes("A") &&
        !x.PartNumber.includes("L")
    );
    return partData;
  },

  processAssetData: async (parent, args, ctx) => {
    let assetData = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const rows = await domCtx.processdata.asset.getRows();
        return rows;
      });
    assetData = assetData.filter((x) => x.Asset.startsWith("PCB"));
    return assetData;
  },

  comboRowsDateRange: async (parent, args, ctx) => {
    let testRows = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const rows = await domCtx.combodata.sn.getRowsDateRange(
          args.start,
          args.end,
          args.assetIds ?? undefined,
          args.partIds ?? undefined,
          args.operatorIds ?? undefined
        );
        return rows;
      });
    testRows = testRows.sort((a, b) => a.AssetID - b.AssetID);
    return testRows;
  },

  comboPerformanceRowsDateRange: async (parent, args, ctx) => {
    let result = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const rows = await domCtx.combodata.sn.getPerformanceRowsDateRange(
          args.start,
          args.end,
          args.assetIds ?? undefined,
          args.partIds ?? undefined,
          args.operatorIds ?? undefined
        );
        return rows;
      });
    return result;
  },

  comboRowByMetaData: async (parent, args, ctx) => {
    const result = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        return await domCtx.combodata.sn.getRowByMetaData(args.metaDataId);
      });
    return result;
  },

  processRowsDateRange: async (parent, args, ctx) => {
    let testRows = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const rows = await domCtx.processdata.sn.getRowsDateRange(
          args.start,
          args.end,
          args.assetIds ?? undefined,
          args.partIds ?? undefined,
          args.operatorIds ?? undefined
        );
        return rows;
      });
    testRows = testRows.sort((a, b) => a.AssetID - b.AssetID);
    return testRows;
  },

  processPerformanceRowsDateRange: async (parent, args, ctx) => {
    let result = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const rows = await domCtx.processdata.sn.getPerformanceRowsDateRange(
          args.start,
          args.end,
          args.assetIds ?? undefined,
          args.partIds ?? undefined,
          args.operatorIds ?? undefined
        );
        return rows;
      });
    return result;
  },

  processRowByMetaData: async (parent, args, ctx) => {
    const result = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        return await domCtx.processdata.sn.getRowByMetaData(args.metaDataId);
      });
    return result;
  },
};

export default queryResolvers;
