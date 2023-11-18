module.exports = {
  minify: true,
  server: {
    cluster: true,
    graphiql: process.env.APP_ENDPOINT === "prod" ? false : true,
  },
};
