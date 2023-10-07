module.exports = {
  prodDatabaseServer: "sql-server",
  prodDatabaseName: "test-production",
  prodDatabaseUser: "SA",
  prodDatabasePassword: "YourStrongPassw0rd",

  engDatabaseServer: "sql-server",
  engDatabaseName: "test-engineering",
  engDatabaseUser: "SA",
  engDatabasePassword: "YourStrongPassw0rd",

  redis: {
    url: "redis://redis:6379/0",
    prefix: process.env.REDIS_PREFIX || "",
  },
  server: {
    port: 3002,
    requireAuth: false,
    cluster: false,
    secret: "cats",
    graphqlAppSecret: "--testAppKey1--testAppKey2--testAppKey3--",
  },
  subversion: {
    repoName: "config-data",
    baseUrl: "http://subversion/svn/gentex-repo",
    username: "user",
    password: "password",
  },
  smb: {
    versionedLibraries: {
      share: "\\\\samba\\smbFakeShare",
      domain: "WORKGROUP",
      username: "test",
      password: "TEST123",
      basePath: "tests",
    },
  },
  mesRestApi: {
    mesSecurityEndpoint: "http://rest-endpoints:3070/",
    mesBiEndpoint: "http://rest-endpoints:3070/",
    mesUserPictureUrl: "http://rest-endpoints:3070/user/image/",
    employeeDirectoryEndpoint: "http://rest-endpoints:3070/employees/",
    mesRegistryEndpoint: "http://rest-endpoints:3070/mes/",
    mesProcessDataEndpoint: "http://rest-endpoints:3070/processData",
  },
};
