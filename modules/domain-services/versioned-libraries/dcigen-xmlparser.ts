import * as _ from "lodash-es";

import {
  LibraryEnum,
  LibraryFunction,
  LibraryFunctionParamDirection,
  VersionedLibrary,
} from "./versioned-library";

import { parseString } from "xml2js";

interface WarpedEnumInfo {
  Name: string[];
  Value: string[];
  Description: string[];
}

interface WarpedEnumType {
  Name: string[];
  Description: string[];
  EnumInfo: WarpedEnumInfo[];
}

interface WarpedParam {
  Name: string[];
  Description: string[];
  Direction: string[];
  Type: string[];
  Default: string[];
  EnumType?: string[];
}

interface WarpedMethod {
  Name: string[];
  Description: string[];
  Param?: WarpedParam[];
}

interface WarpedDCIGenXml {
  dcigen: {
    Class: string[];
    Description: string[];
    Singleton: string[];
    __documentation__?: string[];
    __svninfo__?: string[];
    __symbolicname__?: string[];
    EnumType?: WarpedEnumType[];
    Method?: WarpedMethod[];
  };
}

export const splitXmlString = (xmlContents: string | Buffer): string[] => {
  if ("string" === typeof xmlContents && 0 !== xmlContents.length) {
    const match = xmlContents.match(/\s*<\/EnumInfo>\s*<\/EnumType>\s*/gim);
    if (match && match[0]) {
      const enumStart = xmlContents.search(/\s*<EnumType>\s*<Name>/gim);
      const enumEnd = xmlContents.lastIndexOf(match[0]);
      if (enumEnd > enumStart) {
        //Extract the enum information
        const enumData = xmlContents.slice(
          enumStart,
          enumEnd + match[0].length
        );

        //Temporarily remove the enum information from the string
        const removedEnums =
          xmlContents.substr(0, enumStart) +
          xmlContents.substr(enumEnd + match[0].length);

        //Add the enums back in at the right place
        const insertMatch = removedEnums.match(/\s*<\/Class>\s*/gim);
        if (insertMatch && insertMatch[0]) {
          const insertPos = removedEnums.indexOf(insertMatch[0]);
          if (insertPos > 0) {
            xmlContents =
              removedEnums.substr(0, insertPos + insertMatch[0].length) +
              enumData +
              removedEnums.substr(insertPos + insertMatch[0].length);
          }
        }
      }
    }

    const fragments = _.drop(xmlContents.split("<Class>"), 1).map(
      (fragment) => `<dcigen><Class>${fragment}`
    );

    const first = _.take(fragments, fragments.length - 1).map(
      (fragment) => `${fragment}</dcigen>`
    );

    const last = _.last(fragments);

    return [...first, ...(last ? [last] : [])];
  }

  return [];
};

const trimValue = (value: string) => {
  return value.replace(/^"/, "").replace(/"$/, "").trim();
};

const parseXmlString = (xmlContents: string) => {
  return new Promise<WarpedDCIGenXml>((resolve, reject) => {
    parseString(
      xmlContents,
      {
        explicitChildren: true,
        mergeAttrs: true,
        trim: true,
        valueProcessors: [trimValue],
        attrValueProcessors: [trimValue],
      },
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      }
    );
  });
};

export const parseDCIGenXmlContents = async (xmlContents: string) => {
  return parseXmlString(xmlContents);
};

export const getVersionedLibrary = async (
  xmlContents: string | Buffer,
  opts: {
    versionNumber: string;
    platformName: string;
    libraryName: string;
  }
): Promise<VersionedLibrary> => {
  const fragments = splitXmlString(xmlContents);

  const parsedFragments = await Promise.all(
    fragments.map(parseDCIGenXmlContents)
  );

  const globals = _.first(parsedFragments);

  const enums = _.flatten(
    parsedFragments.map((fragment) => {
      if (!fragment.dcigen.EnumType) {
        return [];
      }

      return fragment.dcigen.EnumType.map(
        (enumType): LibraryEnum => {
          return {
            name: _.first(enumType.Name) || "",
            description: _.first(enumType.Description) || "",
            entries: _.orderBy(
              enumType.EnumInfo.map((enumInfo) => {
                return {
                  name: _.first(enumInfo.Name) || "",
                  description: (_.first(enumInfo.Description) || "").trim(),
                  value: Number.parseInt(_.first(enumInfo.Value) || ""),
                };
              }),
              (entry) => entry.name
            ),
          };
        }
      );
    })
  );

  const getDirection = (
    direction: string | null | undefined
  ): LibraryFunctionParamDirection => {
    switch (direction) {
      case "[INPUT]":
        return "IN";
      case "[OUTPUT]":
        return "OUT";
      default:
        return "RETURN";
    }
  };

  const functions: LibraryFunction[] = _.flatten(
    parsedFragments.map((fragment) => {
      if (!fragment.dcigen.Method) {
        return [];
      }

      return fragment.dcigen.Method.map(
        (method): LibraryFunction => {
          const className = _.first(fragment.dcigen.Class) || "";
          const classDescription = _.first(fragment.dcigen.Description);

          return {
            name: _.first(method.Name) || "",
            description: _.first(method.Description) || "",
            className: className !== "GLOBALS" ? className : undefined,
            classDescription: classDescription,
            params: _.orderBy(
              (method.Param || []).map((param) => {
                return {
                  name: _.first(param.Name) || "",
                  description: _.first(param.Description) || "",
                  direction: getDirection(_.first(param.Direction)),
                  type: _.first(param.Type) || "",
                  default: _.first(param.Default) || "",
                  enumName: _.first(param.EnumType) || "",
                };
              }),
              (param) => param.name
            ),
          };
        }
      );
    })
  );

  return {
    documentationLink: _.first(globals && globals.dcigen.__documentation__),
    enums: _.orderBy(enums, (enumType) => enumType.name),
    functions: _.orderBy(functions, (func) => func.name),
    isCurrentRelease: false, // TBD
    libraryName: opts.libraryName,
    platformName: opts.platformName,
    versionNumber: opts.versionNumber,
    versionControlUrl: _.first(globals && globals.dcigen.__svninfo__),
  };
};
