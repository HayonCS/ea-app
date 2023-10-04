import {
  ConfigurationDataGlobalVariable,
  ConfigurationDataLocalVariable,
  PartNumberConfigurationData,
  SpecLimit,
  StationConfigurationData,
  TestPlanConfigurationData,
} from "graphql-api/server-types.gen";

export type MinimalTestPlanConfigurationData = Pick<
  TestPlanConfigurationData,
  "name"
>;
export type MinimalStationConfigurationData = StationConfigurationData;
export type MinimalPartNumberConfigurationData = PartNumberConfigurationData;

export type MinimalConfigurationDataGlobalVariable = ConfigurationDataGlobalVariable;
export type MinimalConfigurationDataLocalVariable = ConfigurationDataLocalVariable;
export type MinimalSpecLimit = SpecLimit;
