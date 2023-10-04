import * as Hexagonal from "atomic-object/hexagonal";

import { VersionedLibraries } from "domain-services/versioned-libraries";

export const VersionedLibrariesPort = Hexagonal.port<
  VersionedLibraries,
  "versionedLibraries"
>("versionedLibraries");
