import fetch from "node-fetch";
import * as config from "config";

export interface ProcessDataExport {
  MetaDataId: string;
  Asset: string;
  IdentifierCode: string;
  IdentifierCode2: string;
  PartNumber: string;
  OpEndTime: Date;
  PassFail: boolean;
  OperationId: string;
  Line: string;
  Label: string;
  Operator: string;
  Description: string;
  CycleTime: string;
  Revision: string;
  Sender: string;
  TestPlan: string;
  Barcode: string;
}

export interface RunningNowItem {
  Asset: string;
  OperationId: string;
  PartNumber: string;
  IdentifierCode: string;
  TimeSinceLastRun: number;
  TimeSincePartChange: number;
  QtyRunSincePartChange: number;
  QtyFailed: number;
  PreviousPartNumber: string;
  LastRunTime: Date;
  TimeOfPartChange: Date;
  TimeSinceLastEtl: number;
}

export async function getProcessDataExport(
  asset: string,
  startDate: string,
  endDate: string
): Promise<ProcessDataExport[]> {
  const url =
    config.get<string>("mesRestApi.mesProcessDataEndpoint") +
    "processdataexport/processDataExport?Assets=" +
    asset +
    "&StartDate=" +
    startDate +
    "&EndDate=" +
    endDate +
    "&TopNRows=-1&UserMetadataKeys=line%2Clabel%2Coperator%2Cdescription%2Ccycletime%2Crevision%2Csender%2Ctestplan%2Cbarcode";

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

  let processData: ProcessDataExport[] = [];
  const jsonData = await response.json();
  if (jsonData && jsonData.length > 0) {
    let lastOperator = "";
    processData = jsonData.map((x: any) => {
      if (x["KeyToValueDictionary"]["OPERATOR"])
        lastOperator = x["KeyToValueDictionary"]["OPERATOR"];
      let data: ProcessDataExport = {
        MetaDataId: x["MetaDataId"],
        Asset: x["KeyToValueDictionary"]["ASSET"],
        IdentifierCode: x["KeyToValueDictionary"]["IDENTIFIERCODE"],
        IdentifierCode2: x["KeyToValueDictionary"]["IDENTIFIERCODE2"],
        PartNumber: x["KeyToValueDictionary"]["PARTNUMBER"],
        OpEndTime: new Date(x["KeyToValueDictionary"]["OPENDTIME"]),
        PassFail: x["KeyToValueDictionary"]["PASSFAIL"],
        OperationId: x["KeyToValueDictionary"]["OPERATIONID"],
        Line: x["KeyToValueDictionary"]["LINE"],
        Label: x["KeyToValueDictionary"]["LABEL"],
        Operator: x["KeyToValueDictionary"]["OPERATOR"] ?? lastOperator,
        Description: x["KeyToValueDictionary"]["DESCRIPTION"],
        CycleTime: x["KeyToValueDictionary"]["CYCLETIME"],
        Revision: x["KeyToValueDictionary"]["REVISION"],
        Sender: x["KeyToValueDictionary"]["SENDER"],
        TestPlan: x["KeyToValueDictionary"]["TESTPLAN"],
        Barcode: x["KeyToValueDictionary"]["BARCODE"],
      };
      data.OpEndTime = new Date(x["KeyToValueDictionary"]["OPENDTIME"]);
      return data;
    });
    processData = processData.filter((x) => x.Operator && x.Operator !== "");
    processData = processData.sort(
      (a, b) => a.OpEndTime.getTime() - b.OpEndTime.getTime()
    );
  }
  return processData;
}

export async function getAssetsRunningNow(): Promise<RunningNowItem[]> {
  const combo = await getRunningNowItems("CMB-");
  const combo2 = await getRunningNowItems("CMB2-");
  const monorail = await getRunningNowItems("MR-");
  const press = await getRunningNowItems("PCB");
  let assets = [...combo, ...combo2, ...monorail, ...press];
  assets = assets.sort((a, b) => a.Asset.localeCompare(b.Asset));
  return assets;
}

async function getRunningNowItems(asset: string): Promise<RunningNowItem[]> {
  const url =
    config.get<string>("mesRestApi.mesProcessDataEndpoint") +
    `runningnow/getItemsRunningNow?AssetFirstLetter=${asset}&showOnlyLast24Hours=true`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

  if (!response.ok) {
    return [];
  }

  let items: RunningNowItem[] = [];
  const jsonData = await response.json();
  if (
    jsonData &&
    jsonData.RunningNowItems &&
    jsonData.RunningNowItems.length > 0
  ) {
    items = jsonData.RunningNowItems.map((x: any) => {
      let item: RunningNowItem = {
        Asset: x["Asset"],
        OperationId: x["OperationId"],
        PartNumber: x["PartNumber"],
        IdentifierCode: x["IdentifierCode"],
        TimeSinceLastRun: +x["TimeSinceLastRun"],
        TimeSincePartChange: +x["TimeSincePartChange"],
        QtyRunSincePartChange: +x["QtyRunSincePartChange"],
        QtyFailed: +x["QtyFailed"],
        PreviousPartNumber: x["PreviousPartNumber"],
        LastRunTime: new Date(x["LastRunTime"]),
        TimeOfPartChange: new Date(x["TimeOfPartChange"]),
        TimeSinceLastEtl: +x["TimeSinceLastEtl"],
      };
      return item;
    });
    items = items.sort((a, b) => a.Asset.localeCompare(b.Asset));
  }
  return items;
}
