process.env.NODE_ENV = "test";

const defaultConfig = require("./jest.config.js");

module.exports = {
  ...defaultConfig,
  testEnvironment: "node",
  testRegex: "modules/.*\\.spec\\.(ts|tsx)$",
};
