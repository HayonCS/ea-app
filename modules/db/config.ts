const config = require("config");

export const knexConfig = {
  WebDC: {
    client: "mssql",
    connection: {
      host: config.get("webdcDatabaseServer"),
      database: config.get("webdcDatabaseName"),
      user: config.get("webdcDatabaseUser"),
      password: config.get("webdcDatabasePassword"),
      requestTimeout: 60000,
      enableArithAbort: true,
    },
  },
};
