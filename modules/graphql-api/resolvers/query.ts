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
    // const directory = await ctx
    //   .get(EmployeeDirectoryRedisPort)
    //   .getEmployeeDirectory();
    const directory = await ctx.get(EmployeeInfoPort).employeeDirectory();
    return directory;
  },

  assetListBi: async (parent, args, ctx) => {
    // const assetList = await ctx.get(MesBiPort).getAssetsAll();
    // return assetList;
    const combos = (await ctx.get(MesBiPort).getAssetsName("CMB")).filter((x) =>
      x.assetName.startsWith("CMB")
    );
    const monorails = (await ctx.get(MesBiPort).getAssetsName("MR")).filter(
      (x) => x.assetName.startsWith("MR")
    );
    const presses = (await ctx.get(MesBiPort).getAssetsName("PCB")).filter(
      (x) => x.assetName.startsWith("PCB")
    );
    let assets = [...combos, ...monorails, ...presses];
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
        const start = new Date(args.start);
        const end = new Date(args.end);
        const rows = await domCtx.combodata.sn.getRowsDateRange(
          start,
          end,
          args.assetIds ?? undefined,
          args.partIds ?? undefined,
          args.operatorIds ?? undefined
        );
        return rows;
      });
    testRows = testRows.sort((a, b) => a.AssetID - b.AssetID);
    // partData = partData.filter(
    //   (x) =>
    //     !x.PartNumber.includes("I") &&
    //     !x.PartNumber.includes("E") &&
    //     !x.PartNumber.includes("U") &&
    //     !x.PartNumber.includes("A") &&
    //     !x.PartNumber.includes("L") &&
    //     !x.PartNumber.includes("0000")
    // );
    return testRows;
    // const testRows = await ctx
    //   .get(RepositoriesPort)
    //   .domain("WebDC", async (domCtx) => {
    //     const start = new Date(args.start);
    //     const end = new Date(args.end);
    //     let assetList = await domCtx.combodata.asset.getRows();
    //     assetList = assetList.filter(
    //       (x) => x.Asset.startsWith("CMB") || x.Asset.startsWith("MR")
    //     );
    //     let totalRows: SnRow[] = [];
    //     for (const asset of assetList) {
    //       const rows = await domCtx.combodata.sn.getRowsByAssetDateRange(
    //         asset.AssetID,
    //         start,
    //         end
    //       );
    //       totalRows = totalRows.concat(rows);
    //     }
    //     return totalRows;
    //   });
    // return testRows;
  },

  comboRowsByAssetDateRange: async (parent, args, ctx) => {
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

  comboRowsByAssetsDateRange: async (parent, args, ctx) => {
    const testRows = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const start = new Date(args.start);
        const end = new Date(args.end);
        const rows = await domCtx.combodata.sn.getRowsByAssetsDateRange(
          args.assetIds,
          start,
          end
        );
        return rows;
      });
    return testRows;
  },

  comboRowsByPartDateRange: async (parent, args, ctx) => {
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

  comboRowsByOperatorDateRange: async (parent, args, ctx) => {
    const testRows = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const start = new Date(args.start);
        const end = new Date(args.end);
        const rows = await domCtx.combodata.sn.getRowsByOperatorDateRange(
          args.operatorId,
          start,
          end
        );
        return rows;
      });
    return testRows;
  },

  comboRowsByOperatorsDateRange: async (parent, args, ctx) => {
    const testRows = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const start = new Date(args.start);
        const end = new Date(args.end);
        const rows = await domCtx.combodata.sn.getRowsByOperatorsDateRange(
          args.operatorIds,
          start,
          end
        );
        return rows;
      });
    return testRows;
  },

  comboRowsByAssetPartDateRange: async (parent, args, ctx) => {
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

  comboRowsByAssetOperatorDateRange: async (parent, args, ctx) => {
    const testRows = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const start = new Date(args.start);
        const end = new Date(args.end);
        const rows = await domCtx.combodata.sn.getRowsByAssetOperatorDateRange(
          args.assetId,
          args.operatorId,
          start,
          end
        );
        return rows;
      });
    return testRows;
  },

  comboRowsByPartOperatorDateRange: async (parent, args, ctx) => {
    const testRows = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const start = new Date(args.start);
        const end = new Date(args.end);
        const rows = await domCtx.combodata.sn.getRowsByPartOperatorDateRange(
          args.partId,
          args.operatorId,
          start,
          end
        );
        return rows;
      });
    return testRows;
  },

  comboRowsByAssetPartOperatorDateRange: async (parent, args, ctx) => {
    const testRows = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const start = new Date(args.start);
        const end = new Date(args.end);
        const rows =
          await domCtx.combodata.sn.getRowsByAssetPartOperatorDateRange(
            args.assetId,
            args.partId,
            args.operatorId,
            start,
            end
          );
        return rows;
      });
    return testRows;
  },

  processRowsDateRange: async (parent, args, ctx) => {
    const testRows = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const start = new Date(args.start);
        const end = new Date(args.end);
        const rows = await domCtx.processdata.sn.getRowsDateRange(start, end);
        return rows;
      });
    return testRows;
  },

  processRowsByAssetDateRange: async (parent, args, ctx) => {
    const testRows = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const start = new Date(args.start);
        const end = new Date(args.end);
        const rows = await domCtx.processdata.sn.getRowsByAssetDateRange(
          args.assetId,
          start,
          end
        );
        return rows;
      });
    return testRows;
  },

  processRowsByPartDateRange: async (parent, args, ctx) => {
    const testRows = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const start = new Date(args.start);
        const end = new Date(args.end);
        const rows = await domCtx.processdata.sn.getRowsByPartDateRange(
          args.partId,
          start,
          end
        );
        return rows;
      });
    return testRows;
  },

  processRowsByOperatorDateRange: async (parent, args, ctx) => {
    const testRows = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const start = new Date(args.start);
        const end = new Date(args.end);
        const rows = await domCtx.processdata.sn.getRowsByOperatorDateRange(
          args.operatorId,
          start,
          end
        );
        return rows;
      });
    return testRows;
  },

  processRowsByAssetPartDateRange: async (parent, args, ctx) => {
    const testRows = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const start = new Date(args.start);
        const end = new Date(args.end);
        const rows = await domCtx.processdata.sn.getRowsByAssetPartDateRange(
          args.assetId,
          args.partId,
          start,
          end
        );
        return rows;
      });
    return testRows;
  },

  processRowsByAssetOperatorDateRange: async (parent, args, ctx) => {
    const testRows = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const start = new Date(args.start);
        const end = new Date(args.end);
        const rows =
          await domCtx.processdata.sn.getRowsByAssetOperatorDateRange(
            args.assetId,
            args.operatorId,
            start,
            end
          );
        return rows;
      });
    return testRows;
  },

  processRowsByPartOperatorDateRange: async (parent, args, ctx) => {
    const testRows = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const start = new Date(args.start);
        const end = new Date(args.end);
        const rows = await domCtx.processdata.sn.getRowsByPartOperatorDateRange(
          args.partId,
          args.operatorId,
          start,
          end
        );
        return rows;
      });
    return testRows;
  },

  processRowsByAssetPartOperatorDateRange: async (parent, args, ctx) => {
    const testRows = await ctx
      .get(RepositoriesPort)
      .domain("WebDC", async (domCtx) => {
        const start = new Date(args.start);
        const end = new Date(args.end);
        const rows =
          await domCtx.processdata.sn.getRowsByAssetPartOperatorDateRange(
            args.assetId,
            args.partId,
            args.operatorId,
            start,
            end
          );
        return rows;
      });
    return testRows;
  },
};

export default queryResolvers;
