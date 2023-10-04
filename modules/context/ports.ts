import * as Hexagonal from "atomic-object/hexagonal";
import * as config from "config";

export const RedisPrefixPort = Hexagonal.port<string | null, "redis prefix">(
  "redis prefix"
);
export type RedisPrefixPort = typeof RedisPrefixPort;
export const RedisPrefixAdapter = Hexagonal.adapter({
  port: RedisPrefixPort,
  requires: [],
  build: () => config.get<string>("redis.prefix"),
});

export const SmbPrefixPort = Hexagonal.port<string, "smb prefix">("smb prefix");
export type SmbPrefixPort = typeof SmbPrefixPort;
export const SmbPrefixAdapter = Hexagonal.adapter({
  port: SmbPrefixPort,
  requires: [],
  build: () => "",
});

export const SubversionSuffixPort = Hexagonal.port<string, "subversion suffix">(
  "subversion suffix"
);
export type SubversionSuffixPort = typeof SubversionSuffixPort;
export const SubversionSuffixAdapter = Hexagonal.adapter({
  port: SubversionSuffixPort,
  requires: [],
  build: () => "",
});

export const UserNamePort = Hexagonal.port<string | undefined, "User Name">(
  "User Name"
);
export const UserNameAdapter = Hexagonal.adapter({
  port: UserNamePort,
  requires: [],
  build: () => undefined,
});

export const AppKeyPort = Hexagonal.port<string | undefined, "App Key">(
  "App Key"
);
export const AppKeyAdapter = Hexagonal.adapter({
  port: AppKeyPort,
  requires: [],
  build: () => undefined,
});
