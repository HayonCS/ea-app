import fetch from "node-fetch";
import * as config from "config";

export type BomRouting = {
  alternateDesignator: string | null;
  completionLocator: string;
  completionLocatorID: number;
  completionSubinventory: string;
  engineeringItem: boolean;
  id: number;
  item: string;
  itemDescription: string;
  itemID: number;
  itemTranslations: {
    [k: string]: {
      description: string;
    };
  };
  organizationCode: number;
  organizationID: number;
  operations: OperationType[];
  revision: string;
  routingType: string;
};

type OperationType = {
  sequenceID: number;
  sequenceNumber: number;
  id: number;
  code: string;
  description: string;
  departmentID: number;
  department: string;
  departmentDescription: string;
  countPoint: boolean;
  substituteResources: ResourceType[];
  resources: ResourceType[];
  validationType: string;
};

type ResourceType = {
  code: string;
  description: string;
  lineName: string | null;
  id: number;
  sequenceNumber: number;
  substituteGroup: number;
  unitOfMeasure: string;
  usageRate: number;
};

export async function getBomRouting(
  orgCode: number,
  partNumber: string
): Promise<BomRouting | undefined> {
  const url =
    config.get<string>("mesRestApi.mesBomEndpoint") +
    "routings?organizationCode=" +
    orgCode +
    "&partNumber=" +
    partNumber;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
  const result = await response.json();
  if (result) {
    return result as BomRouting;
  }
  return undefined;
}

export async function getBomRoutings(
  orgCode: number,
  partNumbers: string[]
): Promise<BomRouting[]> {
  let totalRoutings: BomRouting[] = [];
  for (let i = 0; i < partNumbers.length; ++i) {
    const url =
      config.get<string>("mesRestApi.mesBomEndpoint") +
      "routings?organizationCode=" +
      orgCode +
      "&partNumber=" +
      partNumbers[i];
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    const result = await response.json();
    //console.log(result);
    if (result && result["status"] !== 404) {
      totalRoutings.push(result as BomRouting);
    }
  }

  return totalRoutings;
}
