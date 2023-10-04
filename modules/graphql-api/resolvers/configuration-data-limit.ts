import {
  ConfigurationDataLimitResolvers,
  SpecLimit,
} from "graphql-api/server-types.gen";

export type MinimalSpecLimit = SpecLimit;

export const ConfigurationDataLimitResolver: ConfigurationDataLimitResolvers = {
  __resolveType: (parent) => {
    return parent.type;
  },
};

export default ConfigurationDataLimitResolver;
