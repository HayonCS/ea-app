if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    silent: false,
  });
}

const CONCURRENCY = parseInt(process.env.WEB_CONCURRENCY, 10) || 1;
const WORKER_CONCURRENCY =
  parseInt(process.env.WORKER_CONCURRENCY, 10) || CONCURRENCY;

module.exports = {
  environment: process.env.NODE_ENV,

  prodDatabaseServer: process.env.PROD_DATABASE_SERVER,
  prodDatabaseName: process.env.PROD_DATABASE_NAME,
  prodDatabaseUser: process.env.PROD_DATABASE_USER,
  prodDatabasePassword: process.env.PROD_DATABASE_PASSWORD,

  engDatabaseServer: process.env.ENG_DATABASE_SERVER,
  engDatabaseName: process.env.ENG_DATABASE_NAME,
  engDatabaseUser: process.env.ENG_DATABASE_USER,
  engDatabasePassword: process.env.ENG_DATABASE_PASSWORD,

  minify:
    process.env.MINIFY != null
      ? process.env.MINIFY === "true"
      : process.env.NODE_ENV === "production",

  production: process.env.NODE_ENV === "production",
  development: process.env.NODE_ENV === "development",
  test: process.env.NODE_ENV === "test",

  redis: {
    url: process.env.REDIS_URL,
    prefix: process.env.REDIS_PREFIX || "",
  },

  rollbar: {
    serverAccessToken: process.env.ROLLBAR_ACCESS_TOKEN || null,
    clientAccessToken: process.env.ROLLBAR_CLIENT_ACCESS_TOKEN || null,
  },

  webpackDevServer: {
    url:
      `${process.env.SSL_ENABLED}`.trim() === "true"
        ? "https://localhost"
        : "http://localhost",
    port: 3000,
    hot: true,
    inline: true,
    noInfo: true,
    host: process.env.WEBPACK_DEV_SERVER_HOST || null,
  },

  auth: {
    azureAD: {
      identityMetadata: `${process.env.OAUTH_AUTHORITY}${process.env.OATH_TENANT_ID}/${process.env.OAUTH_ID_METADATA}`,
      clientID: process.env.OAUTH_APP_ID,
      responseType: "code id_token",
      responseMode: "form_post",
      redirectUrl: `${process.env.OAUTH_REDIRECT_URI}`,
      allowHttpForRedirectUrl: true,
      clientSecret: process.env.OAUTH_APP_PASSWORD,
      scope: process.env.OAUTH_SCOPES?.split(" "),
      useCookieInsteadOfSession: true,
      cookieSameSite: true,
      cookieEncryptionKeys: [
        { key: "xfxavIzpCOd9LlWZrbbEpHGVJrPzukWi", iv: "UWexTi9waiBn" },
      ],
    },
  },

  server: {
    port: process.env.PORT || 3001,
    apiHost: process.env.API_HOST || "localhost:3001",
    secret: process.env.SERVER_SECRET || "serverSecret",

    protocol: process.env.SSL_ENABLED === "true" ? "https" : "http",

    graphiql: false,
    workers: CONCURRENCY,
    cluster: CONCURRENCY > 1,

    jwtSecret: process.env.JWT_SECRET || "jwtSecret",
    graphqlAppSecret: process.env.APP_SPECIFIC_KEYS || "",

    sslEnabled: process.env.SSL_ENABLED === "true",
    sslKeyFile: process.env.SSL_KEY || "",
    sslCertFile: process.env.SSL_CERT || "",

    webId: process.env.WEB_ID || "",
  },
  jobs: {
    workers: WORKER_CONCURRENCY,
  },

  subversion: {
    repoName: process.env.SVN_REPO,
    baseUrl: process.env.SVN_URL,
    username: process.env.SVN_USER,
    password: process.env.SVN_PASSWORD,
  },

  smb: {
    versionedLibraries: {
      share: process.env.SMB_SHARE,
      domain: process.env.SMB_DOMAIN,
      username: process.env.SMB_USERNAME,
      password: process.env.SMB_PASSWORD,
      basePath: process.env.SMB_VERSIONED_LIBRARY_BASEPATH,
    },
  },
  mesRestApi: {
    mesSecurityEndpoint: process.env.MES_SECURITY_ENDPOINT,
    mesBiEndpoint: process.env.MES_BI_ENDPOINT,
    mesUserPictureUrl: process.env.MES_USER_PICTURE,
    employeeDirectoryEndpoint: process.env.MES_EMPLOYEE_DIRECTORY,
    mesRegistryEndpoint: process.env.MES_REGISTRY_ENDPOINT,
    mesProcessDataEndpoint: process.env.MES_PROCESS_DATA_ENDPOINT,
  },
  tpLockout: {
    enableLockout: process.env.ENABLE_LOCKOUT ?? "true",
    tpLockoutLengthMs: process.env.TP_LOCKOUT_TIME_MS,
  },
};
