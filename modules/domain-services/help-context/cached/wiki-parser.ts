export namespace WikiParser {
  type ButtonInfo = {
    title: string;
    description: string;
    action: string;
  };

  /**
   * AdditionalSection
   *
   * An additional section is an optional section that occurs after
   * or inside of a DocSection. Sometimes there are conditions upon
   * which these can be chosen (i.e. tpe type);
   */
  export type AdditionalSection = {
    title: string;
    level: number;
    tpe_type: string | undefined;
    description: string;
    buttons: Array<ButtonInfo>;
  };

  /**
   * DocSection
   *
   * A doc section is a singular piece of
   */
  export type DocSection = {
    key: string;
    title: string;
    description: string;
    level: number;
    additional: Array<AdditionalSection>;
    buttons: Array<ButtonInfo>;
  };

  export const splitComments = (line: string): string[] => {
    let commentBlocks: string[] = [];
    const regex = /[^<]*<!--(.*?)-->(.*)/;
    let currentLine = line;
    let result = regex.exec(line);
    while (result) {
      commentBlocks.push(result[1].trim());
      currentLine = result[2];
      result = regex.exec(currentLine);
    }
    return commentBlocks;
  };

  export const isBreakingLine = (line: string) => {
    const terminators = "#!<[|";
    if (line.trim() === "") {
      return false;
    }
    const i = terminators.indexOf(line.trim().substring(0, 1));
    return i >= 0;
  };

  const isNotBreakingLine = (line: string) => {
    return !isBreakingLine(line);
  };

  const HEADING_WITH_DIV_REGEX = /[^#]*(#+)([^<]+)<div id="([^"]+)".*/;

  const isHeadingWithDiv = (line: string): boolean => {
    const result = HEADING_WITH_DIV_REGEX.exec(line);
    return result ? true : false;
  };

  export const parseComponent = (
    line: string
  ): { key: string; title: string; level: number } | undefined => {
    const result = HEADING_WITH_DIV_REGEX.exec(line);
    if (result) {
      return {
        key: result[3] as string,
        title: result[2].trim(),
        level: result[1].length,
      };
    }

    return undefined;
  };

  const HEADING_REGEX = /[\s]*([#]+)([^#<]+)/;

  export const isHeading = (line: string): boolean => {
    const result = HEADING_REGEX.exec(line);
    return result ? true : false;
  };

  export const headingLevel = (line: string): number => {
    const result = HEADING_REGEX.exec(line);
    return result ? result[1].length : 0;
  };

  export const interpretTypes = (comments: string[]) => {
    let types: string[] = [];
    const regex = /type is (.*)$/;
    comments.map((c) => {
      const result = regex.exec(c);
      if (result) {
        types.push(result[1].trim());
      }
    });
    if (types.length === 0) {
      return undefined;
    }
    return types;
  };

  export const parseHeading = (line: string) => {
    const headingRegexResult = HEADING_REGEX.exec(line);
    if (!headingRegexResult) {
      return undefined;
    }
    const comments = splitComments(line);
    return {
      level: headingRegexResult[1].length,
      title: headingRegexResult[2].trim(),
      types: interpretTypes(comments),
    };
  };

  const BUTTONS_TABLE_HEADER_REGEX = /[\s]*\|[\s]*Button[\s]*\|[\s]*Description[\s]*\|/;
  const BUTTONS_TABLE_LINES_REGEX = /[\s]*\|[\s]*[-]+[\s]*\|[\s]*[-]+[\s]*\|/;

  export const isButtonTableHeaderLine1 = (line: string): boolean => {
    const result = BUTTONS_TABLE_HEADER_REGEX.exec(line);
    return result ? true : false;
  };

  export const isButtonTableHeaderLine2 = (line: string): boolean => {
    const result = BUTTONS_TABLE_LINES_REGEX.exec(line);
    return result ? true : false;
  };

  export const isStartOfButtonTable = (lines: string[], index: number) => {
    return (
      isButtonTableHeaderLine1(lines[index]) &&
      index + 1 < lines.length &&
      isButtonTableHeaderLine2(lines[index + 1])
    );
  };

  const BUTTON_REGEX = /[\s]*\|[\s]*([^|]+)\|[\s]*([^|]+)\|/;

  const parseButtonsAux = (
    lines: string[],
    index: number
  ): Array<ButtonInfo> => {
    let buttons: Array<ButtonInfo> = [];
    for (let i = index; i < lines.length; ++i) {
      const result = BUTTON_REGEX.exec(lines[i]);
      if (result) {
        buttons.push({
          action: result[1].trim(),
          description: result[2].trim(),
          title: result[1].trim(),
        });
      } else {
        break;
      }
    }

    return buttons;
  };

  const findNextLineAfterButtons = (lines: string[], index: number): number => {
    for (let i = index; i < lines.length; ++i) {
      const result = BUTTON_REGEX.exec(lines[i]);
      if (!result) {
        return i;
      }
    }
    return index;
  };

  export const parseButtonTableContent = (lines: string[], index: number) => {
    return {
      buttons: parseButtonsAux(lines, index),
      nextIndex: findNextLineAfterButtons(lines, index),
    };
  };

  const parseAdditionalSections = (
    lines: string[],
    level: number,
    index: number
  ): {
    sections: Array<AdditionalSection>;
    index: number;
  } => {
    let nextIndex = index;
    let sections: Array<AdditionalSection> = [];
    for (let i = index; i < lines.length; ++i) {
      if (isHeading(lines[i])) {
        const currentHeadingLevel = headingLevel(lines[i]);
        if (currentHeadingLevel === level || currentHeadingLevel < level) {
          return {
            sections,
            index: i,
          };
        }

        if (isHeadingWithDiv(lines[i])) {
          return {
            sections,
            index: i,
          };
        }

        const headingInfo = parseHeading(lines[i]);
        let description: string = "";
        let buttons: Array<ButtonInfo> = [];
        for (let j = i + 1; j < lines.length; ++j) {
          if (isStartOfButtonTable(lines, j)) {
            const buttonInfo = parseButtonTableContent(lines, j + 2);
            buttons = buttonInfo.buttons;
            i = buttonInfo.nextIndex;
            break;
          } else if (isNotBreakingLine(lines[j])) {
            description = description + "\n" + lines[j];
            i = j;
          } else {
            i = j - 1;
            break;
          }
        }

        (headingInfo?.types ?? [undefined]).map((t) => {
          sections.push({
            description: description.trim(),
            level: headingInfo?.level ?? -1,
            title: headingInfo?.title ?? "",
            tpe_type: t,
            buttons: buttons,
          });
        });
      }

      nextIndex = i;
    }

    return {
      sections,
      index: nextIndex,
    };
  };

  export const parse = (wikiContents: string): Array<DocSection> => {
    const lines = wikiContents.split("\n");
    let sections: Array<DocSection> = [];

    let index = 0;
    for (; index < lines.length; ++index) {
      const sectionResult = parseComponent(lines[index]);
      if (sectionResult === undefined) {
        continue;
      }

      let descriptionIndex = index;
      let descriptionString = "";
      for (
        descriptionIndex = index + 1;
        descriptionIndex < lines.length;
        ++descriptionIndex
      ) {
        if (isBreakingLine(lines[descriptionIndex])) {
          index = descriptionIndex - 1;
          break;
        } else {
          const tempLine = lines[descriptionIndex].trim();
          if (tempLine === "") {
            descriptionString += "\n";
          } else {
            descriptionString += " ";
            descriptionString += lines[descriptionIndex].trim();
          }
          index = descriptionIndex;
        }
      }

      let buttonSectionInfo:
        | {
            buttons: ButtonInfo[];
            nextIndex: number;
          }
        | undefined = undefined;

      let nextIndex = index;
      for (; nextIndex < lines.length; ++nextIndex) {
        const line = lines[nextIndex];
        if (isButtonTableHeaderLine1(line)) {
          const line2 = lines[nextIndex + 1];
          if (isButtonTableHeaderLine2(line2)) {
            buttonSectionInfo = parseButtonTableContent(lines, nextIndex + 2);
            break;
          }
        }

        if (isBreakingLine(line)) {
          break;
        }
      }

      if (buttonSectionInfo) {
        index = buttonSectionInfo.nextIndex;
      }

      const additionalSectionInfo = parseAdditionalSections(
        lines,
        sectionResult.level,
        index
      );

      index = additionalSectionInfo.index - 1;
      sections.push({
        description: descriptionString.trim(),
        key: sectionResult.key,
        title: sectionResult.title,
        level: sectionResult.level,
        additional: additionalSectionInfo.sections,
        buttons: buttonSectionInfo?.buttons ?? [],
      });
    }

    return sections;
  };
}
