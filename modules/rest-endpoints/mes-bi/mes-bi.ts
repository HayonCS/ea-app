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

export type LineConfiguration = {
  lineName: string;
  orgCode: number;
  description: string;
  payrollDeptName: string;
  costCenterName: string;
  payrollDeptId: number;
  costCenterId: number;
  payrollDeptIdOverride: number;
  payrollDeptIdEffective: number;
  productGroup: string;
  productGroupId: number;
  reportGroupName: string;
  reportGroupId: number;
  reportGroupOverride: boolean;
  legacyGroupName: string;
  legacyLineId: number;
  legacyGroupId: number;
  defaultCycleTime: number;
  startMfgOperation: number;
  endMfgOperation: number;
  startOperation: string;
  endOperation: string;
  assemblyMfgOperation: number;
  assemblyRatio: number;
  ebsLineId: number;
  updatedBy: string;
  recordLastUpdated: Date;
  minParts: number;
  startDate: Date;
  endDate: Date | undefined;
  endDateOverride: Date | undefined;
  excludeForLmp: boolean;
  isWipDiscrete: boolean;
  startEndFromRoutes: boolean;
  useMfgOperationsForYields: boolean;
  calculateAssetOEE: boolean;
  calculateStandardOEE: boolean;
  useCompletionTimestamps: boolean;
  manuallyCreated: boolean;
  autoEndDate: boolean;
  lmpOverride: boolean;
  mesDefectsEnabled: boolean;
  prodTimeFromEndOp: boolean;
  trackOperatorCounts: boolean;
  includeOEE: boolean;
  includeYield: boolean;
  includeRejects: boolean;
  includeScrapCost: boolean;
  includeScheduleAttainment: boolean;
  includePpm: boolean;
  includeHours: boolean;
  includeEfficiency: boolean;
  sendTimeFirst: number;
  sendTimeSecond: number;
  sendTimeThird: number;
  combineReports: boolean;
  combineStats: boolean;
  parentLineName: string;
  parentOrgCode: number;
  subLines: string;
  mesPlatformVersion: string;
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

export async function getLineConfiguration(
  lineName: string,
  orgCode: number
): Promise<LineConfiguration | undefined> {
  const url =
    config.get<string>("mesRestApi.mesBiEndpoint") +
    `lineconfigurations/${orgCode}/${lineName}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

  const result = await response.json();
  if (
    result &&
    result["lineConfiguration"] &&
    result["lineConfiguration"] !== null
  ) {
    const line = result["lineConfiguration"];
    const config: LineConfiguration = {
      lineName: line["lineName"],
      orgCode: +line["orgCode"],
      description: line["description"],
      payrollDeptName: line["payrollDeptName"] ?? "",
      costCenterName: line["costCenterName"],
      payrollDeptId: +line["payrollDeptID"],
      costCenterId: +line["costCenterID"],
      payrollDeptIdOverride: +line["payrollDeptIDOverride"] ?? 0,
      payrollDeptIdEffective: +line["payrollDeptIDEffective"],
      productGroup: line["productGroup"] ?? "",
      productGroupId: +line["productGroupID"],
      reportGroupName: line["reportGroupName"] ?? "",
      reportGroupId: +line["reportGroupID"] ?? 0,
      reportGroupOverride: line["reportGroupOverride"],
      legacyGroupName: line["legacyGroupName"] ?? "",
      legacyLineId: +line["legacyLineID"],
      legacyGroupId: +line["legacyGroupID"] ?? 0,
      defaultCycleTime: +line["defaultCycleTime"] ?? 0,
      startMfgOperation: +line["startMfgOperation"] ?? 0,
      endMfgOperation: +line["endMfgOperation"] ?? 0,
      startOperation: line["startOperation"] ?? "",
      endOperation: line["endOperation"] ?? "",
      assemblyMfgOperation: +line["assemblyMFGOperation"] ?? 0,
      assemblyRatio: +line["assemblyRatio"] ?? 0,
      ebsLineId: +line["ebsLineID"],
      updatedBy: line["updatedBy"],
      recordLastUpdated: new Date(line["recordLastUpdated"]),
      minParts: +line["minParts"],
      startDate: new Date(line["startDate"]),
      endDate: line["endDate"] ? new Date(line["endDate"]) : undefined,
      endDateOverride: line["endDateOverride"]
        ? new Date(line["endDateOverride"])
        : undefined,
      excludeForLmp: line["excludeForLMP"],
      isWipDiscrete: line["isWipDiscrete"],
      startEndFromRoutes: line["startEndFromRoutes"],
      useMfgOperationsForYields: line["useMfgOperationsForYields"],
      calculateAssetOEE: line["calculateAssetOEE"],
      calculateStandardOEE: line["calculateStandardOEE"],
      useCompletionTimestamps: line["useCompletionTimestamps"],
      manuallyCreated: line["manuallyCreated"],
      autoEndDate: line["autoEndDate"],
      lmpOverride: line["lmpOverride"],
      mesDefectsEnabled: line["mesDefectsEnabled"],
      prodTimeFromEndOp: line["prodTimeFromEndOp"],
      trackOperatorCounts: line["trackOperatorCounts"],
      includeOEE: line["includeOEE"],
      includeYield: line["includeYield"],
      includeRejects: line["includeRejects"],
      includeScrapCost: line["includeScrapCost"],
      includeScheduleAttainment: line["includeScheduleAttainment"],
      includePpm: line["includePpm"],
      includeHours: line["includeHours"],
      includeEfficiency: line["includeEfficiency"],
      sendTimeFirst: +line["sendTimeFirst"] ?? 0,
      sendTimeSecond: +line["sendTimeSecond"] ?? 0,
      sendTimeThird: +line["sendTimeThird"] ?? 0,
      combineReports: line["combineReports"],
      combineStats: line["combineStats"],
      parentLineName: line["parentLineName"] ?? "",
      parentOrgCode: +line["parentOrgCode"] ?? 0,
      subLines: line["subLines"] ?? "",
      mesPlatformVersion: line["mesPlatformVersion"],
    };
    return config;
  }
}

export async function getLineConfigurationsAll(): Promise<LineConfiguration[]> {
  const url = config.get<string>("mesRestApi.mesBiEndpoint") + "lines";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

  let configs: LineConfiguration[] = [];
  const result = await response.json();
  if (result) {
    configs = result.map((line: any) => {
      const config: LineConfiguration = {
        lineName: line["lineName"],
        orgCode: +line["orgCode"],
        description: line["description"],
        payrollDeptName: line["payrollDeptName"] ?? "",
        costCenterName: line["costCenterName"],
        payrollDeptId: +line["payrollDeptID"],
        costCenterId: +line["costCenterID"],
        payrollDeptIdOverride: +line["payrollDeptIDOverride"] ?? 0,
        payrollDeptIdEffective: +line["payrollDeptIDEffective"],
        productGroup: line["productGroup"] ?? "",
        productGroupId: +line["productGroupID"],
        reportGroupName: line["reportGroupName"] ?? "",
        reportGroupId: +line["reportGroupID"] ?? 0,
        reportGroupOverride: line["reportGroupOverride"],
        legacyGroupName: line["legacyGroupName"] ?? "",
        legacyLineId: +line["legacyLineID"],
        legacyGroupId: +line["legacyGroupID"] ?? 0,
        defaultCycleTime: +line["defaultCycleTime"] ?? 0,
        startMfgOperation: +line["startMfgOperation"] ?? 0,
        endMfgOperation: +line["endMfgOperation"] ?? 0,
        startOperation: line["startOperation"] ?? "",
        endOperation: line["endOperation"] ?? "",
        assemblyMfgOperation: +line["assemblyMFGOperation"] ?? 0,
        assemblyRatio: +line["assemblyRatio"] ?? 0,
        ebsLineId: +line["ebsLineID"],
        updatedBy: line["updatedBy"],
        recordLastUpdated: new Date(line["recordLastUpdated"]),
        minParts: +line["minParts"],
        startDate: new Date(line["startDate"]),
        endDate: line["endDate"] ? new Date(line["endDate"]) : undefined,
        endDateOverride: line["endDateOverride"]
          ? new Date(line["endDateOverride"])
          : undefined,
        excludeForLmp: line["excludeForLMP"],
        isWipDiscrete: line["isWipDiscrete"],
        startEndFromRoutes: line["startEndFromRoutes"],
        useMfgOperationsForYields: line["useMfgOperationsForYields"],
        calculateAssetOEE: line["calculateAssetOEE"],
        calculateStandardOEE: line["calculateStandardOEE"],
        useCompletionTimestamps: line["useCompletionTimestamps"],
        manuallyCreated: line["manuallyCreated"],
        autoEndDate: line["autoEndDate"],
        lmpOverride: line["lmpOverride"],
        mesDefectsEnabled: line["mesDefectsEnabled"],
        prodTimeFromEndOp: line["prodTimeFromEndOp"],
        trackOperatorCounts: line["trackOperatorCounts"],
        includeOEE: line["includeOEE"],
        includeYield: line["includeYield"],
        includeRejects: line["includeRejects"],
        includeScrapCost: line["includeScrapCost"],
        includeScheduleAttainment: line["includeScheduleAttainment"],
        includePpm: line["includePpm"],
        includeHours: line["includeHours"],
        includeEfficiency: line["includeEfficiency"],
        sendTimeFirst: +line["sendTimeFirst"] ?? 0,
        sendTimeSecond: +line["sendTimeSecond"] ?? 0,
        sendTimeThird: +line["sendTimeThird"] ?? 0,
        combineReports: line["combineReports"],
        combineStats: line["combineStats"],
        parentLineName: line["parentLineName"] ?? "",
        parentOrgCode: +line["parentOrgCode"] ?? 0,
        subLines: line["subLines"] ?? "",
        mesPlatformVersion: line["mesPlatformVersion"],
      };
      return config;
    });
  }
  return configs;
}
