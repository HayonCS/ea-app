import * as Hexagonal from "atomic-object/hexagonal";
import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { SchemaLink } from "@apollo/link-schema";

import { ApolloClientPort } from "./ports";
const { ClientSideResolvers } = require("client/graphql/resolvers");
const { executableSchema } = require("graphql-api");
const introspectionQueryResultData = require("client/graphql/introspection-result.gen.json");

export const ApolloClientStatePort = Hexagonal.port<
  unknown,
  "apollo client state"
>("apollo client state");

export const apolloClientAdapter = Hexagonal.adapter({
  port: ApolloClientPort,
  requires: [ApolloClientStatePort],
  build: (ctx) => {
    const apolloCache = new InMemoryCache({
      possibleTypes: introspectionQueryResultData.possibleTypes,
    });
    const apolloClient = new ApolloClient({
      ssrMode: true,
      cache: apolloCache,
      link: ApolloLink.from([
        new SchemaLink({
          schema: executableSchema,
          context: ctx,
        }),
      ]),
      resolvers: ClientSideResolvers as any,
    });

    // apolloCache.writeData({
    //   data: ctx.get(ApolloClientStatePort) || {},
    // });
    return apolloClient;
  },
});
