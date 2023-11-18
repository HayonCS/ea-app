import fetch from "node-fetch";
import * as config from "config";

export type AssetInfo = {
  assetName: string;
  serial: string;
  model: string;
  orgCode: string;
  line: string;
  dateCreated: string;
  notes: string;
  reportGroupName?: string;
  reportGroupID: string;
  excludeFromHealth: boolean;
  legacyLocation?: string;
  autoUpdate: boolean;
  recordLastUpdated: string;
  updatedBy: string;
};

export type LineOperationPart = {
  orgCode: number;
  line: string;
  partNumber: string;
  partNumberAsset: string | null;
  ebsOperation: string;
  averageCycleTime: number;
  minimumRepeatable: number;
  historicalReferenceUsageRate: string | null;
  autoUpdate: boolean;
  recordLastUpdated: string;
  updatedBy: string;
  comments: string | null;
};

export async function getAssetsName(
  nameOrKeyword: string
): Promise<AssetInfo[]> {
  const url =
    config.get<string>("mesRestApi.mesBiEndpoint") +
    "assets?assetName=" +
    nameOrKeyword;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

  const result = await response.json();
  return result as AssetInfo[];
}

export async function getAssetByName(
  assetName: string
): Promise<AssetInfo | undefined> {
  const url =
    config.get<string>("mesRestApi.mesBiEndpoint") +
    "assets?assetName=" +
    assetName;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

  const result: AssetInfo[] = await response.json();
  return result.length > 0 ? result[0] : undefined;
}

export async function getAssetsAll(): Promise<AssetInfo[]> {
  const url = config.get<string>("mesRestApi.mesBiEndpoint") + "assets/";

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

  const result = await response.json();
  return result as AssetInfo[];
}

export async function getCycleTimesLineOperationPart(): Promise<
  LineOperationPart[]
> {
  const url =
    config.get<string>("mesRestApi.mesBiEndpoint") +
    "cycletimes/lineoperationpart";

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

  const result = await response.json();
  return result as LineOperationPart[];
}
