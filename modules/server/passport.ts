import * as passport from "passport";
import { jwtConfig } from "./jwt-config";
import {
  IVerifyOptions,
  Strategy as LocalStrategy,
  VerifyFunction,
} from "passport-local";
import {
  OIDCStrategy,
  IOIDCStrategyOptionWithoutRequest,
  IProfile,
  VerifyCallback,
} from "passport-azure-ad";
import {
  Strategy as JWTStrategy,
  StrategyOptions as JWTStrategyOptions,
  ExtractJwt,
} from "passport-jwt";
import { buildContext } from "./context";
import { isSavedUserRecord } from "core/auth";
import * as config from "config";
import * as db from "db";
import { notNilString } from "helpers/nil-helpers";
import { appKeyConfig, checkForAppKey } from "./app-key-config";

const useLocalAuth = process.env.AUTH_LOCAL === "true";

const rawAzureAdConfig =
  config.get<IOIDCStrategyOptionWithoutRequest>("auth.azureAD");

const azureAdConfig = {
  ...rawAzureAdConfig,
  scope:
    rawAzureAdConfig.scope !== undefined
      ? typeof rawAzureAdConfig.scope === "string"
        ? rawAzureAdConfig.scope.slice()
        : [...rawAzureAdConfig.scope]
      : undefined,
};

const ctxProd = buildContext({ db: db.getConnection("Production") });
const ctxEng = buildContext({ db: db.getConnection("Engineering") });

const validateGraphQLAuth: VerifyFunction = (
  user_name: string,
  app_specific_key: string,
  done: (error: any, user?: any, options?: IVerifyOptions) => void
): void => {
  try {
    void ctxProd.repos.users.findByUserName(user_name).then(
      (userRecord) => {
        if (!userRecord) {
          return done(`User not found: "${user_name}"`);
        }

        if (!userRecord.EmployeeNumber) {
          return done(`Inactive employee: "${user_name}"`);
        }

        if (!notNilString(app_specific_key)) {
          return done(`app_specific_key is nil`);
        }

        if (!notNilString(appKeyConfig.secret)) {
          return done(`app specific keys are missing on the server`);
        }

        if (!checkForAppKey(app_specific_key)) {
          return done(`Unknown app_specific_key: ${app_specific_key}`);
        }

        return done(null, { ...userRecord, AppKey: app_specific_key });
      },
      (error) => {
        done(`Not authorized: ${error}`);
      }
    );
  } catch (error) {
    done(`Not authorized: ${error}`);
  }
};

const createOrUpdateUser: VerifyFunction = (
  username: string,
  password: string,
  done: (error: any, user?: any, options?: IVerifyOptions) => void
): void => {
  try {
    ctxProd.mesSecurity.mesUserInfo(username).then(
      (mesUserResult) => {
        if (mesUserResult) {
          const employeeNumber = mesUserResult.employeeId;
          void ctxProd.employeeInfo.employeeInfo(employeeNumber).then(
            (employeeInfoResult) => {
              if (employeeInfoResult) {
                ctxProd.mesSecurity
                  .mesManagerInfo(mesUserResult.employeeId)
                  .then(
                    (managerResult) => {
                      if (managerResult) {
                        const updatedUserInfo = {
                          EMail: mesUserResult.emailAddress,
                          Name: mesUserResult.username,
                          Location: employeeInfoResult.location,
                          Manager:
                            managerResult.firstName +
                            " " +
                            managerResult.lastName,
                          Phone:
                            employeeInfoResult.cellPhone.trim() === ""
                              ? employeeInfoResult.workPhone
                              : employeeInfoResult.cellPhone,
                          ReadOnly: undefined,
                          EmployeeNumber: mesUserResult.employeeId,
                        };
                        void ctxProd.repos.users
                          .insertOrUpdate(updatedUserInfo)
                          .then(
                            () => {
                              void ctxEng.repos.users
                                .insertOrUpdate(updatedUserInfo)
                                .then(
                                  (user) => {
                                    done(null, user);
                                  },
                                  (error) => {
                                    const errorMsg = `Error during ENG insertOrUpdate for user "${username}": ${error}`;
                                    done(errorMsg);
                                  }
                                );
                            },
                            (error) => {
                              const errorMsg = `Error during PROD insertOrUpdate for user "${username}": ${error}`;
                              done(errorMsg);
                            }
                          );
                      } else {
                        const errorMsg = `No manager found in mesSecurity.managerInfo for user ${username}`;
                        done(errorMsg);
                      }
                    },
                    (error) => {
                      const errorMsg = `Error while looking up manager in mesSecurity.managerInfo for user "${username}": ${error}`;
                      done(errorMsg);
                    }
                  );
              } else {
                const errorMsg = `User "${username}" not found in employeeInfo`;
                done(errorMsg);
              }
            },
            (error) => {
              const errorMsg = `Error while looking up user "${username}" in employeeInfo: ${error}`;
              done(errorMsg);
            }
          );
        } else {
          const errorMsg = `User "${username}" not found in mesSecurity.userInfo`;
          done(errorMsg);
        }
      },
      (error) => {
        const errorMsg = `Error while looking up user "${username}" in mesSecurity.userInfo: ${error}`;
        done(errorMsg);
      }
    );
  } catch (error) {
    const errorMsg = `Exception during createOrUpdateUser: ${error}`;
    done(errorMsg);
  }
};

const createOrUpdateUserFromMicrosoft: VerifyFunction = (
  email: string,
  password: string,
  done: (error: any, email?: any, options?: IVerifyOptions) => void
): void => {
  try {
    const employeeEmail = email;
    void ctxProd.employeeInfo
      .employeeInfo(employeeEmail)
      .then(
        (employeeInfoResult) => {
          if (employeeInfoResult) {
            ctxProd.mesSecurity
              .mesManagerInfo(employeeInfoResult.employeeNumber.toString())
              .then(
                (managerResult) => {
                  if (managerResult) {
                    const updatedUserInfo = {
                      EMail: employeeEmail,
                      Name: employeeEmail.split("@")[0],
                      Location: employeeInfoResult.location,
                      Manager:
                        managerResult.firstName + " " + managerResult.lastName,
                      Phone:
                        employeeInfoResult.cellPhone.trim() === ""
                          ? employeeInfoResult.workPhone
                          : employeeInfoResult.cellPhone,
                      ReadOnly: undefined,
                      EmployeeNumber:
                        employeeInfoResult.employeeNumber.toString(),
                    };

                    void ctxProd.repos.users
                      .insertOrUpdate(updatedUserInfo)
                      .then(
                        () => {
                          void ctxEng.repos.users
                            .insertOrUpdate(updatedUserInfo)
                            .then(
                              (user) => {
                                done(null, user);
                              },
                              (error) => {
                                throw Error(
                                  `Error during ENG insertOrUpdate for user "${email}": ${error}`
                                );
                              }
                            )
                            .catch((errorMsg) => {
                              return done(errorMsg, null);
                            });
                        },
                        (error) => {
                          throw Error(
                            `Error during PROD insertOrUpdate for user "${email}": ${error}`
                          );
                        }
                      )
                      .catch((errorMsg) => {
                        return done(errorMsg, null);
                      });
                  } else {
                    throw Error(
                      `No manager found in mesSecurity.managerInfo for user ${email}`
                    );
                  }
                },
                (error) => {
                  throw Error(
                    `Error while looking up manager in mesSecurity.managerInfo for user "${email}": ${error}`
                  );
                }
              )
              .catch((errorMsg) => {
                return done(errorMsg, null);
              });
          } else {
            throw Error(`User "${email}" not found in employeeInfo`);
          }
        },
        (error) => {
          throw Error(
            `Error while looking up user "${email}" in employeeInfo: ${error}`
          );
        }
      )
      .catch((errorMsg) => {
        return done(errorMsg, null);
      });
  } catch (error) {
    const errorMsg = Error(
      `Exception during createOrUpdateUserFromMicrosoft: ${error}`
    );
    return done(errorMsg, null);
  }
};

//Local Authentication
if (useLocalAuth) {
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "username", passwordField: "username", session: false },
      (
        username: string,
        password: string,
        done: (error: any, user?: any, options?: IVerifyOptions) => void
      ) => createOrUpdateUser(username, password, done)
    )
  );
} else {
  //Microsoft Authentication
  passport.use(
    "login",
    new OIDCStrategy(
      azureAdConfig,
      (profile: IProfile, done: VerifyCallback) => {
        if (!profile.oid) {
          const error = new Error("No oid found");
          return done(error, null);
        }

        return createOrUpdateUserFromMicrosoft(
          profile._json.preferred_username, //Email user@gentex.com
          "",
          done
        );
      }
    )
  );
}

const opts: JWTStrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtConfig.secret,
};

//Cached Authentication
passport.use(
  "jwt",
  new JWTStrategy(opts, (jwtPayload, done) => {
    if (!isSavedUserRecord(jwtPayload)) {
      const errorMsg = `jwtPayload is not a saved user record`;
      return done(errorMsg);
    }

    return done(null, jwtPayload);
  })
);

//GraphQL Authorization
passport.use(
  "graphql",
  new LocalStrategy(
    {
      usernameField: "user_name",
      passwordField: "app_specific_key",
      session: false,
    },
    (
      user_name: string,
      app_specific_key: string,
      done: (error: any, user?: any, options?: IVerifyOptions) => void
    ) => validateGraphQLAuth(user_name, app_specific_key, done)
  )
);
