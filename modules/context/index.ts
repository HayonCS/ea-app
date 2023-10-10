import {
  apolloClientAdapter,
  ApolloClientStatePort,
} from "atomic-object/apollo-client";
import { ApolloClientPort } from "atomic-object/apollo-client/ports";
import { cacheAdapter, cacheStoreAdapter } from "atomic-object/cache";
import { CachePort, CacheStorePort } from "atomic-object/cache/ports";
import * as Hexagonal from "atomic-object/hexagonal";
import { PortType } from "atomic-object/hexagonal/ports";
import * as Recipe from "atomic-object/hexagonal/recipe";
import { BullJobRunner } from "atomic-object/jobs/bull-runner";
import { JobRunnerPort } from "atomic-object/jobs/ports";
import * as Logger from "atomic-object/logger";
import { BaseLoggerPort, LoggerPort } from "atomic-object/logger/ports";
import { ClientState } from "client/graphql/state-link";
import { reservedKeywordsRepositoryAdapter } from "domain-services/reserved-keywords";
import { ReservedKeywordsPort } from "domain-services/reserved-keywords/port";
import { versionedLibrariesRepositoryAdapter } from "domain-services/versioned-libraries";
import { VersionedLibrariesPort } from "domain-services/versioned-libraries/port";
import { NodeEnvironmentAdapter, NodeEnvironmentPort } from "node-environment";
import { smbAdapter } from "smb";
import { SmbPort } from "smb/port";
import { subversionAdapter } from "subversion";
import { SubversionPort } from "subversion/port";
import {
  RedisPrefixAdapter,
  RedisPrefixPort,
  SmbPrefixAdapter,
  SmbPrefixPort,
  SubversionSuffixAdapter,
  SubversionSuffixPort,
  UserNameAdapter,
  UserNamePort,
  AppKeyPort,
  AppKeyAdapter,
} from "./ports";
import { MesSecurityPort } from "rest-endpoints/mes-security/port";
import { mesSecurityAdapter } from "rest-endpoints/mes-security";
import { UserPicturePort } from "rest-endpoints/user-picture/port";
import { userPictureAdapter } from "rest-endpoints/user-picture";
import { EmployeeInfoPort } from "rest-endpoints/employee-directory/port";
import { employeeInfoAdapter } from "rest-endpoints/employee-directory";
import { AssetsBiPort } from "domain-services/assets-bi/port";
import { assetsBiAdapter } from "domain-services/assets-bi";
import { UserAppDataPort } from "domain-services/user-app-data/port";
import { userAppDataAdapter } from "domain-services/user-app-data";
import { MesBiPort } from "rest-endpoints/mes-bi/port";
import { mesBiAdapter } from "rest-endpoints/mes-bi";
import { MesProcessDataPort } from "rest-endpoints/mes-process-data/port";
import { mesProcessDataAdapter } from "rest-endpoints/mes-process-data";
import { EmployeeDirectoryRedisPort } from "domain-services/employee-directory-redis/port";
import { employeeDirectoryRedisAdapter } from "domain-services/employee-directory-redis";
import { ProcessDataRedisPort } from "domain-services/process-data-redis/port";
import { processDataRedisAdapter } from "domain-services/process-data-redis";

export type ContextOpts = {
  initialState?: ClientState;
  smbPrefix?: string;
  redisPrefix?: string;
  subversionSuffix?: string;
  redisDisabled?: boolean;
  jobs?: PortType<JobRunnerPort>;
  logger?: Logger.Type;
  cacheStore?: CacheStore;
  portDefaults?: Recipe.Recipeable<any>;
  userName?: string | undefined;
  appKey?: string | undefined;
};

// Note: The order of these `add` calls matters. You must ensure that
// all dependencies are added above the Port that depends on them.
const ContextBase = Hexagonal.contextClass((c) =>
  c
    .add(NodeEnvironmentPort, NodeEnvironmentAdapter)
    .add(BaseLoggerPort, Logger.baseLoggerAdapter)
    .add(LoggerPort, Logger.loggerAdapter)
    .add(ApolloClientStatePort, () => {})
    .add(ApolloClientPort, apolloClientAdapter)
    .add(RedisPrefixPort, RedisPrefixAdapter)
    .add(CacheStorePort, cacheStoreAdapter)
    .add(CachePort, cacheAdapter)
    .add(UserNamePort, UserNameAdapter)
    .add(AppKeyPort, AppKeyAdapter)
    .add(JobRunnerPort, (ctx) => {
      return new BullJobRunner(
        ctx.get(RedisPrefixPort) || "",
        ctx.get(UserNamePort),
        ctx.get(AppKeyPort),
        () => ctx.clone()
      );
    })
    .add(SubversionSuffixPort, SubversionSuffixAdapter)
    .add(SubversionPort, subversionAdapter)
    .add(SmbPrefixPort, SmbPrefixAdapter)
    .add(SmbPort, smbAdapter)
    .add(ReservedKeywordsPort, reservedKeywordsRepositoryAdapter)
    .add(VersionedLibrariesPort, versionedLibrariesRepositoryAdapter)
    .add(MesSecurityPort, mesSecurityAdapter)
    .add(MesBiPort, mesBiAdapter)
    .add(MesProcessDataPort, mesProcessDataAdapter)
    .add(ProcessDataRedisPort, processDataRedisAdapter)
    .add(UserPicturePort, userPictureAdapter)
    .add(EmployeeInfoPort, employeeInfoAdapter)
    .add(EmployeeDirectoryRedisPort, employeeDirectoryRedisAdapter)
    .add(AssetsBiPort, assetsBiAdapter)
    .add(UserAppDataPort, userAppDataAdapter)
);

/** The graphql context type for this app.  */
export class Context extends ContextBase {
  constructor(opts: ContextOpts = {}) {
    super({
      portDefaults:
        (opts.portDefaults as any) ||
        ((x) =>
          x
            .add(BaseLoggerPort, () => opts.logger)
            .add(ApolloClientStatePort, () => opts.initialState || undefined)
            .add(CacheStorePort, () => opts.cacheStore)
            .add(JobRunnerPort, () => opts.jobs)
            .add(SmbPrefixPort, () => opts.smbPrefix)
            .add(RedisPrefixPort, () => opts.redisPrefix)
            .add(SubversionSuffixPort, () => opts.subversionSuffix)
            .add(UserNamePort, () => opts.userName)
            .add(AppKeyPort, () => opts.appKey)),
    });
  }

  get userAppData() {
    return this.get(UserAppDataPort);
  }

  get jobs() {
    return this.get(JobRunnerPort);
  }

  get logger(): Logger.Type {
    return this.get(LoggerPort);
  }

  get mesSecurity() {
    return this.get(MesSecurityPort);
  }

  get mesBi() {
    return this.get(MesBiPort);
  }

  get mesProcessData() {
    return this.get(MesProcessDataPort);
  }

  get processDataRedis() {
    return this.get(ProcessDataRedisPort);
  }

  get employeeInfo() {
    return this.get(EmployeeInfoPort);
  }

  get employeeDirectory() {
    return this.get(EmployeeInfoPort);
  }

  get employeeDirectoryRedis() {
    return this.get(EmployeeDirectoryRedisPort);
  }

  get subversion() {
    return this.get(SubversionPort);
  }

  get smb() {
    return this.get(SmbPort);
  }

  get versionedLibraries() {
    return this.get(VersionedLibrariesPort);
  }

  get apolloClient() {
    return this.get(ApolloClientPort);
  }

  get redisPrefix() {
    return this.get(RedisPrefixPort);
  }

  get smbPrefix() {
    return this.get(SmbPrefixPort);
  }

  get cache() {
    return this.get(CachePort);
  }

  async destroy() {
    // currently a noop
  }
}

export class ApiContext extends Context {}
