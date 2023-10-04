import * as AuthRoutes from "client/auth/authentication-routes";
import * as ErrorNotifier from "atomic-object/error-notifier";
import * as _ from "lodash-es";
import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as config from "config";
//import * as db from "../db";
import * as express from "express";
import * as jwt from "jsonwebtoken";
import * as passport from "passport";
import * as cors from "cors";
import * as cookieParser from "cookie-parser";
import * as morgan from "morgan";

import { GraphQLError, formatError } from "graphql";
import { graphiqlExpress, graphqlExpress } from "graphql-server-express";

import { SubscriptionServer } from "subscriptions-transport-ws";

import { Context } from "context";
import { Logger } from "atomic-object/logger";
import { executableSchema } from "graphql-api";
import { execute, subscribe } from "graphql";
import { jwtConfig } from "./jwt-config";
import { isSavedUserRecord, isSavedUserRecordAndAppKey } from "core/auth";
import { checkForAppKey } from "./app-key-config";

require("./passport");

ErrorNotifier.setup(config.get("rollbar.serverAccessToken"));

const Arena = require("bull-arena");
//const knex = db.getConnection();
//const knexLogger = require("knex-logger");
const enforce = require("express-sslify");
const expressStaticGzip = require("express-static-gzip");
const cookieSession = require("cookie-session");

let app = express();

export const port = config.get<number>("server.port");
const fs = require("fs");
const http = require("http");
const https = require("https");

//
// sslConfiguration
//
// Keep track of valuable ssl information about the keys/certificates and whether
// or not we are using ssl.
//
const sslConfiguration = {
  enabled: config.get<boolean>("server.sslEnabled"),
  sslKeyFile: config.get<string>("server.sslKeyFile"),
  sslCertFile: config.get<string>("server.sslCertFile"),
  httpServer: config.get<boolean>("server.sslEnabled") ? https : http,
};

//
// credentials
//
// This object can be provided to https during the server creation.
const credentials = {
  key: sslConfiguration.enabled
    ? fs.readFileSync(sslConfiguration.sslKeyFile)
    : "",
  cert: sslConfiguration.enabled
    ? fs.readFileSync(sslConfiguration.sslCertFile)
    : "",
};

export function startServer() {
  app.use(cors());
  app.use(cookieParser());
  app.use(
    bodyParser.json({
      limit: "50mb",
    })
  );
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(
    cookieSession({
      name: "session",
      secret: config.get<string>("server.secret"),
    })
  );

  // Logging
  app.use((req: any, res: any, next: any) => {
    morgan("short");
    return next();
  });
  //app.use(knexLogger(knex));

  if (sslConfiguration.enabled) {
    app.use(
      enforce.HTTPS({
        trustProtoHeader: true,
      })
    );
  }

  // Gzip support
  app.use(compression());

  app.use(passport.initialize());

  app.post(AuthRoutes.LOGOUT, (req, res) => {
    req.logout(() => {});
    res.status(200).json({
      success: true,
      cookieClear: true,
    });
    res.clearCookie("app-jwt-cookie");
  });

  app.get(
    AuthRoutes.LOGIN,
    passport.authenticate("login", { session: false }),
    (req, res) => {
      if (req.user) {
        res.status(200).json({
          auth: true,
          token: jwt.sign(req.user, jwtConfig.secret),
        });
      } else {
        res.status(401).json({ auth: false, reason: "User does not exist" });
      }
    }
  );

  app.post(
    AuthRoutes.LOGIN,
    passport.authenticate("login", { session: false }),
    (req, res) => {
      if (req.user) {
        res.status(200).json({
          auth: true,
          token: jwt.sign(req.user, jwtConfig.secret),
        });
      } else {
        res.status(401).json({ auth: false, reason: "User does not exist" });
      }
    }
  );

  app.post(
    AuthRoutes.CALLBACK,
    passport.authenticate("login", {
      session: false,
      failureRedirect: "/login",
    }),
    (req, res) => {
      if (req.user) {
        res.cookie("app-jwt-cookie", jwt.sign(req.user, jwtConfig.secret));
        res.redirect("/");
      } else {
        res.status(401).json({ auth: false, reason: "User does not exist" });
      }
    }
  );

  app.get(
    AuthRoutes.CHECK_AUTH,
    passport.authenticate("jwt", { session: false })
  );

  app.use(
    "/arena",
    new Arena(
      {
        queues: [
          {
            name: "main",
            prefix: config.get("redis.prefix"),
            hostId: "redis",
            redis: config.get("redis.url"),
          },
        ],
      },
      {
        // Make the arena dashboard become available at {my-site.com}/arena.
        // basePath: "/arena",

        // Let express handle the listening.
        disableListen: true,
      }
    )
  );

  // GraphQL
  app.post(
    AuthRoutes.GRAPHQL_AUTH,
    passport.authenticate("graphql", { session: false }),
    (req, res) => {
      if (req.user) {
        res.status(200).json({
          auth: true,
          token: jwt.sign(req.user, jwtConfig.secret, { expiresIn: "1d" }),
        });
      } else {
        res.status(401).json({ auth: false, reason: "GraphQL auth failed" });
      }
    }
  );

  app.use(
    "/graphql",
    bodyParser.json(),
    passport.authenticate("jwt", { session: false }),
    graphqlExpress((req) => {
      let userNameForContext: string | undefined = undefined;
      let appKeyForContext: string | undefined = undefined;

      if (req) {
        const headerToken = req.headers.authorization;
        if (!headerToken) {
          throw new Error("Not authorized for graphql queries: Missing token.");
        }

        const decoded = jwt.verify(
          headerToken.replace("Bearer ", ""),
          jwtConfig.secret
        );

        if (!decoded) {
          throw new Error(
            "Not authorized for graphql queries: Token could not be decoded."
          );
        }

        if (!isSavedUserRecord(decoded)) {
          throw new Error(
            "Not authorized for graphql queries: Token is not a user record."
          );
        }

        userNameForContext = _.get(decoded, "Name", undefined);
        if (!userNameForContext) {
          throw new Error(
            "Not authorized for graphql queries: User name not provided in token."
          );
        }

        //Check the app specific key (for clients who authenticated against the /auth/graphql endpoint)
        if (isSavedUserRecordAndAppKey(decoded)) {
          const app_specific_key = _.get(decoded, "AppKey", undefined);
          if (!app_specific_key) {
            throw new Error(
              "Not authorized for graphql queries: App key not provided in token."
            );
          }

          if (!checkForAppKey(app_specific_key)) {
            throw new Error(
              `Not authorized for graphql queries: Unknown app key: "${app_specific_key}".`
            );
          }

          appKeyForContext = app_specific_key;

          //Check for token expiration
          const tokenIssuedDate = _.get(decoded, "iat", undefined);
          if (!tokenIssuedDate) {
            throw new Error(
              "Not authorized for graphql queries: Issued at time not provided in token."
            );
          }

          const tokenExpirationDate = _.get(decoded, "exp", undefined);
          if (!tokenExpirationDate) {
            throw new Error(
              "Not authorized for graphql queries: Expiration time not provided in token."
            );
          }
        }

        //Make sure the user is an active Gentex employee
        const employeeNumber = _.get(decoded, "EmployeeNumber", undefined);
        if (!employeeNumber) {
          throw new Error(
            `Not authorized for graphql queries: User "${userNameForContext}" is an inactive Gentex employee.`
          );
        }

        //Prevent read only users from running mutations
        const isUserReadOnly = _.get(decoded, "ReadOnly", true);
        if (isUserReadOnly) {
          const reqBody: string | undefined = _.get(
            req,
            "body.query",
            undefined
          );
          if (!reqBody) {
            throw new Error(
              "Not authorized for graphql queries: Request body is missing."
            );
          }

          const requestCheck = reqBody.toLowerCase();
          if (
            requestCheck.includes("mutation") &&
            !requestCheck.includes("introspectionquery")
          ) {
            throw new Error(
              `Not authorized for graphql mutations: User "${userNameForContext}" has read only permissions in the Test Plan database.`
            );
          }
        }
      }

      return {
        schema: executableSchema,
        context: new Context({
          userName: userNameForContext, //userName must be provided for use by the graphql-api resolvers
          appKey: appKeyForContext, //appKey must be provided for logging which application performed a mutation
        }),
        formatError: (e: GraphQLError) => {
          Logger.error(e);
          return formatError(e);
        },
      };
    })
  );

  // GraphQL web IDE
  if (config.get("server.graphiql")) {
    app.use(
      "/graphiql",
      graphiqlExpress({
        endpointURL: "/graphiql-graphql",
      })
    );

    app.use(
      "/graphiql-graphql",
      bodyParser.json(),
      graphqlExpress((req) => {
        return {
          schema: executableSchema,
          context: new Context({
            userName: _.get(req, "user.Name", "graphiql_user"),
            appKey: _.get(req, "user.AppKey", "GraphiQL_Web_IDE"),
          }),
          formatError: (e: GraphQLError) => {
            Logger.error(e);
            return formatError(e);
          },
        };
      })
    );
  }

  // Static assets
  app.use(expressStaticGzip("./dist/"));
  app.use(express.static("./dist/"));

  // Serve index.html for all unknown URLs
  app.get("/*", function (req, res) {
    res.sendFile(process.cwd() + "/dist/index.html");
  });

  const CreateHttpsServer = () => {
    return https.createServer(credentials, app).listen(port, () => {
      console.info(`[HTTPS] Server Start on port ${port}.`);
    });
  };

  const CreateHttpServer = () => {
    return http.createServer(app).listen(port, () => {
      console.info(`[HTTP] Server Start on port ${port}.`);
    });
  };

  const server = sslConfiguration.enabled
    ? CreateHttpsServer()
    : CreateHttpServer();

  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema: executableSchema,
    },
    {
      server,
      path: "/subscriptions",
    }
  );

  return server;
}
