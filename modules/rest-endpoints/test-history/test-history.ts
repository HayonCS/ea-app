import fetch from "node-fetch";
import * as config from "config";

export interface TestHistory {
  identifierCode: string;
  identifierCode2: string | null;
  partNumber: string;
  asset: string;
  operationId: number;
  opEndTime: Date;
  passFail: boolean;
  metadataId: string;
  metadataInfo: {
    line: string;
    label: string;
    operator: string;
    revision: string;
    sender: string;
    testplan: string;
    barcode: string;
  };
}

export async function getTestHistoriesById(
  identifierCode: string
): Promise<TestHistory[]> {
  let testHistory: TestHistory[] = [];

  try {
    // const url =
    //   config.get<string>("mesRestApi.mesTestHistoryEndpoint") +
    //   "metadata?IdentifierCode=" +
    //   identifierCode;
    const url = `https://zvm-msgprod.gentex.com/processdata/testhistoryweb/v1/metadata?IdentifierCode=${identifierCode}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

    const jsonData = await response.json();
    if (jsonData && jsonData.length > 0) {
      testHistory = jsonData.map((x: any) => {
        let data: TestHistory = {
          identifierCode: x["identifierCode"],
          identifierCode2: x["identifierCode2"],
          partNumber: x["partNumber"],
          asset: x["asset"],
          operationId: +x["operationId"],
          opEndTime: new Date(x["opEndTime"]),
          passFail: x["passFail"],
          metadataId: x["metadataId"],
          metadataInfo: {
            line: x["metadataInfo"]["line"],
            label: x["metadataInfo"]["label"],
            operator: x["metadataInfo"]["operator"],
            revision: x["metadataInfo"]["revision"],
            sender: x["metadataInfo"]["sender"],
            testplan: x["metadataInfo"]["testplan"],
            barcode: x["metadataInfo"]["barcode"],
          },
        };
        return data;
      });
    }
  } catch (error) {
    console.log(error.message);
  }
  return testHistory;
}

export async function getTestHistoryById(
  identifierCode: string,
  operation: number
): Promise<TestHistory | undefined> {
  const testHistories = await getTestHistoriesById(identifierCode);
  for (const test of testHistories) {
    if (test.operationId === operation) {
      return test;
    }
  }
}

export async function getTestHistoryByMetadata(
  metaDataId: string
): Promise<TestHistory | undefined> {
  const url = `https://zvm-msgprod.gentex.com/processdata/testhistoryweb/v1/${metaDataId}/metadata`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

  const jsonData = await response.json();
  if (jsonData && jsonData["partNumber"]) {
    const testHistory: TestHistory = {
      identifierCode: jsonData["identifierCode"],
      identifierCode2: jsonData["identifierCode2"],
      partNumber: jsonData["partNumber"],
      asset: jsonData["asset"],
      operationId: +jsonData["operationId"],
      opEndTime: new Date(jsonData["opEndTime"]),
      passFail: jsonData["passFail"],
      metadataId: jsonData["metadataId"],
      metadataInfo: {
        line: jsonData["metadataInfo"]["line"],
        label: jsonData["metadataInfo"]["label"],
        operator: jsonData["metadataInfo"]["operator"],
        revision: jsonData["metadataInfo"]["revision"],
        sender: jsonData["metadataInfo"]["sender"],
        testplan: jsonData["metadataInfo"]["testplan"],
        barcode: jsonData["metadataInfo"]["barcode"],
      },
    };
    return testHistory;
  }
  return undefined;
}
