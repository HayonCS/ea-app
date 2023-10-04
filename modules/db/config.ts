const config = require("config");

export const knexConfig = {
  Production: {
    client: "mssql",
    connection: {
      host: config.get("prodDatabaseServer"),
      database: config.get("prodDatabaseName"),
      user: config.get("prodDatabaseUser"),
      password: config.get("prodDatabasePassword"),
      requestTimeout: 60000,
      enableArithAbort: true,
    },
  },
  Engineering: {
    client: "mssql",
    connection: {
      host: config.get("engDatabaseServer"),
      database: config.get("engDatabaseName"),
      user: config.get("engDatabaseUser"),
      password: config.get("engDatabasePassword"),
      requestTimeout: 60000,
      enableArithAbort: true,
    },
  },
};
