import { Flavor } from "helpers";
import { RepositoryBase } from "records/core";
import { ProcessDataRecord } from "records/core";

export type ProcessDataID = Flavor<number, "Processdata id">;

export interface UnsavedProcessDataRecord {
  AssetID: number;
  Asset: string;
  OperationID: string | null;
  Line: string | null;
}

export interface SavedProcessDataRecord extends UnsavedProcessDataRecord {
  ProcessDataID: ProcessDataID;
}

export type AssetRow = {
  AssetID: number;
  Asset: string;
  OperationID: string | null;
  Line: string | null;
};

export type PnRow = {
  PNID: number;
  PartNumber: string;
  Retired: boolean;
  Oldest: Date;
  Traceable: boolean;
};

export type SnRow = {
  SNID: number;
  PNID: number;
  AssetID: number;
  TestDateTime: Date;
  Failed: boolean;
  Retest: boolean;
  Traceable: boolean;
  TagCount: number;
  SN: string | null;
  RevID: number | null;
  FailCount: number | null;
  FailedTags: string | null;
  OperID: number | null;
  Barcode: string | null;
  MetaDataID: string | null;
  OperatorID: number | null;
  OperationID: string | null;
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

export class AssetProcessRecordRepository extends RepositoryBase(
  ProcessDataRecord
) {
  showColumns = async () => {
    const sqlData = await this.db.raw(
      `SELECT * FROM PROCESSDATA.INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'SN'`
    );
    return sqlData;
  };

  getRows = async () => {
    const sqlData = await this.db.raw(`SELECT * FROM PROCESSDATA.dbo.ASSET`);
    const result: AssetRow[] = sqlData.map((x: any) => {
      const row: AssetRow = {
        AssetID: x["ASSET_ID"],
        Asset: x["ASSET"],
        OperationID: x["OPERATIONID"],
        Line: x["LINE"],
      };
      return row;
    });
    return result;
  };

  getAssetById = async (assetId: number) => {
    const sqlData = await this.db.raw(
      `SELECT ASSET FROM PROCESSDATA.dbo.ASSET WHERE ASSET_ID = ${assetId}`
    );
    if (sqlData && sqlData.length > 0) {
      return sqlData[0]["ASSET"] as string;
    }
    return "";
  };

  showTables = async () => {
    // const tables = await this.db.raw(
    //   `SELECT * FROM PROCESSDATA.INFORMATION_SCHEMA.TABLES`
    // );
    // return tables;

    const tables = await this.db.raw(
      `SELECT * FROM PROCESSDATA.INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'SN'`
    );
    return tables;
  };

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

export class PnProcessRecordRepository extends RepositoryBase(
  ProcessDataRecord
) {
  showColumns = async () => {
    const sqlData = await this.db.raw(
      `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'PN'`
    );
    return sqlData;
  };

  getRows = async () => {
    const sqlData = await this.db.raw(`SELECT * FROM PROCESSDATA.dbo.PN`);
    const result: PnRow[] = sqlData.map((x: any) => {
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
  };

  getPartById = async (partId: number) => {
    const sqlData = await this.db.raw(
      `SELECT * FROM PROCESSDATA.dbo.PN WHERE PNID = ${partId}`
    );
    const result: PnRow[] = sqlData.map((x: any) => {
      const row: PnRow = {
        PNID: x["PNID"],
        PartNumber: x["PN"],
        Retired: x["RETIRED"],
        Oldest: new Date(x["OLDEST"]),
        Traceable: x["TRACEABLE"],
      };
      return row;
    });
    if (result && result.length > 0) {
      return result[0].PartNumber;
    }
    return "";
  };
}

export class SnProcessRecordRepository extends RepositoryBase(
  ProcessDataRecord
) {
  showColumns = async () => {
    const sqlData = await this.db.raw(
      `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'SN'`
    );
    return sqlData;
  };

  getRowsDateRange = async (startDate: Date, endDate: Date) => {
    const start = dateToString(startDate);
    const end = dateToString(endDate);
    const sqlData = await this.db.raw(
      `SELECT * FROM PROCESSDATA.dbo.SN WHERE TESTDATETIME >= '${start}' AND TESTDATETIME <= '${end}'`
    );
    const result: SnRow[] = sqlData.map((x: any) => {
      const row: SnRow = {
        SNID: x["SNID"],
        PNID: x["PNID"],
        AssetID: x["ASSET_ID"],
        TestDateTime: new Date(x["TESTDATETIME"]),
        Failed: x["FAILED"],
        Retest: x["RETEST"],
        Traceable: x["TRACEABLE"],
        TagCount: x["TAGCNT"],
        SN: x["SN"],
        RevID: x["REVID"],
        FailCount: x["FAILCNT"],
        FailedTags: x["FAILEDTAGS"],
        OperID: x["OPERID"],
        Barcode: x["BARCODE"],
        MetaDataID: x["METADATAID"],
        OperatorID: x["OPERATORID"],
        OperationID: x["OPERATIONID"],
      };
      return row;
    });
    return result;
  };

  getRowsByAssetDateRange = async (
    assetId: number,
    startDate: Date,
    endDate: Date
  ) => {
    const start = dateToString(startDate);
    const end = dateToString(endDate);
    const sqlData = await this.db.raw(
      `SELECT * FROM PROCESSDATA.dbo.SN WHERE ASSET_ID = ${assetId} AND TESTDATETIME >= '${start}' AND TESTDATETIME <= '${end}'`
    );
    const result: SnRow[] = sqlData.map((x: any) => {
      const row: SnRow = {
        SNID: x["SNID"],
        PNID: x["PNID"],
        AssetID: x["ASSET_ID"],
        TestDateTime: new Date(x["TESTDATETIME"]),
        Failed: x["FAILED"],
        Retest: x["RETEST"],
        Traceable: x["TRACEABLE"],
        TagCount: x["TAGCNT"],
        SN: x["SN"],
        RevID: x["REVID"],
        FailCount: x["FAILCNT"],
        FailedTags: x["FAILEDTAGS"],
        OperID: x["OPERID"],
        Barcode: x["BARCODE"],
        MetaDataID: x["METADATAID"],
        OperatorID: x["OPERATORID"],
        OperationID: x["OPERATIONID"],
      };
      return row;
    });
    return result;
  };

  getRowsByPartDateRange = async (
    partId: number,
    startDate: Date,
    endDate: Date
  ) => {
    const start = dateToString(startDate);
    const end = dateToString(endDate);
    const sqlData = await this.db.raw(
      `SELECT * FROM PROCESSDATA.dbo.SN WHERE PNID = ${partId} AND TESTDATETIME >= '${start}' AND TESTDATETIME <= '${end}'`
    );
    const result: SnRow[] = sqlData.map((x: any) => {
      const row: SnRow = {
        SNID: x["SNID"],
        PNID: x["PNID"],
        AssetID: x["ASSET_ID"],
        TestDateTime: new Date(x["TESTDATETIME"]),
        Failed: x["FAILED"],
        Retest: x["RETEST"],
        Traceable: x["TRACEABLE"],
        TagCount: x["TAGCNT"],
        SN: x["SN"],
        RevID: x["REVID"],
        FailCount: x["FAILCNT"],
        FailedTags: x["FAILEDTAGS"],
        OperID: x["OPERID"],
        Barcode: x["BARCODE"],
        MetaDataID: x["METADATAID"],
        OperatorID: x["OPERATORID"],
        OperationID: x["OPERATIONID"],
      };
      return row;
    });
    return result;
  };

  getRowsByOperatorDateRange = async (
    operatorId: number,
    startDate: Date,
    endDate: Date
  ) => {
    const start = dateToString(startDate);
    const end = dateToString(endDate);
    const sqlData = await this.db.raw(
      `SELECT * FROM PROCESSDATA.dbo.SN WHERE OPERATORID = ${operatorId} AND TESTDATETIME >= '${start}' AND TESTDATETIME <= '${end}'`
    );
    const result: SnRow[] = sqlData.map((x: any) => {
      const row: SnRow = {
        SNID: x["SNID"],
        PNID: x["PNID"],
        AssetID: x["ASSET_ID"],
        TestDateTime: new Date(x["TESTDATETIME"]),
        Failed: x["FAILED"],
        Retest: x["RETEST"],
        Traceable: x["TRACEABLE"],
        TagCount: x["TAGCNT"],
        SN: x["SN"],
        RevID: x["REVID"],
        FailCount: x["FAILCNT"],
        FailedTags: x["FAILEDTAGS"],
        OperID: x["OPERID"],
        Barcode: x["BARCODE"],
        MetaDataID: x["METADATAID"],
        OperatorID: x["OPERATORID"],
        OperationID: x["OPERATIONID"],
      };
      return row;
    });
    return result;
  };

  getRowsByAssetPartDateRange = async (
    assetId: number,
    partId: number,
    startDate: Date,
    endDate: Date
  ) => {
    const start = dateToString(startDate);
    const end = dateToString(endDate);
    const sqlData = await this.db.raw(
      `SELECT * FROM PROCESSDATA.dbo.SN WHERE ASSET_ID = ${assetId} AND PNID = ${partId} AND TESTDATETIME >= '${start}' AND TESTDATETIME <= '${end}'`
    );
    const result: SnRow[] = sqlData.map((x: any) => {
      const row: SnRow = {
        SNID: x["SNID"],
        PNID: x["PNID"],
        AssetID: x["ASSET_ID"],
        TestDateTime: new Date(x["TESTDATETIME"]),
        Failed: x["FAILED"],
        Retest: x["RETEST"],
        Traceable: x["TRACEABLE"],
        TagCount: x["TAGCNT"],
        SN: x["SN"],
        RevID: x["REVID"],
        FailCount: x["FAILCNT"],
        FailedTags: x["FAILEDTAGS"],
        OperID: x["OPERID"],
        Barcode: x["BARCODE"],
        MetaDataID: x["METADATAID"],
        OperatorID: x["OPERATORID"],
        OperationID: x["OPERATIONID"],
      };
      return row;
    });
    return result;
  };

  getRowsByAssetOperatorDateRange = async (
    assetId: number,
    operatorId: number,
    startDate: Date,
    endDate: Date
  ) => {
    const start = dateToString(startDate);
    const end = dateToString(endDate);
    const sqlData = await this.db.raw(
      `SELECT * FROM PROCESSDATA.dbo.SN WHERE ASSET_ID = ${assetId} AND OPERATORID = ${operatorId} AND TESTDATETIME >= '${start}' AND TESTDATETIME <= '${end}'`
    );
    const result: SnRow[] = sqlData.map((x: any) => {
      const row: SnRow = {
        SNID: x["SNID"],
        PNID: x["PNID"],
        AssetID: x["ASSET_ID"],
        TestDateTime: new Date(x["TESTDATETIME"]),
        Failed: x["FAILED"],
        Retest: x["RETEST"],
        Traceable: x["TRACEABLE"],
        TagCount: x["TAGCNT"],
        SN: x["SN"],
        RevID: x["REVID"],
        FailCount: x["FAILCNT"],
        FailedTags: x["FAILEDTAGS"],
        OperID: x["OPERID"],
        Barcode: x["BARCODE"],
        MetaDataID: x["METADATAID"],
        OperatorID: x["OPERATORID"],
        OperationID: x["OPERATIONID"],
      };
      return row;
    });
    return result;
  };

  getRowsByPartOperatorDateRange = async (
    partId: number,
    operatorId: number,
    startDate: Date,
    endDate: Date
  ) => {
    const start = dateToString(startDate);
    const end = dateToString(endDate);
    const sqlData = await this.db.raw(
      `SELECT * FROM PROCESSDATA.dbo.SN WHERE PNID = ${partId} AND OPERATORID = ${operatorId} AND TESTDATETIME >= '${start}' AND TESTDATETIME <= '${end}'`
    );
    const result: SnRow[] = sqlData.map((x: any) => {
      const row: SnRow = {
        SNID: x["SNID"],
        PNID: x["PNID"],
        AssetID: x["ASSET_ID"],
        TestDateTime: new Date(x["TESTDATETIME"]),
        Failed: x["FAILED"],
        Retest: x["RETEST"],
        Traceable: x["TRACEABLE"],
        TagCount: x["TAGCNT"],
        SN: x["SN"],
        RevID: x["REVID"],
        FailCount: x["FAILCNT"],
        FailedTags: x["FAILEDTAGS"],
        OperID: x["OPERID"],
        Barcode: x["BARCODE"],
        MetaDataID: x["METADATAID"],
        OperatorID: x["OPERATORID"],
        OperationID: x["OPERATIONID"],
      };
      return row;
    });
    return result;
  };

  getRowsByAssetPartOperatorDateRange = async (
    assetId: number,
    partId: number,
    operatorId: number,
    startDate: Date,
    endDate: Date
  ) => {
    const start = dateToString(startDate);
    const end = dateToString(endDate);
    const sqlData = await this.db.raw(
      `SELECT * FROM PROCESSDATA.dbo.SN WHERE ASSET_ID = ${assetId} AND PNID = ${partId} AND OPERATORID = ${operatorId} AND TESTDATETIME >= '${start}' AND TESTDATETIME <= '${end}'`
    );
    const result: SnRow[] = sqlData.map((x: any) => {
      const row: SnRow = {
        SNID: x["SNID"],
        PNID: x["PNID"],
        AssetID: x["ASSET_ID"],
        TestDateTime: new Date(x["TESTDATETIME"]),
        Failed: x["FAILED"],
        Retest: x["RETEST"],
        Traceable: x["TRACEABLE"],
        TagCount: x["TAGCNT"],
        SN: x["SN"],
        RevID: x["REVID"],
        FailCount: x["FAILCNT"],
        FailedTags: x["FAILEDTAGS"],
        OperID: x["OPERID"],
        Barcode: x["BARCODE"],
        MetaDataID: x["METADATAID"],
        OperatorID: x["OPERATORID"],
        OperationID: x["OPERATIONID"],
      };
      return row;
    });
    return result;
  };

  showTables = async () => {
    // const tables = await this.db.raw(
    //   `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'SN'`
    // );
    // return tables;

    const sqlData = await this.db.raw(
      `SELECT * FROM PROCESSDATA.dbo.SN WHERE TESTDATETIME >= '2023-10-23'`
    );
    const result: SnRow[] = sqlData.map((x: any) => {
      const row: SnRow = {
        SNID: x["SNID"],
        PNID: x["PNID"],
        AssetID: x["ASSET_ID"],
        TestDateTime: new Date(x["TESTDATETIME"]),
        Failed: x["FAILED"],
        Retest: x["RETEST"],
        Traceable: x["TRACEABLE"],
        TagCount: x["TAGCNT"],
        SN: x["SN"],
        RevID: x["REVID"],
        FailCount: x["FAILCNT"],
        FailedTags: x["FAILEDTAGS"],
        OperID: x["OPERID"],
        Barcode: x["BARCODE"],
        MetaDataID: x["METADATAID"],
        OperatorID: x["OPERATORID"],
        OperationID: x["OPERATIONID"],
      };
      return row;
    });
    return result;
  };

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
