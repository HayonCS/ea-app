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
import { RepositoriesPort } from "records";
import { SavedTestPlanRecord } from "records/test-plan";
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
  testPlan: (parent, args, ctx) => {
    return ctx
      .get(RepositoriesPort)
      .domain(args.domain, async (domainRepos) => {
        const testPlanId = await domainRepos.testPlans.findRevision.load({
          testPlanName: args.where.name,
          revisionNumber: args.where.revisionNumber,
        });

        if (!testPlanId) {
          return null;
        }

        const testPlanRecord = await domainRepos.testPlans.find.load({
          TestPlanID: testPlanId,
        });

        if (!testPlanRecord) {
          return null;
        }

        const id = `${args.domain}:${testPlanRecord.Name}:${testPlanRecord.Revision}`;

        //Save a recent test plan for the user found in the context
        const contextUserName = ctx.get(UserNamePort);
        if (
          testPlanRecord.Revision !== undefined &&
          contextUserName &&
          contextUserName !== "unknown" &&
          notNilType(args.where.revisionNumber)
        ) {
          // await ctx
          //   .get(RecentTestPlansPort)
          //   .saveRecentTestPlan(contextUserName, args.where.name, args.domain);
        }

        return {
          ..._.omit(testPlanRecord, "TestPlanID"),
          id,
          domain: args.domain,
        };
      });
  },

  testPlans: (parent, args, ctx) => {
    const mapWithId = (testPlan: SavedTestPlanRecord) => {
      return {
        ...testPlan,
        id: `${args.domain}:${testPlan.Name}:${testPlan.Revision}`,
        domain: args.domain,
      };
    };

    return ctx
      .get(RepositoriesPort)
      .domain(args.domain, async (domainRepos) => {
        if (!args.where || !args.where.name_in) {
          return (
            await domainRepos.testPlans.all({
              orderBy: [
                { column: "Name" },
                { column: "Revision", order: "desc" },
              ],
            })
          ).map(mapWithId);
        }

        return (
          await domainRepos.testPlans.findByName.load({
            name_in: args.where ? args.where.name_in || [] : [],
          })
        ).map(mapWithId);
      });
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

  // jobStatus: async (parent, args, ctx): Promise<{ [uuid: string]: Job }> => {
  //   const result = await Promise.all(
  //     args.jobIdentifiers.map(
  //       async (jobIdentifier): Promise<Job> => {
  //         const jobSpec: JobSpec = (() => {
  //           switch (jobIdentifier.jobType) {
  //             case "SaveTestPlanDocument":
  //               return saveTestPlanDocumentJob;
  //             case "SaveTestPlanConfiguration":
  //               return saveTestPlanConfigurationJob;
  //             case "AnalyzeSavedTestPlan":
  //               return analyzeSavedTestPlanJob;
  //           }
  //         })();

  //         const job = await ctx.jobs.getJob(jobSpec, jobIdentifier.uuid);

  //         if (!job) {
  //           throw new Error(
  //             `Unable to get job status for job ${jobIdentifier.jobType}/${jobIdentifier.uuid}`
  //           );
  //         }

  //         switch (await job.getState()) {
  //           case "completed":
  //             if (!job.data.outcome) {
  //               throw new Error(
  //                 `Unable to get job outcome ${jobIdentifier.jobType}/${jobIdentifier.uuid}`
  //               );
  //             }

  //             return {
  //               jobType: jobIdentifier.jobType,
  //               uuid: jobIdentifier.uuid,
  //               status: "Complete",
  //               outcome: job.data.outcome,
  //             };
  //           case "failed": {
  //             return {
  //               jobType: jobIdentifier.jobType,
  //               uuid: jobIdentifier.uuid,
  //               status: "Failed",
  //               error: job.failedReason || "unknown",
  //             };
  //           }
  //           case "waiting":
  //             return {
  //               jobType: jobIdentifier.jobType,
  //               uuid: jobIdentifier.uuid,
  //               status: "Queued",
  //             };
  //           case "active":
  //             return {
  //               jobType: jobIdentifier.jobType,
  //               uuid: jobIdentifier.uuid,
  //               status: "Active",
  //             };
  //           default:
  //             throw new Error(
  //               `Unable to get job state for job ${jobIdentifier.jobType}/${jobIdentifier.uuid}`
  //             );
  //         }
  //       }
  //     )
  //   );

  //   return result.reduce((acc, job) => {
  //     acc[job.uuid] = job;

  //     return acc;
  //   }, {} as { [uuid: string]: Job });
  // },

  userPicture: async (parent, args, ctx) => {
    const userPicturePath = await ctx
      .get(UserPicturePort)
      .userPicture(args.employeeId || "00000");
    return userPicturePath;
  },

  userTable: async (parent, args, ctx) => {
    const userTablePerDomain = await ctx
      .get(RepositoriesPort)
      .domain(args.domain, async (domainRepos) => {
        const myUserRecord = await domainRepos.users.findByUserName(
          args.username
        );
        return myUserRecord;
      });

    return { ...userTablePerDomain, Domain: args.domain };
  },

  allUsers: async (parent, args, ctx) => {
    const usersPerDomain = await ctx
      .get(RepositoriesPort)
      .domain(args.domain, async (domainRepos) => {
        const userObjects = await domainRepos.users.listAllUsers();
        const userObjectsWithDomain = userObjects.map((userObject) => {
          return { ...userObject, Domain: args.domain.toString() };
        });

        return userObjectsWithDomain;
      });

    return usersPerDomain;
  },

  // recentTestPlans: async (parent, args, ctx) => {
  //   const thePlans: RecentTestPlansResponse = await ctx
  //     .get(RecentTestPlansPort)
  //     .recentTestPlans(args.where.userId);

  //   //Find the info for the most recent test plan revision
  //   const updatedPlans = await Promise.all(
  //     thePlans.recentTestPlans.map(async (plan: any) => {
  //       const foundLatestRevision = await ctx
  //         .get(RepositoriesPort)
  //         .domain(plan.domain, async (domainRepos) => {
  //           return await domainRepos.testPlans.testPlanLatestRevision(
  //             plan.testPlanName.toString()
  //           );
  //         });

  //       if (!notNilType(foundLatestRevision)) {
  //         return undefined;
  //       }

  //       const revInfo = await ctx
  //         .get(RepositoriesPort)
  //         .domain(plan.domain, async (domainRepos) => {
  //           return await domainRepos.testPlans.testPlanRevision(
  //             plan.testPlanName.toString(),
  //             foundLatestRevision
  //           );
  //         });

  //       if (!notNilType(revInfo)) {
  //         return undefined;
  //       }

  //       const lastEditedDateTime = new Date(`${revInfo.LastEdit}`);

  //       const modificationTime = DateTimeIso.isValid(lastEditedDateTime)
  //         ? DateTimeIso.toIsoDateTime(lastEditedDateTime)
  //         : DateTimeIso.dateFromMonthDayYearTime(revInfo.LastEdit);

  //       return {
  //         ...plan,
  //         revision: foundLatestRevision,
  //         lastModifiedDate: modificationTime,
  //         lastModifiedUserName: revInfo.LastEditor,
  //       };
  //     })
  //   );

  //   return {
  //     recentTestPlans: _.compact(updatedPlans),
  //   };
  // },
  // testPlanLockState: (parent, args, ctx) => {
  //   const testPlanLockState = ctx
  //     .get(TestPlanLockoutPort)
  //     .testPlanLockStatus(args.testPlanName, args.domain);
  //   return testPlanLockState;
  // },
  // lockedTestPlans: (parent, args, ctx) => {
  //   const lockedTestPlans = ctx.get(TestPlanLockoutPort).lockedTestPlans();
  //   return lockedTestPlans;
  // },

  testPlanLatestRevision: async (parent, args, ctx) => {
    const testPlanName = args.where.name;
    const result = await ctx
      .get(RepositoriesPort)
      .domain(args.domain, async (domainRepos) => {
        return await domainRepos.testPlans.testPlanLatestRevision(testPlanName);
      });

    return { RevNumber: result };
  },

  testPlanRevisions: async (parent, args, ctx) => {
    const testPlanArgs = args.where ? args.where.name_in || [] : [];
    const revsForDomain = await Promise.all(
      testPlanArgs.map((testPlanName) =>
        ctx.get(RepositoriesPort).domain(args.domain, async (domainRepos) => {
          const revs = await domainRepos.testPlans.testPlanRevisions(
            testPlanName
          );
          return revs;
        })
      )
    );

    return {
      revs: _.flatten(revsForDomain),
    };
  },

  testPlanRevision: async (parent, args, ctx) => {
    const testPlanName = args.where.name;
    const testPlanRev = args.where.revisionNumber ?? 1;
    const result = await ctx
      .get(RepositoriesPort)
      .domain(args.domain, async (domainRepos) => {
        return await domainRepos.testPlans.testPlanRevision(
          testPlanName,
          testPlanRev
        );
      });

    return result;
  },

  testPlanLibrary: async (parent, args, ctx) => {
    const testPlansPerDomain = await ctx
      .get(RepositoriesPort)
      .domain(args.domain, async (domainRepos) => {
        const myLib = await domainRepos.testPlans.testPlanLibrary(
          args.domain,
          args.includeHidden ? args.includeHidden : false
        );
        return myLib;
      });

    const sortedDomainTestPlans = _.sortBy(testPlansPerDomain, [
      "PlanTitle",
      "Version",
    ]);
    return {
      testPlanLib: sortedDomainTestPlans,
    };
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userStationWatcher: async (_parent, args, _ctx) => {
    const key = StationWatcherUtils.UserKey(args.userName);
    const result = await getRedisPubConnection().get(key);
    return result
      ? JSON.parse(result)
      : {
          computerName: "",
        };
  },

  searchForTestPlanByLibrary: async (_parent, args, ctx) => {
    const matches = await ctx
      .get(RepositoriesPort)
      .domain(args.domain, async (domainRepos) => {
        const innerMatches =
          await domainRepos.testPlans.searchForTestPlanByLibrary(
            args.libraryName,
            args.version ?? undefined
          );
        return innerMatches;
      });
    return matches;
  },

  searchForTestPlanByElementDescription: async (_parent, args, ctx) => {
    const matches = await ctx
      .get(RepositoriesPort)
      .domain(args.domain, async (domainRepos) => {
        const innerMatches =
          await domainRepos.testPlans.searchForTestPlanByElementDescription(
            args.description
          );
        return innerMatches;
      });
    return matches;
  },

  searchForTestPlanByTesterType: async (_parent, args, ctx) => {
    const matches = await ctx
      .get(RepositoriesPort)
      .domain(args.domain, async (domainRepos) => {
        const innerMatches =
          await domainRepos.testPlans.searchForTestPlanByTesterType(
            args.testerType,
            args.includeHidden ?? false
          );
        return innerMatches;
      });
    return matches;
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
