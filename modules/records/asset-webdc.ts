import { Flavor } from "helpers";
import { RepositoryBase } from "records/core";
import { AssetRecord } from "records/core";

export type AssetID = Flavor<number, "Asset id">;

export interface UnsavedAssetRecord {
  SNID: number;
  PNID: number;
  AssetID: number;
  TestDateTime: Date;
  Failed: boolean;
  Retest: boolean;
  Traceable: boolean;
  TagCnt: number;
  SN: string | null;
  RevID: number | null;
  FailCnt: number | null;
  FailedTags: string | null;
  OperID: number | null;
  Barcode: string | null;
  MetaDataID: string | null;
  OperatorID: number | null;
  OperationID: string | null;
}

export interface SavedAssetRecord extends UnsavedAssetRecord {
  AssetID: AssetID;
}

type AssetRow = {
  AssetID: number;
  Asset: string;
  OperationID: string | null;
  Line: string | null;
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

export class AssetRecordRepository extends RepositoryBase(AssetRecord) {
  showColumns = async () => {
    const sqlData = await this.db.raw(
      `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'ASSET'`
    );
    return sqlData;
  };

  // showTables = async () => {
  //   // const tables = await this.db.raw(
  //   //   `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'SN'`
  //   // );
  //   // return tables;

  //   const sqlData = await this.db.raw(
  //     `SELECT * FROM SN WHERE TESTDATETIME >= '2023-10-23'`
  //   );
  //   const result: ComboDataSnRow[] = sqlData.map((x: any) => {
  //     const row: ComboDataSnRow = {
  //       SNID: x["SNID"],
  //       PNID: x["PNID"],
  //       AssetID: x["ASSET_ID"],
  //       TestDateTime: new Date(x["TESTDATETIME"]),
  //       Failed: x["FAILED"],
  //       Retest: x["RETEST"],
  //       Traceable: x["TRACEABLE"],
  //       TagCount: x["TAGCNT"],
  //       SN: x["SN"],
  //       RevID: x["REVID"],
  //       FailCount: x["FAILCNT"],
  //       FailedTags: x["FAILEDTAGS"],
  //       OperID: x["OPERID"],
  //       Barcode: x["BARCODE"],
  //       MetaDataID: x["METADATAID"],
  //       OperatorID: x["OPERATORID"],
  //       OperationID: x["OPERATIONID"],
  //     };
  //     return row;
  //   });
  //   return result;
  // };

  //   findByUserName = async (userName: string) => {
  //     const rows: Array<SavedUserRecord> = await this.db
  //       .select()
  //       .from("Users")
  //       .where({ Name: userName });

  //     if (rows.length === 0) {
  //       return null;
  //     }

  //     return rows[0];
  //   };
}
