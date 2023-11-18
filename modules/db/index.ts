import * as Debug from "debug";
import * as knex from "knex";

import { Domain } from "atomic-object/records/knex";
import { knexConfig } from "db/config";

const debug = Debug("db");

export type Knex = knex.Knex;

let _connections: { [key: string]: Knex } = {};

function buildConnection(domain: Domain, prefix: string) {
  const domainConfig = { ...knexConfig[domain] };

  return knex.knex({
    ...domainConfig,
    connection: {
      ...domainConfig.connection,
      database: domainConfig.connection.database.replace("test-", prefix),
    },
  });
}

export function getConnectionForPrefix(domain: Domain, prefix: string) {
  const key = `${prefix}${domain.toLowerCase()}`;

  if (!_connections[key]) {
    _connections[key] = buildConnection(domain, prefix);
  }

  return _connections[key]!;
}

export function getConnection(domain: Domain) {
  const prefix =
    process.env.NODE_ENV === "test"
      ? process.env.JEST_WORKER_ID && process.env.JEST_WORKER_ID.length > 0
        ? `test-${process.env.JEST_WORKER_ID}-`
        : "test-"
      : "";

  const key = `${prefix}${domain.toLowerCase()}`;

  if (!_connections[key]) {
    _connections[key] = buildConnection(domain, prefix);
  }

  debug("📦 Domain:", domain, "; Prefix:", prefix, "; key:", key);

  return _connections[key]!;
}

export async function destroyConnection(dbName?: string) {
  const k = dbName || "__default";
  const existingConnection = _connections[k];
  if (existingConnection) {
    delete _connections[k];
    await existingConnection.destroy();
  }
}

export async function destroyAllConnections() {
  const connections = _connections;
  _connections = {};

  await Promise.all(
    Object.keys(connections).map((key) => {
      return new Promise((resolve) => {
        connections[key].destroy(() => {
          resolve(0);
        });
      });
    })
  );

  // await Promise.all(Object.values(connections).map(c => c.destroy()));
}

export async function allTableNamesFromDb(knex: Knex) {
  const result = await knex.raw<
    Array<{ TABLE_SCHEMA: string; TABLE_NAME: string }>
  >(`
    SELECT TABLE_SCHEMA, TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'
    `);

  return result.map((r) => `"${r.TABLE_SCHEMA}"."${r.TABLE_NAME}"`);
}

export async function truncateAllTables(knex: Knex) {
  const tables = await allTableNamesFromDb(knex);
  const escapedTableNameList = tables.join(", ");
  return `TRUNCATE ${escapedTableNameList}`;
}

export async function truncateAll(knex: Knex) {
  await truncateAllTables(knex);
}
