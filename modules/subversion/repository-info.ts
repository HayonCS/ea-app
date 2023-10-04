import { SvnCheckoutOptions } from "subversion/util";

const config = require("config");

export const svnRepositoryInfo: {
  baseUrl: string;
  repoName: string;
  svnOptions: Pick<SvnCheckoutOptions, "username" | "password">;
} = {
  baseUrl: `${config.subversion.baseUrl}`,
  repoName: `${config.subversion.repoName}`,
  svnOptions: {
    username: config.subversion.username,
    password: config.subversion.password,
  },
};
