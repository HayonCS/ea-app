// This import is JS because we can't export the worker function correctly when using ES modules
// const { ALL_JOBS } = require("domain-services");

const { Context } = require("context");
const {
  makeJobProcessorFunction,
} = require("atomic-object/jobs/processing-function");
const { BullJobRunner } = require("atomic-object/jobs/bull-runner");
const Logger = require("atomic-object/logger");
const myConfig = require("config");
const ErrorNotifier = require("atomic-object/error-notifier");

const runner = new BullJobRunner(myConfig.get("redis.prefix"));

console.info("Loaded main queue worker");

// Setup Rollbar for jobs
ErrorNotifier.setup(myConfig.get("rollbar.serverAccessToken"));

module.exports = makeJobProcessorFunction({
  buildLogger: (job: { data: { type: string }; id: string }) =>
    Logger.makeDecoratedLogger(Logger.Logger, (message: { message: string }) =>
      Object.assign(message, {
        backgroundJobName: job.data.type,
        backgroundJobId: job.id,
      })
    ),
  buildContext: (opts: { logger: any }) =>
    new Context({
      // giving the worker a JobRunner so that jobs may queue jobs
      jobs: runner,
      ...opts,
    }),
  // jobs: ALL_JOBS.filter((job: any) => job.queue === "main"),
});
