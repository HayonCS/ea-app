import * as Hexagonal from "atomic-object/hexagonal";

import { Cache } from ".";

export const CachePort = Hexagonal.port<Cache, "cache">("cache");

export const CacheStorePort = Hexagonal.port<CacheStore, "cache store">(
  "cache store"
);
export type CacheStorePort = typeof CacheStorePort;
