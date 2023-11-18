import { Flavor } from "helpers";
import { RepositoryBase } from "records/core";
import { ComboDataRecord } from "records/core";
import {
  getCurrentDateTime,
  getCurrentTimeOffset,
} from "rest-endpoints/world-time/world-time";

export type ComboDataID = Flavor<number, "Combodata id">;

export interface UnsavedComboDataRecord {
  AssetID: number;
  Asset: string;
  OperationID: string | null;
  Line: string | null;
}

export interface SavedComboDataRecord extends UnsavedComboDataRecord {
  ComboDataID: ComboDataID;
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

async function dateToString(date: Date) {
  const currentTime = await getCurrentDateTime();
  console.log("Param: " + date);
  console.log("Current: " + currentTime);
  console.log("Now: " + new Date());
  // const timeDiff = (currentTime.getTime() - new Date().getTime()) / 3600000;
  // date.setHours(date.getHours() + timeDiff);
  // date.setHours(date.getHours() + 4);
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

export class AssetComboRecordRepository extends RepositoryBase(
  ComboDataRecord
) {
  showColumns = async () => {
    const sqlData = await this.db.raw(
      `SELECT * FROM COMBODATA.INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'ASSET'`
    );
    return sqlData;
  };

  getRows = async () => {
    const sqlData = await this.db.raw(`SELECT * FROM COMBODATA.dbo.ASSET`);
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
      `SELECT ASSET FROM COMBODATA.dbo.ASSET WHERE ASSET_ID = ${assetId}`
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

export class PnComboRecordRepository extends RepositoryBase(ComboDataRecord) {
  showColumns = async () => {
    const sqlData = await this.db.raw(
      `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'PN'`
    );
    return sqlData;
  };

  getRows = async () => {
    const sqlData = await this.db.raw(`SELECT * FROM COMBODATA.dbo.PN`);
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
      `SELECT * FROM COMBODATA.dbo.PN WHERE PNID = ${partId}`
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

export class SnComboRecordRepository extends RepositoryBase(ComboDataRecord) {
  showColumns = async () => {
    const sqlData = await this.db.raw(
      `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'SN'`
    );
    return sqlData;
  };

  getRowsDateRange = async (
    startDate: string,
    endDate: string,
    assetIds?: number[],
    partIds?: number[],
    operatorIds?: number[]
  ) => {
    const timeOffset = await getCurrentTimeOffset();
    // const start = await dateToString(startDate);
    // const end = await dateToString(endDate);
    // const providedAssets = assetIds && assetIds.length > 0;
    // const providedParts = partIds && partIds.length > 0;
    // const providedOperators = operatorIds && operatorIds.length > 0;
    let connStr = `SELECT * FROM COMBODATA.dbo.SN WHERE `;
    // str += providedAssets || providedParts || providedOperators ? " WHERE " : ""
    if (assetIds && assetIds.length > 0) {
      for (let i = 0; i < assetIds.length; ++i) {
        if (i === 0) connStr += "(";
        connStr += `ASSET_ID = ${assetIds[i]}`;
        if (i < assetIds.length - 1) connStr += " OR ";
        else if (i === assetIds.length - 1) connStr += ")";
      }
      connStr += " AND ";
    } else if (assetIds) {
      return [];
    }
    if (partIds && partIds.length > 0) {
      for (let i = 0; i < partIds.length; ++i) {
        if (i === 0) connStr += "(";
        connStr += `PNID = ${partIds[i]}`;
        if (i < partIds.length - 1) connStr += " OR ";
        else if (i === partIds.length - 1) connStr += ")";
      }
      connStr += " AND ";
    } else if (partIds) {
      return [];
    }
    if (operatorIds && operatorIds.length > 0) {
      for (let i = 0; i < operatorIds.length; ++i) {
        if (i === 0) connStr += "(";
        connStr += `OPERATORID = ${operatorIds[i]}`;
        if (i < operatorIds.length - 1) connStr += " OR ";
        else if (i === operatorIds.length - 1) connStr += ")";
      }
      connStr += " AND ";
    } else if (operatorIds) {
      return [];
    }
    connStr += `(TESTDATETIME >= '${startDate}' AND TESTDATETIME <= '${endDate}')`;
    // console.log(connStr);
    // const sqlData = await this.db.raw(`SELECT * FROM COMBODATA.dbo.ASSET`);
    const sqlData = await this.db.raw(connStr);
    let result: SnRow[] = sqlData.map((x: any) => {
      let date = new Date(x["TESTDATETIME"]);
      date.setHours(date.getHours() + timeOffset);
      const row: SnRow = {
        SNID: x["SNID"],
        PNID: x["PNID"],
        AssetID: x["ASSET_ID"],
        TestDateTime: date,
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
    result = result.sort(
      (a, b) => a.TestDateTime.getTime() - b.TestDateTime.getTime()
    );
    result = result.sort((a, b) => a.AssetID - b.AssetID);
    // const ops = result
    //   .map((x) => x.OperatorID)
    //   .filter((v, i, a) => a.indexOf(v) === i);
    // console.log(ops);
    return result;
  };

  getRowsByAssetDateRange = async (
    assetId: number,
    startDate: Date,
    endDate: Date
  ) => {
    const start = await dateToString(startDate);
    const end = await dateToString(endDate);
    const sqlData = await this.db.raw(
      `SELECT * FROM COMBODATA.dbo.SN WHERE ASSET_ID = ${assetId} AND TESTDATETIME >= '${start}' AND TESTDATETIME <= '${end}'`
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

  getRowsByAssetsDateRange = async (
    assetIds: number[],
    startDate: Date,
    endDate: Date
  ) => {
    let totalRows: SnRow[] = [];
    for (const assetId of assetIds) {
      const rows = await this.getRowsByAssetDateRange(
        assetId,
        startDate,
        endDate
      );
      totalRows = totalRows.concat(rows);
    }
    return totalRows;
  };

  getRowsByPartDateRange = async (
    partId: number,
    startDate: Date,
    endDate: Date
  ) => {
    const start = await dateToString(startDate);
    const end = await dateToString(endDate);
    const sqlData = await this.db.raw(
      `SELECT * FROM COMBODATA.dbo.SN WHERE PNID = ${partId} AND TESTDATETIME >= '${start}' AND TESTDATETIME <= '${end}'`
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
    const start = await dateToString(startDate);
    const end = await dateToString(endDate);
    const sqlData = await this.db.raw(
      `SELECT * FROM COMBODATA.dbo.SN WHERE OPERATORID = ${operatorId} AND TESTDATETIME >= '${start}' AND TESTDATETIME <= '${end}'`
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

  getRowsByOperatorsDateRange = async (
    operatorIds: number[],
    startDate: Date,
    endDate: Date
  ) => {
    let totalRows: SnRow[] = [];
    for (const operatorId of operatorIds) {
      const rows = await this.getRowsByOperatorDateRange(
        operatorId,
        startDate,
        endDate
      );
      totalRows = totalRows.concat(rows);
    }
    return totalRows;
  };

  getRowsByAssetPartDateRange = async (
    assetId: number,
    partId: number,
    startDate: Date,
    endDate: Date
  ) => {
    const start = await dateToString(startDate);
    const end = await dateToString(endDate);
    const sqlData = await this.db.raw(
      `SELECT * FROM COMBODATA.dbo.SN WHERE ASSET_ID = ${assetId} AND PNID = ${partId} AND TESTDATETIME >= '${start}' AND TESTDATETIME <= '${end}'`
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
    const start = await dateToString(startDate);
    const end = await dateToString(endDate);
    const sqlData = await this.db.raw(
      `SELECT * FROM COMBODATA.dbo.SN WHERE ASSET_ID = ${assetId} AND OPERATORID = ${operatorId} AND TESTDATETIME >= '${start}' AND TESTDATETIME <= '${end}'`
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
    const start = await dateToString(startDate);
    const end = await dateToString(endDate);
    const sqlData = await this.db.raw(
      `SELECT * FROM COMBODATA.dbo.SN WHERE PNID = ${partId} AND OPERATORID = ${operatorId} AND TESTDATETIME >= '${start}' AND TESTDATETIME <= '${end}'`
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
    const start = await dateToString(startDate);
    const end = await dateToString(endDate);
    const sqlData = await this.db.raw(
      `SELECT * FROM COMBODATA.dbo.SN WHERE ASSET_ID = ${assetId} AND PNID = ${partId} AND OPERATORID = ${operatorId} AND TESTDATETIME >= '${start}' AND TESTDATETIME <= '${end}'`
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
      `SELECT * FROM COMBODATA.dbo.SN WHERE TESTDATETIME >= '2023-10-23'`
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
