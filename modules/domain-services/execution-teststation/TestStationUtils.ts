import { ItemResult, TestStationMessage } from "graphql-api/server-types.gen";

export namespace TestStationUtils {
  /**
   * Empty
   *
   * Create an empty TestStationMessage.
   *
   * @return a default valued test station message.
   */
  export const Empty = (): TestStationMessage => {
    return {
      type: "none",
      webId: "",
      computerName: "",
      stationName: "",
      itemResults: [],
    };
  };

  /**
   * Define
   *
   * Define a test station message- if this comes in as undefined or null, it will
   * return an empty element.
   */
  export const Define = (
    msgIn: TestStationMessage | undefined | null
  ): TestStationMessage => {
    return msgIn ? msgIn : Empty();
  };

  /**
   * ArrayIndex
   * ----------
   *
   * Obtain the array index.
   *
   * @param msg A message to obtain the array index.
   *
   * @returns The array index or 0 if undefined.
   */
  export const ArrayIndex = (msg: TestStationMessage): number => {
    if (msg) {
      if (msg.state) {
        return msg.state.arrayIndex;
      }
    }

    return 0;
  };

  /**
   * BreakPointIds
   * -------------
   *
   * Obtain the break point ids.
   *
   * @param msg A message to obtain the executable identifiers.
   *
   * @returns The container of executable identifiers.
   */
  export const BreakPointIds = (msg: TestStationMessage): Array<string> => {
    if (msg) {
      if (msg.assignment) {
        return msg.assignment.breakPointIds;
      }
    }

    return [];
  };

  /**
   * Code
   * ------------
   *
   * Obtain the code.
   *
   * @param msg A message to obtain the code from.
   *
   * @returns The code if valid, empty string otherwise.
   */
  export const Code = (msg: TestStationMessage): string => {
    if (msg) {
      if (msg.assignment) {
        return msg.assignment.code;
      }
    }

    return "";
  };

  /**
   * ComputerName
   * ------------
   *
   * Obtain a computer name from the TestStationMessage.
   *
   * @param msg A message to obtain the computer name from.
   *
   * @returns The computer name if valid, empty string otherwise.
   */
  export const ComputerName = (msg: TestStationMessage): string => {
    if (msg) {
      return msg.computerName;
    }

    return "";
  };

  /**
   * PartNumberName
   * --------------
   *
   * Obtain a part number name from the TestStationMessage.
   *
   * @param msg A message to obtain the part number name from.
   *
   * @returns The part number if valid, empty string otherwise.
   */
  export const PartNumberName = (msg: TestStationMessage): string => {
    if (msg) {
      if (msg.assignment) {
        return msg.assignment.partNumber;
      }
    }

    return "";
  };

  /**
   * StationName
   * -----------
   *
   * Obtain a station name from the TestStationMessage.
   *
   * @param msg A message to obtain the station name from.
   *
   * @returns The computer name if valid, empty string otherwise.
   */
  export const StationName = (msg: TestStationMessage): string => {
    if (msg) {
      return msg.stationName;
    }

    return "";
  };

  /**
   * TestPlanName
   * ------------
   *
   * Obtain a testplan name from the TestStationMessage.
   *
   * @param msg A message to obtain the testplan name from.
   *
   * @returns The testplan if valid, empty string otherwise.
   */
  export const TestPlanName = (msg: TestStationMessage): string => {
    if (msg) {
      if (msg.assignment) {
        return msg.assignment.testplan;
      }
    }

    return "";
  };

  /**
   * RevisionNumber
   * --------------
   *
   * Obtain a revision from the TestStationMessage.
   *
   * @param msg A message to obtain the revision from.
   *
   * @returns The revision if valid, empty string otherwise.
   */
  export const RevisionNumber = (msg: TestStationMessage): string => {
    if (msg) {
      if (msg.assignment) {
        return msg.assignment.revision;
      }
    }

    return "";
  };

  /**
   * ExecutableIds
   * -------------
   *
   * Obtain the executable ids.
   *
   * @param msg A message to obtain the executable identifiers.
   *
   * @returns The container of executable identifiers.
   */
  export const ExecutableIds = (msg: TestStationMessage): Array<string> => {
    if (msg) {
      if (msg.assignment) {
        return msg.assignment.executableIds;
      }
    }

    return [];
  };

  /**
   * ErrorMessage
   * ------------
   *
   * Obtain an error message from the TestStationMessage.
   *
   * @param msg A message to obtain the error message from.
   *
   * @returns The error message if valid, empty string otherwise.
   */
  export const ErrorMessage = (msg: TestStationMessage): string => {
    if (msg) {
      if (msg.state) {
        return msg.state.errorMessage;
      }
    }

    return "";
  };

  /**
   * Identifiers
   * -----------
   *
   * Obtain a collection of identifiers to be executed.
   *
   * @param msg
   */
  export const Identifiers = (msg: TestStationMessage): string[] => {
    if (msg && msg.assignment) {
      return msg.assignment.executableIds;
    }
    return [];
  };

  /**
   * ItemResults
   * -----------
   *
   * Grab the item results from the message.
   *
   * @param msg A message to obtain the item results from.
   *
   * @returns The item results.
   */
  export const ItemResults = (msg: TestStationMessage): Array<ItemResult> => {
    if (msg) {
      if (msg.executeResults) {
        return msg.itemResults.reduce((acc, r) => {
          if (r) {
            acc = acc.concat(r);
          }
          return acc;
        }, [] as Array<ItemResult>);
      }
    }

    return [];
  };

  /**
   * Phase
   * -----
   *
   * Obtain an phase from the TestStationMessage.
   *
   * @param msg A message to obtain the phase from.
   *
   * @returns The phase if valid, empty string otherwise.
   */
  export const Phase = (msg: TestStationMessage): string => {
    if (msg) {
      if (msg.state) {
        return msg.state.phase;
      }
    }

    return "";
  };

  /**
   * SequenceIdentifier
   * ------------------
   *
   * Obtain the sequence identifier.
   *
   * @param msg A message to obtain the sequence identifier from the message.
   *
   * @returns The sequence identifier or 0 if undefined.
   */
  export const SequenceIdentifier = (msg: TestStationMessage): number => {
    if (msg) {
      if (msg.state) {
        return msg.state.sequenceIdentifier;
      }
    }

    return 0;
  };

  /**
   * SerialNumber
   * ------------
   *
   * Obtain the serial number.
   *
   * @param msg A message to obtain the serial number.
   *
   * @returns The serial number.
   */
  export const SerialNumber = (msg: TestStationMessage): string => {
    if (msg && msg.state) {
      return msg.state.serialNumber;
    }
    return "";
  };

  /**
   * Key
   * ---
   *
   * Construct a test station key that indexes into Redis.
   *
   * @param computerName The name of the computer where the test station runs.
   * @param stationName The name of the station.
   *
   * @returns the key.
   */
  export const Key = (computerName: string, stationName: string): string => {
    return `TestStation:${computerName}:${stationName}`;
  };

  /**
   * Temporary Logger method.
   *
   * @param _msg The message to output.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export const Logger = (_msg: string) => {};
}
