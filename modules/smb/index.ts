import * as Hexagonal from "atomic-object/hexagonal";
import * as _ from "lodash-es";

import { SmbClientOptions } from "./util";
import { SmbPort } from "./port";
import { Readable } from "stream";

const SMB2 = require("@marsaud/smb2");
interface SMB2Readable extends Readable {
  fileSize: number;
}

const config = require("config");

export type SMB = {
  open: (shareName: SmbShareName) => Promise<SmbShare>;
};

export type SmbShare = {
  readFile: (filePath: string) => Promise<string | Buffer>;
  readDir: (dirPath: string) => Promise<string[]>;
  writeFile: (filePath: string, fileContents: string) => Promise<void>;
  makeDir: (dirPath: string) => Promise<void>;
  removeDir: (dirPath: string) => Promise<void>;
  removeFile: (filePath: string) => Promise<void>;
  exists: (p: string) => Promise<boolean>;
  close: () => Promise<void>;
};

export type SmbShareName = "VersionedLibraries";

const shares: {
  [k: string]: {
    share: string;
    smbOptions: Pick<SmbClientOptions, "username" | "password" | "domain">;
  };
} = {
  VersionedLibraries: {
    share: config.smb.versionedLibraries.share,
    smbOptions: {
      username: config.smb.versionedLibraries.username,
      password: config.smb.versionedLibraries.password,
      domain: config.smb.versionedLibraries.domain,
    },
  },
};

export const smbAdapter = Hexagonal.adapter({
  port: SmbPort,
  build: () => {
    return {
      open: async (shareName: SmbShareName) => {
        if (!shares[shareName]) {
          throw new Error("Invalid SMB repository");
        }

        const share = shares[shareName].share;

        const username = shares[shareName].smbOptions.username;
        const password = shares[shareName].smbOptions.password;
        const domain = shares[shareName].smbOptions.domain;

        const smb2Client = new SMB2({
          share: share,
          domain: domain,
          username: username,
          password: password,
        });

        return {
          readFile: (filePath: string) => {
            return new Promise<string | Buffer>((resolve, reject) => {
              smb2Client.createReadStream(filePath, function (
                err: Error,
                readStream: SMB2Readable
              ) {
                if (err) {
                  reject(err);
                }

                if (readStream) {
                  var string = "";

                  readStream.setEncoding("utf8");
                  readStream.on("data", function (chunk: string) {
                    string += chunk.toString();
                  });
                  readStream.on("end", function () {
                    if (0 !== string.length) {
                      resolve(string);
                    } else {
                      reject(Error("0 length file size"));
                    }
                  });

                  readStream.on("error", function (err: Error) {
                    if (0 !== string.length) {
                      smb2Client.getSize(
                        filePath,
                        (sizeErr: Error, theSize: number) => {
                          if (theSize != string.length) {
                            const errString = err ? err.toString() : "";
                            reject(
                              new Error(
                                `Did not read all the bytes. Actual: ${theSize} Received: ${string.length} ` +
                                  errString
                              )
                            );
                          } else {
                            resolve(string);
                          }
                        }
                      );
                    } else {
                      reject(err);
                    }
                  });
                }
              });
            });
          },

          readDir: (dirPath: string) => {
            return new Promise<string[]>((resolve, reject) => {
              return smb2Client.readdir(dirPath, function (
                err: Error,
                data: string[]
              ) {
                if (err) {
                  console.error("readDir", dirPath, err.toString());
                  reject(err);
                  return;
                }
                resolve(_.orderBy(data));
              });
            });
          },

          writeFile: (filePath: string, fileContents: string) => {
            return new Promise<void>((resolve, reject) => {
              smb2Client.writeFile(
                filePath,
                fileContents,
                (err: string | Error | undefined) => {
                  if (err) {
                    console.error("writeFile", filePath, err.toString());
                    reject(err);
                  } else {
                    resolve();
                  }
                }
              );
            });
          },

          makeDir: (dirPath: string) => {
            return new Promise<void>((resolve, reject) => {
              smb2Client.mkdir(dirPath, (err: string | Error | undefined) => {
                if (err) {
                  console.error("makeDir", dirPath, err.toString());
                  reject(err);
                } else {
                  resolve();
                }
              });
            });
          },

          removeDir: (dirPath: string) => {
            return new Promise<void>((resolve, reject) => {
              smb2Client.rmdir(dirPath, (err: string | Error | undefined) => {
                if (err) {
                  console.error("removeDir", dirPath, err.toString());
                  reject(err);
                } else {
                  resolve();
                }
              });
            });
          },

          removeFile: (filePath: string) => {
            return new Promise<void>((resolve, reject) => {
              smb2Client.unlink(filePath, (err: string | Error | undefined) => {
                if (err) {
                  console.error("removeFile", filePath, err.toString());
                  reject(err);
                } else {
                  resolve();
                }
              });
            });
          },

          exists: (path: string) => {
            return new Promise<boolean>((resolve, reject) => {
              smb2Client.exists(path, function (err: Error, exists: boolean) {
                if (err) {
                  console.error("exists", path, err.toString());
                  reject(err);
                }
                resolve(exists);
              });
            });
          },

          close: async () => {
            smb2Client.disconnect();
          },
        };
      },
    };
  },
});
