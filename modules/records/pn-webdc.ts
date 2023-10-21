import { Flavor } from "helpers";
import { RepositoryBase } from "records/core";
import { PnRecord } from "records/core";

export type PnID = Flavor<number, "Pn id">;

export interface UnsavedPnRecord {
  PNID: number;
  PartNumber: string;
  Retired: boolean;
  Oldest: Date;
  Traceable: boolean;
}

export interface SavedPnRecord extends UnsavedPnRecord {
  PnID: PnID;
}

export type PnRow = {
  PNID: number;
  PartNumber: string;
  Retired: boolean;
  Oldest: Date;
  Traceable: boolean;
};

function dateToString(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  const hr = (hours < 10 ? "0" : "") + hours;
  const min = (minutes < 10 ? "0" : "") + minutes;
  const sec = (seconds < 10 ? "0" : "") + seconds;
  const ms =
    (milliseconds < 10 ? "00" : milliseconds < 100 ? "0" : "") + milliseconds;
  const dateStr = `${year}-${(month < 10 ? "0" : "") + month}-${
    (day < 10 ? "0" : "") + day
  }`;
  const timeStr = `${hr}:${min}:${sec}.${ms}`;
  return dateStr + "T" + timeStr + "Z";
}

function mapSqlData(data: any) {
  const result: PnRow[] = data.map((x: any) => {
    const row: PnRow = {
      PNID: x["PNID"],
      PartNumber: x["PN"],
      Retired: x["RETIRED"],
      Oldest: new Date(x["OLDEST"]),
      Traceable: x["TRACEABLE"],
    };
    return row;
  });
  return result;
}

export class PnRecordRepository extends RepositoryBase(PnRecord) {
  showColumns = async () => {
    const sqlData = await this.db.raw(
      `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'PN'`
    );
    return sqlData;
  };

  getRows = async () => {
    const sqlData = await this.db.raw(`SELECT * FROM PN`);
    const result = mapSqlData(sqlData);
    return result;
  };

  getPartById = async (partId: number) => {
    const sqlData = await this.db.raw(
      `SELECT * FROM PN WHERE PNID = ${partId}`
    );
    const result = mapSqlData(sqlData);
    if (result && result.length > 0) {
      return result[0].PartNumber;
    }
    return "";
  };
}
