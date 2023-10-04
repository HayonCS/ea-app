const config = require("config");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");
const loaders = require("./loaders");
const fs = require("fs");

var ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const scriptsDir = path.join(__dirname, "../entry/scripts");

/** A map of of entry points for every file in scripts */
const scriptEntry = fs
  .readdirSync(scriptsDir)
  .filter((f) => /\.tsx?$/.test(f))
  .filter((f) => fs.statSync(path.join(scriptsDir, f)).isFile())
  .reduce((o, f) => {
    o[`scripts/${f.replace(/\.tsx?$/, "")}`] = path.resolve(
      path.join(scriptsDir, f)
    );
    return o;
  }, {});

const entry = Object.assign(
  {
    server: "./entry/server.ts",
  },
  scriptEntry
);
console.info(entry);

const prod = config.get("minify");
module.exports = {
  entry: entry,
  mode: prod ? "production" : "development",
  target: "node",

  devtool: "inline-source-map",
  optimization: {
    // Don't turn process.env.NODE_ENV into a compile-time constant
    nodeEnv: false,
  },
  context: `${__dirname}/../`,

  node: {
    __dirname: false,
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].js",
    devtoolModuleFilenameTemplate: "[absolute-resource-path]",
    libraryTarget: "commonjs2",
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    modules: [path.resolve(__dirname, "../modules"), "node_modules"],
  },

  externals: [
    nodeExternals({
      allowlist: [/^lodash-es/],
    }),
  ],
  module: {
    rules: [loaders.typescript, loaders.graphql],
  },

  // https://github.com/TypeStrong/ts-loader#transpileonly-boolean-defaultfalseO
  stats: {
    warningsFilter: /export .* was not found in/,
  },

  plugins: [
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false,
    }),

    new webpack.DefinePlugin({
      __TEST__: "false",
    }),

    new ForkTsCheckerWebpackPlugin({
      // https://github.com/Realytics/fork-ts-checker-webpack-plugin#options
      useTypescriptIncrementalApi: true,
    }),
  ],
};
