// import { JobRunnerPort } from "atomic-object/jobs/ports";
// import { Job } from "core/schemas/jobs";
import { getRedisPubConnection } from "db/redis";
import { StationWatcherHandlers } from "domain-services/execution-stationwatcher/StationWatcherHandlers";
import { StationWatcherUtils } from "domain-services/execution-stationwatcher/StationWatcherUtils";
import { TestStationHandlers } from "domain-services/execution-teststation/TestStationHandlers";
import * as GraphQL from "graphql-api/server-types.gen";
import {
  // AnalyzerResult,
  Domain,
  Library,
  StationWatcherMessage,
  StationWatcherUser,
  TestStationMessage,
} from "graphql-api/server-types.gen";
import { RepositoriesPort } from "records";
import { TestPlanConfiguration } from "core/schemas/test-plan-configuration.gen";
import { TestPlanDocument } from "core/schemas/test-plan-document.gen";
import { notNilString, notNilType } from "helpers/nil-helpers";
// import { TestPlanCreationResponse } from "records/test-plan";
// import { now } from "core/date-time-iso";
// import { StandardJob } from "atomic-object/jobs";
// import {
//   getProdDomainNameValidator,
//   getEngDomainNameValidator,
// } from "client/components/editor/editor-helpers";
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
    console.log(args.appData);
    const result = await ctx
      .get(UserAppDataPort)
      .setUserAppData(args.userId, args.appData);

    return result;
  },

  // saveTestPlanDocument: async (parent, args, ctx): Promise<Job> => {
  //   await ctx.get(JobRunnerPort).enqueue(saveTestPlanDocumentJob, {
  //     data: {
  //       domain: args.domain,
  //       document: args.document,
  //       metadata: args.metadata,
  //     },
  //     extraBullOpts: {
  //       jobId: args.jobUuid,
  //     },
  //   });

  //   return {
  //     jobType: "SaveTestPlanDocument",
  //     status: "Queued",
  //     uuid: args.jobUuid,
  //     metaData: args.metadata,
  //   };
  // },
  // saveTestPlanConfiguration: async (parent, args, ctx): Promise<Job> => {
  //   await ctx.get(JobRunnerPort).enqueue(saveTestPlanConfigurationJob, {
  //     data: {
  //       testerType: args.testerType,
  //       testPlanName: args.testPlanName,
  //       document: args.document,
  //       configuration: args.configuration,
  //       userName: args.userName,
  //       commitMessage: args.commitMessage,
  //     },
  //     extraBullOpts: {
  //       jobId: args.jobUuid,
  //     },
  //   });

  //   return {
  //     jobType: "SaveTestPlanConfiguration",
  //     status: "Queued",
  //     uuid: args.jobUuid,
  //     configMetaData: {
  //       testerType: args.testerType,
  //       testPlanName: args.testPlanName,
  //       revisionNumber: args.configuration.revisionNumber,
  //       configIsValid: isConfigValid(args.configuration),
  //       documentIsValid: isDocumentValid(args.testPlanName, args.document),
  //       userName: args.userName,
  //       commitMessage: args.commitMessage,
  //     },
  //   };
  // },

  // createTestPlan: async (
  //   parent,
  //   args,
  //   ctx
  // ): Promise<TestPlanCreationResponse> => {
  //   // if (args.domain === Domain.Production) {
  //   //   const prodNameRegex = getProdDomainNameValidator();
  //   //   if (!prodNameRegex.test(args.testPlanName)) {
  //   //     return {
  //   //       ReturnCode: -1,
  //   //       TestPlanID: -1,
  //   //       Message: `The test plan name "${args.testPlanName}" does not fit the constraints of the production database.`,
  //   //     };
  //   //   }
  //   // } else if (args.domain === Domain.Engineering) {
  //   //   const engNameRegex = getEngDomainNameValidator();
  //   //   if (!engNameRegex.test(args.testPlanName)) {
  //   //     return {
  //   //       ReturnCode: -1,
  //   //       TestPlanID: -1,
  //   //       Message: `The test plan name "${args.testPlanName}" does not fit the constraints of the engineering database.`,
  //   //     };
  //   //   }
  //   // } else {
  //   //   return {
  //   //     ReturnCode: -1,
  //   //     TestPlanID: -1,
  //   //     Message: `Invalid domain specified: ${args.domain}`,
  //   //   };
  //   // }

  //   //Make sure the test plan name doesn't already exist.
  //   const foundTestPlans = await ctx
  //     .get(RepositoriesPort)
  //     .domain(args.domain, (domainRepos) => {
  //       return domainRepos.testPlans.findByName.load({
  //         name_in: [args.testPlanName],
  //       });
  //     });

  //   const testPlanNames = foundTestPlans.map((testPlanRecord) => {
  //     if (notNilType(testPlanRecord)) {
  //       return testPlanRecord.Name;
  //     }
  //   });

  //   if (testPlanNames && testPlanNames.length > 0) {
  //     if (notNilString(testPlanNames[0])) {
  //       return {
  //         ReturnCode: -1,
  //         TestPlanID: -1,
  //         Message: `A test plan with the name "${args.testPlanName}" already exists.`,
  //       };
  //     }
  //   }

  //   //Make sure the user exists
  //   const userRecord = await ctx
  //     .get(RepositoriesPort)
  //     .domain(args.domain, (domainRepos) =>
  //       domainRepos.users.findByUserName(args.userName)
  //     );

  //   if (!notNilType(userRecord)) {
  //     return {
  //       ReturnCode: -1,
  //       TestPlanID: -1,
  //       Message: `The user "${args.userName}" does not exist.`,
  //     };
  //   }

  //   if (userRecord.ReadOnly) {
  //     return {
  //       ReturnCode: -1,
  //       TestPlanID: -1,
  //       Message: `The user "${args.userName}" has read only permissions.`,
  //     };
  //   }

  //   //Create the new test plan
  //   let createTestPlanResponse: TestPlanCreationResponse = await ctx
  //     .get(RepositoriesPort)
  //     .domain(args.domain, (domainRepos) => {
  //       return domainRepos.testPlans.createTestPlan(
  //         args.testPlanName,
  //         args.userName,
  //         "1.0.0"
  //       );
  //     });

  //   //Create a log entry for the new test plan
  //   if (
  //     notNilType(createTestPlanResponse) &&
  //     createTestPlanResponse.TestPlanID > 0 &&
  //     createTestPlanResponse.ReturnCode === 0
  //   ) {
  //     const timeStamp = now();
  //     const logMessage = `${args.testPlanName} created by ${args.userName} on ${timeStamp}`;

  //     await ctx
  //       .get(RepositoriesPort)
  //       .domain(args.domain, (domainRepos) => {
  //         return domainRepos.logs.insert({
  //           Message: logMessage,
  //           TestPlanID: createTestPlanResponse.TestPlanID.valueOf(),
  //           TimeDateStamp: timeStamp,
  //           UserID: userRecord.UserID,
  //         });
  //       })
  //       .catch((error) => {
  //         const err = JSON.stringify(error);
  //         createTestPlanResponse.ReturnCode = -2;
  //         createTestPlanResponse.Message = `Failed to create log entry for new Test Plan: ${err}`;
  //         return createTestPlanResponse;
  //       });
  //   }

  //   return createTestPlanResponse;
  // },

  // saveRecentTestPlan: async (
  //   parent,
  //   args,
  //   ctx
  // ): Promise<RecentTestPlansResponse> => {
  //   const recentTestPlansResponse = await ctx
  //     .get(RecentTestPlansPort)
  //     .saveRecentTestPlan(args.userName, args.testPlanName, args.domain);
  //   return recentTestPlansResponse;
  // },

  // lockTestPlan: async (parent, args, ctx): Promise<TestPlanLockResponse> => {
  //   const response = await ctx
  //     .get(TestPlanLockoutPort)
  //     .lockTestPlan(
  //       args.lockState,
  //       args.testPlanName,
  //       args.domain,
  //       args.employeeNumber
  //     );

  //   if (response != undefined) {
  //     return {
  //       success: response.success,
  //       testPlanName: response.testPlanName,
  //       domain: response.domain,
  //       employeeNumber: response.employeeNumber,
  //       message: response.message,
  //       locked: response.locked,
  //       msSinceEpochToExpire: response.msSinceEpochToExpire,
  //     };
  //   } else {
  //     return {
  //       locked: false,
  //       testPlanName: args.testPlanName,
  //       domain: args.domain,
  //       employeeNumber: args.employeeNumber,
  //       message: `Error: Response object was undefined!`,
  //     };
  //   }
  // },
  updateUserTable: async (parent, args, ctx) => {
    const userRecordPerDomain = await ctx
      .get(RepositoriesPort)
      .domain("Production", async (domainRepos) => {
        // const userInfo = {
        //   Name: args.username,
        //   EMail: args.email || undefined,
        //   Location: args.location || undefined,
        //   Manager: args.manager || undefined,
        //   Phone: args.phone || undefined,
        //   ReadOnly:
        //     args.readOnly !== undefined && args.readOnly !== null
        //       ? args.readOnly
        //       : undefined,
        //   EmployeeNumber: args.employeeNumber || undefined,
        // };
        const userInfo = {
          UserID: 78557,
          EmployeeNumber: args.employeeNumber || "00000",
          FirstName: "Rick",
          LastName: "Sanchez",
          UserName: args.username,
          Email: args.email,
          CellPhone: "1234567890",
          WorkPhone: "6167721800",
          Location: "Zeeland",
          Shift: 1,
          JobTitle: "Space Traveler",
          ManagerEmployeeNumber: "42069",
          LocationID: 0,
          ErphrLocation: {
            LocationID: 0,
            LocationCode: "",
            Description: "",
            InventoryOrgCode: 0,
            InventoryOrgID: 0,
          },
          IsManager: false,
          Status: "",
          SalaryType: "",
          EmployeeType: "",
          PersonType: "",
          PayGroup: "",
          PreferredLocale: "",
          PreferredDisplayLang: "",
          PreferredCurrency: "",
          PrimaryTimezone: "",
          FullTime: true,
          PartTime: false,
        };

        const user = await domainRepos.users.insertOrUpdate(userInfo);
        return { ...user, Domain: "Production" };
      });

    return userRecordPerDomain;
  },

  // saveUserSettings: async (parent, args, ctx): Promise<boolean> => {
  //   const userSettingsResponse = ctx
  //     .get(UserSettingsPort)
  //     .saveUserSettings(args.where, args.userSettings);

  //   return userSettingsResponse;
  // },

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

  // analyzeSavedTestPlan: async (
  //   _parent: any,
  //   args: any,
  //   ctx: any
  // ): Promise<Job> => {
  //   await ctx.get(JobRunnerPort).enqueue(analyzeSavedTestPlanJob, {
  //     data: {
  //       domain: args.domain,
  //       testPlanName: args.testPlanName,
  //       revision: `${args.revision}`,
  //     },
  //     extraBullOpts: {
  //       jobId: args.jobUuid,
  //     },
  //   });

  //   return {
  //     jobType: "AnalyzeSavedTestPlan",
  //     status: "Queued",
  //     uuid: args.jobUuid,
  //   };
  // },

  // cancelAnalyzerJob: async (
  //   _parent: any,
  //   args: any,
  //   ctx: any
  // ): Promise<{
  //   jobUuid: string;
  //   status: string;
  //   results: Array<AnalyzerResult>;
  // }> => {
  //   const jobUuid = args.jobUuid;
  //   if (jobUuid === undefined || jobUuid === "") {
  //     throw new Error("Invalid job uuid passed to cancelAnalyzerJob");
  //   }

  //   const job: StandardJob<any, any> = await ctx.jobs.getJob(
  //     analyzeSavedTestPlanJob,
  //     jobUuid
  //   );
  //   if (job) {
  //     await job.discard();
  //   }
  //   const status = job ? await job.getState() : "closed";

  //   return {
  //     jobUuid,
  //     status: `${status}`,
  //     results: [],
  //   };
  // },

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
