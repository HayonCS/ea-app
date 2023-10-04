module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  ignorePatterns: ["*.gen.ts", "*.gen.tsx", "*.d.ts", "*-type-test.ts"],
  extends: [
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:react/recommended",
    "prettier",
    "prettier/@typescript-eslint",
    "plugin:react-hooks/recommended",
    "plugin:testing-library/react",
    "plugin:jest-dom/recommended",
  ],
  globals: {
    __TEST__: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: [
    "react",
    "react-hooks",
    "jest",
    "@typescript-eslint",
    "testing-library",
    "jest-dom",
  ],
  overrides: [
    {
      files: ["*.test.ts", "*.stories.tsx"],
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "no-console": "off",
      },
    },
  ],
  rules: {
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-for-in-array": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "handle-callback-err": "error",
    "import/order": "off",
    "no-console": ["error", { allow: ["error", "warn", "info"] }],
    "no-constant-condition": "error",
    "no-fallthrough": "error",
    "no-irregular-whitespace": "error",
    "no-multiple-empty-lines": "error",
    "no-restricted-imports": ["error", "lodash"],
    "no-unused-vars": 0,
    "react-hooks/rules-of-hooks": "error",
    "react/jsx-key": "error",
    "react/prop-types": 0,
    "no-async-promise-executor": 0,
    "@typescript-eslint/no-inferrable-types": 0,
    curly: ["error", "multi-line"],
    "@typescript-eslint/consistent-type-assertions": "warn",
    "@typescript-eslint/no-empty-interface": "warn",
    "no-case-declarations": "warn",
    "no-empty": "warn",
    "no-prototype-builtins": "warn",
    "no-redeclare": "warn",
    "no-undef": "error",
    "no-unreachable": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "react/no-children-prop": "warn",
    "react/no-unescaped-entities": "warn",
    "react/display-name": "warn",
    "require-atomic-updates": "warn",
    "react/jsx-boolean-value": ["warn", "always"],
  },
};
