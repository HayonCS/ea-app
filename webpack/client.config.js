const config = require("config");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const loaders = require("./loaders");
const monacoLoader = require("../webpack/monaco-loader");
// const fs = require("fs");
var ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const DEV_PORT = config.get("webpackDevServer.port");

const PROXY_HOST = config.get("server.apiHost");

// const declarationContents = fs.readFileSync(
//   path.resolve(__dirname, "../modules/client/texteditor/declarations.ts"),
//   "utf8",
//   () => {}
// );

const SSL_ENABLED = `${config.get("server.sslEnabled")}`.trim() === "true";
const WEB_ID = `${config.get("server.webId")}`.trim();
const HTTP = SSL_ENABLED ? "https" : "http";

const Proxy = (pathIn) => {
  pathIn;
  return {
    target: `${HTTP}://${PROXY_HOST}`,
    secure: false,
  };
};

////////////////////////////////////////////////////////////////////////////////
// per-environment plugins
const environmentPlugins = (() => {
  if (config.get("minify")) {
    return [
      new CompressionPlugin({
        algorithm: "gzip",
        test: /\.(js|html|css)$/,
        threshold: 10240,
        minRatio: 0.8,
      }),
    ];
  }

  switch (process.env.NODE_ENV) {
    case "development":
      return [
        // Hot reloading is set up in webpack-dev-server.js
      ];

    default:
      return [];
  }
})();

const prod = config.get("minify");
module.exports = {
  mode: prod ? "production" : "development",
  entry: {
    app: [
      "whatwg-fetch",
      // "core-js/es/object",
      // "core-js/es/array",
      // "core-js/es/symbol",
      // "core-js/es/promise",
      // "core-js/es/map",
      // "core-js/es/set",
      "./entry/client.tsx",
    ],
  },

  optimization: config.get("minify")
    ? {
        splitChunks: {
          chunks: "all",
        },
      }
    : undefined,

  performance: {
    assetFilter(filename) {
      // Don't size test uncompressed javascript - we just care about the .js.gz files
      return !/\.(js|map)$/.test(filename);
    },
  },

  devtool: prod ? false : "eval-cheap-module-source-map",

  // https://github.com/TypeStrong/ts-loader#transpileonly-boolean-defaultfalseO
  stats: {
    warningsFilter: [
      /export .* was not found in/,
      "./node_modules/config/lib/config.js",
    ],
  },

  node: {
    fs: "empty",
  },

  plugins: [
    // Define environment variables in the client to instrument behavior.
    // Note that when webpack uses this config on DevOps it will NOT have access to the same environment variables as the Node server running on the deployed endpoint.
    // Therefore, this configuration CANNOT be used to provide client components with direct access to server side environment variables.
    // Instead, limit these definitions to static content or to settings used during development or testing.
    // If necessary, you can set ENV layers in the `/home/dev/app/docker/deployment/prod/Dockerfile` that will get picked up by `yarn build` when the deployed image is built.
    // Alternatively, consider using the `GetServerInfo.graphql` query from the client or expanding that schema to provide access to more server side information.
    new webpack.DefinePlugin({
      __TEST__: "false",

      // Allow switching on NODE_ENV in client code
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),

      // Special login component when using local auth
      "process.env.AUTH_LOCAL": JSON.stringify(process.env.AUTH_LOCAL),

      // Display a different look depending on which endpoint the app is running from
      "process.env.APP_ENDPOINT": JSON.stringify(process.env.APP_ENDPOINT),

      // Replace the declaration contents for the text editor.
      // "process.env.TPE_DECLARATIONS": JSON.stringify(declarationContents),

      // Tell the client if we are in end to end testing mode
      "process.env.E2E_MODE": JSON.stringify(process.env.E2E_MODE),

      // The HTTP port the app is bound to
      "process.env.PORT": JSON.stringify(process.env.PORT),

      // Used for websockets
      "process.env.SSL_ENABLED": JSON.stringify(SSL_ENABLED),

      // Used for Test Plan Execution mode
      "process.env.WEB_ID": JSON.stringify(WEB_ID),

      // Error tracking and debugging
      "process.env.ROLLBAR_CLIENT_ACCESS_TOKEN": JSON.stringify(
        config.get("rollbar.clientAccessToken")
      ),
    }),

    // Process index.html and insert script and stylesheet tags for us.
    new HtmlWebpackPlugin({
      template: "./entry/index.html",
      inject: "body",
      favicon: "./modules/client/icons/favicon-32x32.png",
    }),

    // Don't proceed in generating code if there are errors
    new webpack.NoEmitOnErrorsPlugin(),

    // Extract embedded css into a file
    new ExtractTextPlugin(
      config.get("minify") ? "[name].[chunkhash].css" : "[name].css"
    ),

    // Show a nice progress bar on the console.
    new ProgressBarPlugin({
      clear: false,
    }),

    new ForkTsCheckerWebpackPlugin({
      // https://github.com/Realytics/fork-ts-checker-webpack-plugin#options
      useTypescriptIncrementalApi: true,
    }),

    monacoLoader.plugin,

    ...(process.env.ANALYZE
      ? [new (require("webpack-bundle-analyzer").BundleAnalyzerPlugin)()]
      : []),
  ].concat(environmentPlugins),

  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/",
    filename: config.get("minify") ? "client.[chunkhash].js" : "client.js",
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    modules: [path.resolve(__dirname, "../modules"), "node_modules"],
    alias: {
      // "config": path.resolve(__dirname, "../node_modules/config/lib/config.js"),
      // "config": "config/lib/config.js",
      "@material-ui/core": "@material-ui/core/es",
      "react-dnd": path.resolve(__dirname, "../node_modules/react-dnd"),
    },
  },

  module: {
    rules: [
      loaders.worker,
      loaders.clientSideTypeScript,
      loaders.graphql,
      loaders.scss,
    ].concat(loaders.allImagesAndFontsArray),
    exprContextRegExp: /$^/,
    exprContextCritical: false,
  },

  devServer: {
    devMiddleware: {
      publicPath: "/",
      stats: "errors-only",
    },
    port: DEV_PORT,
    hot: false,
    historyApiFallback: true,
    host: config.get("webpackDevServer.host"),
    https: SSL_ENABLED,
    proxy: {
      "/graphql/*": Proxy("/graphql/*"),
      "/graphiql/*": Proxy("/graphiql/*"),
      "/auth/*": Proxy("/auth/*"),
      "/arena/*": Proxy("/arena/*"),
      "/api/*": Proxy("/api/*"),
      "/socket.io/*": Proxy("/socket.io/*"),
    },
  },
};
