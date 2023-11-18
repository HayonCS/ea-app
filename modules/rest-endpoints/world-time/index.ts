import * as Hexagonal from "atomic-object/hexagonal";
import { WorldTimePort } from "./port";
import {
  TimeZoneInfo,
  getCurrentDateTime,
  getCurrentTimeOffset,
  getTimeZone,
  getTimeZones,
} from "./world-time";

export type WorldTime = {
  getCurrentDateTime: () => Promise<Date>;

  getCurrentTimeOffset: () => Promise<number>;

  getTimeZone: (timezone: string) => Promise<TimeZoneInfo | undefined>;

  getTimeZones: () => Promise<string[]>;
};

export const worldTimeAdapter = Hexagonal.adapter({
  port: WorldTimePort,
  requires: [],
  build: () => {
    return {
      getCurrentDateTime: async () => {
        return await getCurrentDateTime();
      },

      getCurrentTimeOffset: async () => {
        return await getCurrentTimeOffset();
      },

      getTimeZone: async (timezone: string) => {
        return await getTimeZone(timezone);
      },

      getTimeZones: async () => {
        return await getTimeZones();
      },
    };
  },
});
