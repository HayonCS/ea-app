import { HelpContextBusinessLogic } from "../help-context-business-logic";

describe("verification of building a clue map", () => {
  it("build empty map", () => {
    const m = HelpContextBusinessLogic.keywordMap([]);
    expect(m).toMatchObject({});
  });

  it("build map with one value", () => {
    const m = HelpContextBusinessLogic.keywordMap([
      {
        name: "n1",
        value: "v1",
      },
    ]);
    expect(m).toMatchObject({
      n1: "v1",
    });
  });

  it("build map with multiple values", () => {
    const m = HelpContextBusinessLogic.keywordMap([
      {
        name: "n1",
        value: "v1",
      },
      {
        name: "n2",
        value: "v2",
      },
      {
        name: "n3",
        value: "v3",
      },
    ]);
    expect(m).toMatchObject({
      n1: "v1",
      n2: "v2",
      n3: "v3",
    });
  });
});

describe("clue word replacement in string", () => {
  it("empty and empty", () => {
    const textOut = HelpContextBusinessLogic.replaceWithClue("", {});
    expect(textOut).toBe("");
  });

  it("do replacement with no matches", () => {
    const textOut = HelpContextBusinessLogic.replaceWithClue("Hello World", {});
    expect(textOut).toBe("Hello World");
  });

  it("do replacement with no matches and some stuff in dictionary", () => {
    const textOut = HelpContextBusinessLogic.replaceWithClue("Hello World", {
      id: "ev1",
      type: "evaluation",
    });
    expect(textOut).toBe("Hello World");
  });

  it("do replacement with matches and some stuff in dictionary", () => {
    const textOut = HelpContextBusinessLogic.replaceWithClue(
      "Hello <!-- id --> World",
      {
        id: "ev1",
        type: "evaluation",
      }
    );
    expect(textOut).toBe("Hello ev1 World");
  });
});
