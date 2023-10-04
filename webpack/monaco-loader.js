const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  plugin: new MonacoWebpackPlugin({
    languages: ["javascript", "typescript"],
  }),
};
