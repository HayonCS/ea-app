import fetch from "node-fetch";
import * as config from "config";

export type TimeZoneInfo = {
  abbreviation: string;
  client_ip: string;
  datetime: string;
  day_of_week: number;
  day_of_year: number;
  dst: boolean;
  dst_from: string;
  dst_offset: number;
  dst_until: string;
  raw_offset: number;
  timezone: string;
  unixtime: number;
  utc_datetime: string;
  utc_offset: string;
  week_number: number;
};

export async function getCurrentDateTime() {
  const timezone = await getTimeZone("America/Detroit");
  if (timezone) {
    const offset = +timezone.utc_offset.substring(
      0,
      timezone.utc_offset.length - 3
    );
    let date = new Date(timezone.datetime);
    // let date = new Date("1970-01-01T00:00:00.000Z");
    // date.setTime(date.getTime() + timezone.unixtime * 1000);
    // date.setHours(date.getHours() + offset);
    return date;
  } else {
    return new Date();
  }
}

export async function getCurrentTimeOffset() {
  const timezone = await getTimeZone("America/Detroit");
  if (timezone) {
    const offset = Math.abs(
      +timezone.utc_offset.substring(0, timezone.utc_offset.length - 3)
    );
    return offset;
  } else {
    return 0;
  }
}

export async function getTimeZone(
  timezone: string
): Promise<TimeZoneInfo | undefined> {
  try {
    const url =
      config.get<string>("mesRestApi.worldTimeEndpoint") +
      "timezone/" +
      timezone;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    if (!response.ok)
      throw new Error(
        `Error fetching the timezone '${timezone}' from WorldTimeAPI!`
      );
    const jsonData = await response.json();
    if (jsonData) {
      return jsonData as TimeZoneInfo;
    }
  } catch (error) {
    console.log(error.message);
  }
  return undefined;
}

export async function getTimeZones(): Promise<string[]> {
  try {
    const url = config.get<string>("mesRestApi.worldTimeEndpoint") + "timezone";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    if (!response.ok)
      throw new Error("Error fetching timezones from WorldTimeAPI!");
    const jsonData = await response.json();
    if (jsonData) {
      return jsonData as string[];
    }
  } catch (error) {
    console.log(error.message);
  }
  return [];
}
