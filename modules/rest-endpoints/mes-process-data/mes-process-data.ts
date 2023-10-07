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

export async function getProcessDataExport(
  asset: string,
  startDate: string,
  endDate: string
): Promise<ProcessDataExport[]> {
  const url =
    config.get<string>("mesRestApi.mesProcessDataEndpoint") +
    "?Assets=" +
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
    processData = jsonData.map((x: any) => {
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
        Operator: x["KeyToValueDictionary"]["OPERATOR"],
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
