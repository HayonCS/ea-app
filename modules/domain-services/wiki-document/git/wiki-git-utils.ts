import * as fs from "fs";
import * as child_process from "child_process";

export namespace WikiGitUtils {
  const gitExecutable = `/usr/bin/git`;
  const tempRoot = "/tmp";
  const tempWikiLocation = `${tempRoot}/wiki`;

  const pat = `${process.env.GIT_WIKI_TOKEN ?? ""}`;
  const repo = `${process.env.GIT_WIKI_URL ?? ""}`;
  const wikiFileLocation = `${tempWikiLocation}/${
    process.env.GIT_WIKI_PATH ?? ""
  }`;

  const authorizationCommandLineArgs = (patValueIn?: string) => [
    "-c",
    `http.extraheader="Authorization: Basic ${patValueIn ?? pat}"`,
  ];

  const buildArgs = (args: string[]): string[] => {
    return [gitExecutable].concat(authorizationCommandLineArgs()).concat(args);
  };

  const commandLineArgs = {
    clone: buildArgs(["clone", repo, tempWikiLocation]),
    diff: buildArgs(["diff", "origin/wikiMaster"]),
    fetch: buildArgs(["fetch"]),
    pull: buildArgs(["pull"]),
  };

  const commandLine = {
    clone: commandLineArgs.clone.join(" "),
    diff: commandLineArgs.diff.join(" "),
    fetch: commandLineArgs.fetch.join(" "),
    pull: commandLineArgs.pull.join(" "),
  };

  const cwd = {
    clone: tempRoot,
    diff: tempWikiLocation,
    fetch: tempWikiLocation,
    pull: tempWikiLocation,
  };

  const sanitizedExec = (command: string, cwd?: string): string | null => {
    const filter = ";$%\n";

    // Do not allow
    for (let i = 0; i < command.length; ++i) {
      if (filter.indexOf(command.substring(i, i + 1)) !== -1) {
        return null;
      }
    }

    return child_process.execSync(command, { cwd }).toString("utf-8");
  };

  const clone = async (): Promise<string | null> => {
    sanitizedExec(commandLine.clone, cwd.clone);
    return Promise.resolve(readWikiFile());
  };

  const hasChanges = async (): Promise<boolean> => {
    if (fs.existsSync(tempWikiLocation)) {
      await sanitizedExec(commandLine.fetch, cwd.fetch);
      const logDifferences = await sanitizedExec(commandLine.diff, cwd.diff);
      return Promise.resolve(
        logDifferences !== null && logDifferences.length > 0
      );
    }
    return Promise.resolve(false);
  };

  const pull = async (): Promise<string | null> => {
    return Promise.resolve(sanitizedExec(commandLine.pull, cwd.pull));
  };

  const readWikiFile = (): string => {
    return fs.readFileSync(wikiFileLocation).toString("utf8");
  };

  export const cloneOrUpdate = async (): Promise<{
    contents: string;
    firstTimeClone?: boolean;
    update?: boolean;
  }> => {
    if (fs.existsSync(tempWikiLocation)) {
      let update = false;
      if (await hasChanges()) {
        await pull();
        update = true;
      }

      return new Promise((resolve) => {
        resolve({
          firstTimeClone: false,
          update,
          contents: readWikiFile(),
        });
      });
    } else {
      return Promise.resolve({
        firstTimeClone: true,
        update: true,
        contents: (await clone()) ?? "",
      });
    }
  };
}
