export type LibraryFunctionParamDirection = "IN" | "OUT" | "RETURN";

export interface LibraryFunction {
  name: string;
  description: string;
  className: string | undefined;
  classDescription: string | undefined;
  params: Array<{
    name: string;
    description: string;
    direction: LibraryFunctionParamDirection;
    type: string;
    default: string;
    enumName: string;
  }>;
}

export interface LibraryEnum {
  name: string;
  description: string;
  entries: Array<{
    description: string;
    name: string;
    value: number;
  }>;
}

export type VersionedLibrary = {
  platformName: string;
  versionNumber: string;
  libraryName: string;
  documentationLink: string | undefined;
  enums: LibraryEnum[];
  functions: LibraryFunction[];
  isCurrentRelease: boolean;
  versionControlUrl: string | undefined;
};

export interface Library {
  libraryName: string;
  versions: VersionedLibrary[];
}
