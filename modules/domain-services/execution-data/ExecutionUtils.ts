import { getRedisPubConnection } from "db/redis";
import { ExecutionInfo } from "./ExecutionInfo";

export namespace ExecutionUtils {
  export const Define = (
    executionInfo: ExecutionInfo | undefined
  ): ExecutionInfo => {
    if (executionInfo) {
      return executionInfo;
    }
    return {
      ids: [],
      breakPointIds: [],
      items: [],
      state: "",
      testplan: "",
      webId: "",
      stationName: "",
      partNumber: "",
      computerName: "",
      testplanName: "",
      revision: "",
    };
  };

  /**
   * ExecutionUtils.Key
   *
   * A way to construct a key from a web identifier.
   */
  export const Key = (webId: string): string => `execution-context:${webId}`;

  /**
   * Store the execution context back into redis.
   *
   * @param info The information to store.
   *
   * @returns
   */
  export const Store = async (info: ExecutionInfo): Promise<ExecutionInfo> => {
    const redis = getRedisPubConnection();
    await redis.set(Key(info.webId), JSON.stringify(info));
    return Promise.resolve(info);
  };

  /**
   * Retrieve an ExecutionInfo object.
   *
   * @param webId
   * @returns
   */
  export const Retrieve = async (
    webId: string
  ): Promise<ExecutionInfo | undefined> => {
    const redis = getRedisPubConnection();
    const v = await redis.get(Key(webId));
    if (v) {
      return JSON.parse(v) as ExecutionInfo;
    }
    return Promise.resolve(undefined);
  };

  /**
   * Remove an ExecutionInfo object.
   *
   * @param webId
   * @returns
   */
  export const Remove = async (webId: string): Promise<void> => {
    const redis = getRedisPubConnection();
    await redis.del(Key(webId));
    return Promise.resolve();
  };

  /**
   * ComputerName
   *
   * Retrieve the computer name.
   *
   * @param info The execution info object to retrieve the station name from.
   *
   * @returns A string holding the station name (or empty string).
   */
  export const ComputerName = (
    info: ExecutionInfo | undefined | null
  ): string => {
    if (info) {
      return info.computerName;
    }
    return "";
  };

  /**
   * StationName
   *
   * Retrieve the station name.
   *
   * @param info The execution info object to retrieve the station name from.
   *
   * @returns A string holding the station name (or empty string).
   */
  export const StationName = (
    info: ExecutionInfo | undefined | null
  ): string => {
    if (info) {
      return info.stationName;
    }
    return "";
  };
}
