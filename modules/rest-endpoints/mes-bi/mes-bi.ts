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
}

export async function getAssetsName(nameOrKeyword: string): Promise<AssetInfo[]> {
  const url =
    config.get<string>("mesRestApi.mesBiEndpoint") +
    "assets?assetName=" + nameOrKeyword;

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

export async function getAssetsAll(): Promise<AssetInfo[]> {
  const url =
    config.get<string>("mesRestApi.mesBiEndpoint") +
    "assets/";

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

