import { getRedisPubConnection } from "db/redis";
import { ExecutionUtils } from "domain-services/execution-data/ExecutionUtils";
import { StationWatcherHandlers } from "domain-services/execution-stationwatcher/StationWatcherHandlers";
import { EventEmitter } from "events";
import {
  StationWatcherMessage,
  TestStationMessage,
} from "graphql-api/server-types.gen";
import { PubSub } from "graphql-subscriptions";
import { TestStationManager } from "./TestStationManager";
import { TestStationUtils } from "./TestStationUtils";

export namespace TestStationHandlers {
  /**
   * s_customEventEmitter (PRIVATE)
   * --------------------
   *
   * This is required so that the number of max connections can be expanded.
   */
  const s_customEventEmitter: EventEmitter = ((): EventEmitter => {
    let em = new EventEmitter();
    em.setMaxListeners(50);
    return em;
  })();

  /**
   * s_testStationPubSub (PRIVATE)
   * ----------------------
   *
   * Custom pubsub object for subscribers listening for changes to a specific
   * station watcher.
   */
  const s_testStationPubSub = new PubSub({
    eventEmitter: s_customEventEmitter,
  });

  /**
   * Subscribe to all StationWatchers that are currently running.
   *
   * @param computerName The name of the computer currently running the station watcher.
   * @param stationName The name of the station.
   *
   * @returns an async iterator that's used for posting subscribed messages.
   */
  export const Subscribe = (computerName: string, stationName: string) => {
    return s_testStationPubSub.asyncIterator(
      TestStationUtils.Key(computerName, stationName)
    );
  };

  /**
   * HandleStatusMessage
   * -------------------
   *
   * A status message is used for polling purposes. After a certain time interval,
   * the StationWatcher posts an update through a mutation into the server. The
   * received call should end up here.
   *
   * @param msg The status message.
   */
  export const HandleStatusMessage = (msg: StationWatcherMessage) => {
    msg;
  };

  /**
   * HandleExecute
   * -------------
   *
   * Handle a call to execute a test plan.
   *
   * @param msg The test station message to execute from.
   *
   */
  export const HandleTestStationsRestarting = async (computerName: string) => {
    const redis = getRedisPubConnection();
    const keys = await redis.keys(TestStationUtils.Key(computerName, "*"));
    await keys.map(async (key: string) => {
      const testStationJson = await redis.get(key);
      if (testStationJson) {
        const msgIn = JSON.parse(testStationJson) as TestStationMessage;
        const msgOut: TestStationMessage = {
          ...msgIn,
          computerName,
          stationName: TestStationUtils.StationName(msgIn),
          state: {
            isUp: false,
            errorMessage: TestStationUtils.ErrorMessage(msgIn),
            phase: TestStationUtils.Phase(msgIn),
            arrayIndex: 0, // TODO: Fix array index.
            sequenceIdentifier: 0, // TODO: Fix sequence identifier.
            serialNumber: "", // TODO: Fix serial number
            executionId: "",
          },
        };
        await redis.set(key, JSON.stringify(msgOut));
      }
    });
  };

  /**
   * AssignTestPlan
   *
   * Take an existing message, convert it into messages that will assign the testplan
   * information.
   *
   * @param msg The message that holds info about assigning the test plan.
   */
  const AssignTestPlan = async (
    msg: TestStationMessage
  ): Promise<TestStationMessage> => {
    const computerName = TestStationUtils.ComputerName(msg);
    const stationName = TestStationUtils.StationName(msg);
    const testplanName = TestStationUtils.TestPlanName(msg);
    const revision = TestStationUtils.RevisionNumber(msg);
    const key = TestStationUtils.Key(computerName, stationName);

    const executionInfo = await ExecutionUtils.Retrieve(msg.webId);
    const testPlanCode = executionInfo ? executionInfo.testplan : "";
    const executionIds = executionInfo ? executionInfo.ids : [];
    const breakPointIds = executionInfo ? executionInfo.breakPointIds : [];
    const resultItems = executionIds.map((id) => {
      return {
        id,
        state: "queued",
        time: 0,
        loop: 0,
        retry: 0,
        values: [],
        logs: [],
        errors: [],
      };
    });
    const station = executionInfo ? executionInfo.stationName : msg.stationName;
    const partNumber = executionInfo ? executionInfo.partNumber : "";

    await ExecutionUtils.Store({
      webId: msg.webId,
      state: "assigning-test-plan",
      testplan: testPlanCode,
      ids: executionIds,
      breakPointIds,
      items: resultItems,
      stationName: station,
      partNumber,
      computerName: msg.computerName,
      testplanName: testplanName,
      revision: revision,
    });

    const result: TestStationMessage = {
      ...msg,
      type: "assign",
      webId: msg.webId,
      itemResults: resultItems,
      assignment: {
        testplan: TestStationUtils.TestPlanName(msg),
        code: testPlanCode,
        executableIds: executionIds,
        breakPointIds: breakPointIds,
        partNumber,
        revision: TestStationUtils.RevisionNumber(msg),
        station,
        port_start: 9500,
        port_end: 9550,
      },
      executeResults: {
        dumps: "",
        lines: "",
        extended: "",
        formattedResults: "",
        logMessage: "",
        time: 0,
        payload: "",
        label: "",
      },
    };

    s_testStationPubSub
      .publish(key, result)
      .then(() => {})
      .catch(() => {});
    return Promise.resolve(result);
  };

  /**
   * HandleAssign
   * ------------
   *
   * Handle a call to assign a test plan.
   *
   * @param msg The test station message to execute from.
   *
   * @return The message processed after executing.
   */
  export const HandleAssign = async (
    msg: TestStationMessage
  ): Promise<TestStationMessage> => {
    const computerName = TestStationUtils.ComputerName(msg);
    const stationName = TestStationUtils.StationName(msg);
    const executableIds = TestStationUtils.ExecutableIds(msg);
    const breakPointIds = TestStationUtils.BreakPointIds(msg);
    const itemResults = TestStationUtils.ItemResults(msg);

    await ExecutionUtils.Store({
      webId: msg.webId,
      state: "restart-station-watcher",
      testplan: TestStationUtils.Code(msg),
      ids: executableIds,
      breakPointIds,
      items: itemResults,
      stationName: TestStationUtils.StationName(msg),
      partNumber: TestStationUtils.PartNumberName(msg),
      computerName: TestStationUtils.ComputerName(msg),
      testplanName: TestStationUtils.TestPlanName(msg),
      revision: TestStationUtils.RevisionNumber(msg),
    });

    await StationWatcherHandlers.HandleRestart({
      operation: "close",
      webId: msg.webId,
      info: {
        computerName,
        database: "eng",
        testerVersion: 2,
        transport: "TCP",
      },
    });

    return Promise.resolve({
      ...TestStationUtils.Define(msg),
      webId: msg.webId,
      type: "assignment-received",
      computerName,
      stationName,
      itemResults,
    });
  };
  /**
   * HandlePauseRequest
   * ------------------
   *
   * Handle a request to pause a test plan. This forwards on the call to
   * the test station, changing the type to "pause"
   *
   * @param msg The test station message to execute from.
   *
   * @return The message processed after executing.
   */
  export const HandlePauseRequest = async (
    msg: TestStationMessage
  ): Promise<TestStationMessage> => {
    const executionInfo = await ExecutionUtils.Retrieve(msg.webId);

    const computerName = ExecutionUtils.ComputerName(executionInfo);
    const stationName = ExecutionUtils.StationName(executionInfo);
    const key = TestStationUtils.Key(computerName, stationName);
    const msgOut: TestStationMessage = {
      ...msg,
      stationName,
      computerName,
      type: "pause",
    };

    // The following message out is the one that gets sent to the test
    // station to do the run.
    await s_testStationPubSub.publish(key, msgOut);
    return Promise.resolve(msgOut);
  };

  /**
   * HandleRunRequest
   * ----------------
   *
   * Handle a call to run a test plan. This forwards on the call to
   * the test station, changing the type from "run-request" to "run".
   *
   * @param msg The test station message to execute from.
   *
   * @return The message processed after executing.
   */
  export const HandleRunRequest = async (
    msg: TestStationMessage
  ): Promise<TestStationMessage> => {
    const executionInfo = await ExecutionUtils.Retrieve(msg.webId);

    const computerName = ExecutionUtils.ComputerName(executionInfo);
    const stationName = ExecutionUtils.StationName(executionInfo);
    const key = TestStationUtils.Key(computerName, stationName);
    const msgOut: TestStationMessage = {
      ...msg,
      stationName,
      computerName,
      type: "run",
    };

    // The following message out is the one that gets sent to the test
    // station to do the run.
    await s_testStationPubSub.publish(key, msgOut);
    return Promise.resolve(msgOut);
  };

  /**
   * HandleStepRequest
   * -----------------
   *
   * Handle a request to step a test plan. This forwards on the call to
   * the test station, renaming the type to "stop".
   *
   * @param msg The test station message to execute from.
   *
   * @return The message processed after executing.
   */
  export const HandleStepRequest = async (
    msg: TestStationMessage
  ): Promise<TestStationMessage> => {
    const executionInfo = await ExecutionUtils.Retrieve(msg.webId);

    const computerName = ExecutionUtils.ComputerName(executionInfo);
    const stationName = ExecutionUtils.StationName(executionInfo);
    const key = TestStationUtils.Key(computerName, stationName);
    const msgOut: TestStationMessage = {
      ...msg,
      stationName,
      computerName,
      type: "step",
    };

    // The following message out is the one that gets sent to the test
    // station to do the run.
    await s_testStationPubSub.publish(key, msgOut);
    return Promise.resolve(msgOut);
  };

  /**
   * HandleStopRequest
   * -----------------
   *
   * Handle a request to stop a test plan. This forwards on the call to
   * the test station, renaming the type to "stop".
   *
   * @param msg The test station message to execute from.
   *
   * @return The message processed after executing.
   */
  export const HandleStopRequest = async (
    msg: TestStationMessage
  ): Promise<TestStationMessage> => {
    const executionInfo = await ExecutionUtils.Retrieve(msg.webId);

    const computerName = ExecutionUtils.ComputerName(executionInfo);
    const stationName = ExecutionUtils.StationName(executionInfo);
    const key = TestStationUtils.Key(computerName, stationName);
    const msgOut: TestStationMessage = {
      ...msg,
      stationName,
      computerName,
      type: "stop",
    };

    // The following message out is the one that gets sent to the test
    // station to do the run.
    await s_testStationPubSub.publish(key, msgOut);
    return Promise.resolve(msgOut);
  };

  /**
   * HandleReady
   * -----------
   *
   * Handle when a test station states that it is "ready" for execution.
   *
   * @param msg The test station message.
   *
   * @return The message processed after executing.
   */
  export const HandleReady = async (
    msg: TestStationMessage
  ): Promise<TestStationMessage> => {
    // Obtain all information from the web identifier.
    const executionInfo = await ExecutionUtils.Retrieve(msg.webId);
    if (!executionInfo) {
      return Promise.resolve(msg);
    }

    const itemResults = TestStationUtils.ItemResults(msg);
    const computerName = TestStationUtils.ComputerName(msg);
    const stationName = TestStationUtils.StationName(msg);
    const key = TestStationUtils.Key(computerName, stationName);

    // Publish to the rest of the world that yes, we're ready to execute.
    await s_testStationPubSub.publish(key, msg);

    // Store the updated state.
    await ExecutionUtils.Store({
      ...executionInfo,
      state: "ready",
      computerName,
      stationName,
    });

    return Promise.resolve({
      ...TestStationUtils.Define(msg),
      webId: msg.webId,
      type: "ready",
      computerName,
      stationName,
      itemResults,
    });
  };

  /**
   * HandleEnd
   * ---------
   *
   * Handle the ending results.
   *
   * @param msg The test station message that holds end results.
   *
   * @return The message processed after results.
   */
  export const HandleEnd = async (
    msg: TestStationMessage
  ): Promise<TestStationMessage> => {
    const computerName = TestStationUtils.ComputerName(msg);
    const stationName = TestStationUtils.StationName(msg);

    // Publish the end message!
    s_testStationPubSub
      .publish(TestStationUtils.Key(computerName, stationName), msg)
      .then(() => {})
      .catch(() => {});
    return Promise.resolve(msg);
  };

  /**
   * HandleResults
   * -------------
   *
   * Handle the results coming from the test station.
   *
   * @param msg The test station message that hold results.
   *
   * @return The message processed after results.
   */
  export const HandleResults = async (
    msg: TestStationMessage
  ): Promise<TestStationMessage> => {
    const itemResults = TestStationUtils.ItemResults(msg);
    const executionInfo = ExecutionUtils.Define(
      await ExecutionUtils.Retrieve(msg.webId)
    );
    const newExecutionInfo = {
      ...executionInfo,
      items: itemResults,
    };

    await ExecutionUtils.Store(newExecutionInfo);

    const computerName = TestStationUtils.ComputerName(msg);
    const stationName = TestStationUtils.StationName(msg);

    const key = TestStationUtils.Key(computerName, stationName);

    s_testStationPubSub
      .publish(key, msg)
      .then(() => {})
      .catch(() => {});

    return Promise.resolve({
      ...TestStationUtils.Define(msg),
      type: "execute-result-received",
      computerName,
      stationName,
      itemResults,
    });
  };

  /**
   * HandleInitialization
   *
   * @param msg The initialization message received.
   * @returns A promise of the test station message modified.
   */
  const HandleInitialization = async (
    msg: TestStationMessage
  ): Promise<TestStationMessage> => {
    const output = await AssignTestPlan(msg);
    return Promise.resolve(output);
  };

  /**
   * HandleError
   * -----------
   *
   * Handle error messages.
   *
   * @param msg The test station message.
   *
   * @return The message processed after executing.
   */
  export const HandleError = async (
    msg: TestStationMessage
  ): Promise<TestStationMessage> => {
    // Obtain all information from the web identifier.
    const executionInfo = await ExecutionUtils.Retrieve(msg.webId);
    if (!executionInfo) {
      return Promise.resolve(msg);
    }

    const computerName = TestStationUtils.ComputerName(msg);
    const stationName = TestStationUtils.StationName(msg);
    const key = TestStationUtils.Key(computerName, stationName);
    const code = executionInfo.testplan;

    const newMessage: TestStationMessage = {
      ...msg,
      type: "error",
      assignment: msg.assignment
        ? {
            ...msg.assignment,
            code,
          }
        : msg.assignment,
    };

    // Publish to the rest of the world that yes, we're ready to execute.
    await s_testStationPubSub.publish(key, newMessage);

    return Promise.resolve(newMessage);
  };

  /**
   * HandleUpdate_
   * -------------
   *
   * Helper method for handling update messages.
   *
   * @param msg
   */
  const HandleUpdate_ = async (
    msg: TestStationMessage
  ): Promise<TestStationMessage> => {
    switch (msg.type) {
      /**
       * Ignore the following message types. These types (when encountered)
       * are used to issue commands to the Test Stations.
       */
      case "none":
      case "pause":
      case "run":
      case "stop":
        break;

      case "error":
        return HandleError(msg);

      case "cleanup":
        await ExecutionUtils.Remove(msg.webId);
        break;

      case "status":
        return TestStationManager.UpdateTestStation(msg);

      case "end":
        return HandleEnd(msg);

      case "end_item":
      case "end_phase":
      case "end_run":
      case "fail":
      case "pass":
      case "results":
      case "skipped":
      case "start_item":
      case "start_phase":
      case "log":
      case "time":
      case "composite":
        return HandleResults(msg);

      case "assign":
        return HandleAssign(msg);

      case "ready":
        return HandleReady(msg);

      case "run-request":
        return HandleRunRequest(msg);

      case "pause-request":
        return HandlePauseRequest(msg);

      case "step-request":
        return HandleStepRequest(msg);

      case "stop-request":
        return HandleStopRequest(msg);

      case "initialization": {
        return HandleInitialization(msg);
      }

      case "execute-result-received":
        break;

      case "serial_number":
        break;
      default:
        console.error(
          `Unhandled type received in TestStationHandler: ${JSON.stringify(
            msg,
            null,
            4
          )}`
        );
    } // End of switch.

    return Promise.resolve({
      ...msg,
      type: "unhandled",
    });
  };

  /**
   * HandleUpdate
   * ------------
   *
   * Entry-point for handling update messages.
   *
   * @param msg
   */
  export const HandleUpdate = async (
    msg_: TestStationMessage | undefined
  ): Promise<TestStationMessage> => {
    const msg = TestStationUtils.Define(msg_);
    return await HandleUpdate_(msg);
  };
}
