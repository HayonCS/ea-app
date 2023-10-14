import * as GraphQL from "graphql-api/server-types.gen";
import { UserAppDataPort } from "domain-services/user-app-data/port";

const mutationResolvers: GraphQL.MutationResolvers = {
  setUserAppData: async (parent, args, ctx): Promise<boolean> => {
    const result = await ctx
      .get(UserAppDataPort)
      .setUserAppData(args.userId, args.appData);

    return result;
  },
};

export default mutationResolvers;
