import { parseReservedKeywords } from "../parser";

describe("Reserved Keywords Parser", () => {
  it("parses keywords from a valid file", async () => {
    const fileContents = `
/**
 * @file       ReservedNames.ipp
 * @author     JR Lewis
 * @date       01/20/2015
 * @brief      This file includes the declaration AND implementation of code that checks 
 *             to see if property names are reserved. Keep in mind that the requirements for
 *             this code is:
 *
 *             - Must be included inside of an anonymous namespace.
 */


static const char* builtins[] = 
{
	  "objectName"
	, "parent"
	, "opacity"
	, "enabled"
	, "visible"
};
`;

    const result = await (await parseReservedKeywords(fileContents)).sort();

    expect(result).toEqual(
      ["objectName", "parent", "opacity", "enabled", "visible"].sort()
    );
  });

  it("doesn't parse keywords from a file that doesn't fit our format", async () => {
    const fileContents = "There are no reserved keywords here";
    const result = await parseReservedKeywords(fileContents);

    expect(result).toEqual([]);
  });

  it("doesn't parse keywords from an empty file", async () => {
    const fileContents = "";
    const result = await parseReservedKeywords(fileContents);

    expect(result).toEqual([]);
  });
});
