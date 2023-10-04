process.env.NODE_ENV = "test";

module.exports = {
  transform: {
    "\\.(js|jsx|ts|tsx)$": "ts-jest",
    "\\.(gql|graphql)$": "jest-transform-graphql",
  },
  transformIgnorePatterns: [
    "node_modules\\/(?!(lodash-es|react-apollo|react-monaco-editor|monaco-editor)\\/)",
  ],
  testMatch: null, // override the testMatch inherited from ts-jest, in order to avoid conflicting with testRegex: https://kulshekhar.github.io/ts-jest/user/config/#basic-usage
  testRegex: "modules/.*\\.test\\.(ts|tsx)$",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
  moduleDirectories: ["modules", "node_modules"],
  // Need to figure out a better way to reference global setup/teardown.
  // (reading files out of dist means that we have to explicitly build before we can test)
  // https://github.com/facebook/jest/issues/5164#issuecomment-376006851
  globalSetup: "./dist/scripts/unit-test-before-all.js",
  globals: {
    __TEST__: true,
    "ts-jest": {
      isolatedModules: true,
      babelConfig: false,
      diagnostics: {
        ignoreCodes: [151001],
      },
    },
  },
  reporters: [
    "default",
    [
      "jest-junit",
      {
        classNameTemplate: "{classname}",
        titleTemplate: "{title}",
        addFileAttribute: "true",
      },
    ],
  ],

  setupFiles: ["jest-canvas-mock"],
};
