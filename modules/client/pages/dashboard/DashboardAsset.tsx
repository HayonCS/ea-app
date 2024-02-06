import * as React from "react";
import {
  AppBar,
  Backdrop,
  Box,
  CircularProgress,
  Paper,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { BiAssetInfo } from "../../utilities/types";
import {
  dateTimeToISOString,
  dateTimeToString,
} from "../../utilities/date-util";
import { useParams } from "react-router";
import {
  useGetAssetByNameQuery,
  useGetComboRowsDateRangeLazyQuery,
  useGetFailedTagsByMetaDataLazyQuery,
  useGetProcessDataExportLazyQuery,
  useGetProcessRowsDateRangeLazyQuery,
} from "client/graphql/types.gen";
import { useSelector } from "react-redux";
import { Selectors } from "client/redux/selectors";
import { UserInformation } from "core/schemas/user-information.gen";
import {
  StatsDataOperatorRow,
  getDashboardStatsOperatorRows,
  getLeaderboardOperatorRows,
  getStatsDataAssetRows,
  getDashboardStatsAssetRows,
} from "client/utilities/webdc-data";
import { SnRow } from "records/combodata";
import { Message, Subscription, SubscriptionManager } from "@gentex/redis-http";
import { getTestHistoryById } from "rest-endpoints/test-history/test-history";
import { getProcessData } from "rest-endpoints/mes-process-data/mes-process-data";
import { enqueueSnackbar } from "notistack";
import { AssetInfoHover } from "../../components/info-display/AssetInfoHover";
import { AssetInfo, LineConfiguration } from "rest-endpoints/mes-bi/mes-bi";
import { DashboardGraphOperator } from "core/schemas/dashboard-graph-operator.gen";
import { DashboardDataOperator } from "core/schemas/dashboard-data-operator.gen";
import { OperatorPerformance } from "./OperatorPerformance";
import * as _ from "lodash";
import { compareObjectArrays } from "client/utilities/process-data";
import SwipeableViews from "react-swipeable-views";
import { AssetPerformance } from "./AssetPerformance";
// import { getFailedTagsByMetadata } from "rest-endpoints/dctools/dctools";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    height: "100%",
    cursor: "default",
  },
  tabBar: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    zIndex: 1,
    height: "24px",
  },
  tabStyle: {
    fontWeight: "bolder",
    fontSize: "14px",
  },
  swipeableView: {
    height: "calc(100vh - 90px)",
    width: "100%",
  },
}));

const TabPanel = (props: any) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Typography component={"span"}>{children}</Typography>
      )}
    </div>
  );
};

const tabProps = (index: any) => {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
};

let ASSET_RAW_DATA: SnRow[] = [];
let SUBSCRIBED_DATA: SnRow[] = [];
let SUBSCRIPTION: Subscription;

export const DashboardAsset: React.FC<{ asset?: string; tabIndex?: number }> = (
  props
) => {
  const routeParams = useParams();
  document.title = `Dashboard | ${props.asset ?? routeParams.asset ?? "?"}`;

  const classes = useStyles();

  const subscriptionService = new SubscriptionManager(
    "https://api.gentex.com/"
  );

  const comboAssetData = useSelector(Selectors.ComboData.assetData);
  const comboPartData = useSelector(Selectors.ComboData.partData);
  const processAssetData = useSelector(Selectors.ProcessData.assetData);
  const processPartData = useSelector(Selectors.ProcessData.partData);
  const assetBiData = useSelector(Selectors.App.assetList);
  const cycleTimeInfo = useSelector(Selectors.App.cycleTimeInfo);
  const bomRoutingsInfo = useSelector(Selectors.App.bomRoutings);
  const lineConfigurationsInfo = useSelector(Selectors.App.lineConfigurations);
  const employeeDirectoryRedux = useSelector(
    Selectors.App.employeeActiveDirectory
  );

  const [tabValue, setTabValue] = React.useState(
    routeParams.tab ? +routeParams.tab : 0
  );

  const [assetName, setAssetName] = React.useState("");
  const [assetInformation, setAssetInformation] = React.useState<BiAssetInfo>();
  const [assetLineConfiguration, setAssetLineConfiguration] =
    React.useState<LineConfiguration>();

  const [rawTestData, setRawTestData] = React.useState<SnRow[]>([]);
  const [subscribedData, setSubscribedData] = React.useState<SnRow[]>([]);
  const [prevSubscribedData, setPrevSubscribedData] = React.useState<SnRow[]>(
    []
  );
  const [assetLastTest, setAssetLastTest] = React.useState<SnRow>();
  // const [testPalletCount, setTestPalletCount] = React.useState(1);

  const [subscribed, setSubscribed] = React.useState(false);
  const [retrievedTestData, setRetrievedTestData] = React.useState({
    webdc: false,
    export: false,
  });
  const [delayedRetrieval, setDelayedRetrieval] = React.useState(false);
  const [initialLoadTestData, setInitialLoadTestData] = React.useState(false);

  const [currentOperator, setCurrentOperator] = React.useState<UserInformation>(
    {
      employeeId: "00000",
      firstName: "First",
      lastName: "Last",
      username: "first.last",
      email: "first.last@gentex.com",
      cellPhone: "6167721590",
      workPhone: "6167721800",
      location: "",
      locationId: 0,
      shift: 0,
      jobTitle: "",
      managerEmployeeId: "00000",
      level: 0,
      erphrLocation: {
        locationId: 0,
        locationCode: "",
        description: "",
        inventoryOrgCode: 0,
        inventoryOrgId: 0,
      },
      isManager: false,
      status: "",
      salaryType: "",
      employeeType: "",
      personType: "",
      payGroup: "",
      preferredLocale: "",
      preferredDisplayLang: "",
      preferredCurrency: "",
      primaryTimezone: "",
      fullTime: false,
      partTime: false,
      roles: [],
      distributionLists: [],
      isServiceAccount: false,
      pager: "00000",
    }
  );

  const [loading, setLoading] = React.useState(true);
  const [graphData, setGraphData] = React.useState<DashboardGraphOperator[]>(
    []
  );

  const [assetPerformanceRows, setAssetPerformanceRows] = React.useState<
    StatsDataOperatorRow[]
  >([]);
  const [operatorLeaderboardRows, setOperatorLeaderboardRows] = React.useState<
    StatsDataOperatorRow[]
  >([]);
  const [operatorPerformanceRows, setOperatorPerformanceRows] = React.useState<
    StatsDataOperatorRow[]
  >([]);
  const [dashboardLastDataOperator, setDashboardLastDataOperator] =
    React.useState<StatsDataOperatorRow>({
      id: 0,
      Asset: props.asset ?? routeParams.asset ?? "",
      PartNumber: "000-0000",
      Date: new Date(),
      StartTime: new Date(),
      EndTime: new Date(),
      Passes: 1234,
      Fails: 123,
      Line: "",
      Operator: "",
      CycleTime: 0,
      RunActual: 0,
      RunTheory: 0,
      Efficiency: 0,
      PartsPerHour: 0,
      PartsPerPallet: 1,
    });
  const [dashboardDataOperator, setDashboardDataOperator] =
    React.useState<DashboardDataOperator>({
      operator: "00000",
      lastRun: new Date(),
      partNumber: "000-0000",
      passes: 0,
      fails: 0,
      cycleLast: 0,
      cycleGoal: 0,
      cycleTimer: 0,
      cycleAvg: 0,
      partsPerPallet: 1,
      partsPerHour: 0,
      partsPerHourGoal: 0,
      runActual: 0,
      runTheory: 0,
      runVariance: 0,
      efficiency: 100,
    });
  const [prevDashboardDataOperator, setPrevDashboardDataOperator] =
    React.useState<DashboardDataOperator>(dashboardDataOperator);
  const [dashboardDataAsset, setDashboardDataAsset] =
    React.useState<DashboardDataOperator>({
      operator: "00000",
      lastRun: new Date(),
      partNumber: "000-0000",
      passes: 0,
      fails: 0,
      cycleLast: 0,
      cycleGoal: 0,
      cycleTimer: 0,
      cycleAvg: 0,
      partsPerPallet: 1,
      partsPerHour: 0,
      partsPerHourGoal: 0,
      runActual: 0,
      runTheory: 0,
      runVariance: 0,
      efficiency: 100,
    });

  const [comboDataQuery, comboDataResult] = useGetComboRowsDateRangeLazyQuery();
  const [processDataQuery, processDataResult] =
    useGetProcessRowsDateRangeLazyQuery();
  const [exportDataQuery, exportDataResult] =
    useGetProcessDataExportLazyQuery();
  const assetInfo = useGetAssetByNameQuery({
    variables: {
      assetName: assetName,
    },
    skip: !assetName,
    fetchPolicy: "cache-and-network",
  });
  const [failedTagsQuery] = useGetFailedTagsByMetaDataLazyQuery();

  const loadDashboardDataOperator = (
    processData: SnRow[],
    lastTotal: StatsDataOperatorRow
  ) => {
    let data: DashboardDataOperator = {
      ...dashboardDataOperator,
      operator: lastTotal.Operator,
      lastRun:
        processData.length > 0
          ? processData[processData.length - 1].TestDateTime
          : lastTotal.EndTime,
      partNumber: lastTotal.PartNumber,
      passes: lastTotal.Passes,
      fails: lastTotal.Fails,
      cycleLast: 0,
      cycleGoal: lastTotal.CycleTime * lastTotal.PartsPerPallet,
      cycleTimer:
        !subscribed && !retrievedTestData.webdc && !retrievedTestData.export
          ? 1
          : dashboardDataOperator.cycleTimer,
      cycleAvg:
        ((dashboardDataOperator.runActual * 60) /
          (dashboardDataOperator.passes +
            dashboardDataOperator.fails -
            dashboardDataOperator.partNumber.split(",").length)) *
        lastTotal.PartsPerPallet,
      partsPerPallet: lastTotal.PartsPerPallet,
      partsPerHour: lastTotal.PartsPerHour,
      partsPerHourGoal:
        lastTotal.RunTheory > 0
          ? (lastTotal.Passes + lastTotal.Fails) / (lastTotal.RunTheory / 60)
          : 0,
      runActual: lastTotal.RunActual,
      runTheory: lastTotal.RunTheory,
      runVariance: lastTotal.RunTheory - lastTotal.RunActual,
      efficiency: lastTotal.Efficiency,
    };
    if (processData.length > 0) {
      let lastTest = processData[processData.length - 1].TestDateTime;
      let prevTest = assetLastTest?.TestDateTime ?? new Date(lastTest);
      for (let i = processData.length - 2; i >= 0; i--) {
        const test = processData[i];
        if (
          test.TestDateTime.getTime() !== lastTest.getTime() ||
          Math.abs(test.TestDateTime.getTime() - lastTest.getTime()) > 5000
        ) {
          prevTest = test.TestDateTime;
          break;
        }
      }
      data.cycleLast = (lastTest.getTime() - prevTest.getTime()) / 1000;
    }
    setDashboardDataOperator(data);

    if (retrievedTestData.webdc && retrievedTestData.export) {
      setRetrievedTestData({
        webdc: false,
        export: false,
      });
    }
  };

  const loadDashboardDataAsset = (
    processData: SnRow[],
    lastTotal: StatsDataOperatorRow
  ) => {
    let data: DashboardDataOperator = {
      ...dashboardDataAsset,
      operator: lastTotal.Operator,
      lastRun:
        processData.length > 0
          ? processData[processData.length - 1].TestDateTime
          : lastTotal.EndTime,
      partNumber: lastTotal.PartNumber,
      passes: lastTotal.Passes,
      fails: lastTotal.Fails,
      cycleLast: 0,
      cycleGoal: lastTotal.CycleTime * lastTotal.PartsPerPallet,
      cycleTimer:
        !subscribed && !retrievedTestData.webdc && !retrievedTestData.export
          ? 1
          : dashboardDataAsset.cycleTimer,
      cycleAvg:
        ((dashboardDataAsset.runActual * 60) /
          (dashboardDataAsset.passes +
            dashboardDataAsset.fails -
            dashboardDataAsset.partNumber.split(",").length)) *
        lastTotal.PartsPerPallet,
      partsPerPallet: lastTotal.PartsPerPallet,
      partsPerHour: lastTotal.PartsPerHour,
      partsPerHourGoal:
        lastTotal.RunTheory > 0
          ? (lastTotal.Passes + lastTotal.Fails) / (lastTotal.RunTheory / 60)
          : 0,
      runActual: lastTotal.RunActual,
      runTheory: lastTotal.RunTheory,
      runVariance: lastTotal.RunTheory - lastTotal.RunActual,
      efficiency: lastTotal.Efficiency,
    };
    if (processData.length > 0) {
      let lastTest = processData[processData.length - 1].TestDateTime;
      let prevTest = assetLastTest?.TestDateTime ?? new Date(lastTest);
      for (let i = processData.length - 2; i >= 0; i--) {
        const test = processData[i];
        if (
          test.TestDateTime.getTime() !== lastTest.getTime() ||
          Math.abs(test.TestDateTime.getTime() - lastTest.getTime()) > 5000
        ) {
          prevTest = test.TestDateTime;
          break;
        }
      }
      data.cycleLast = (lastTest.getTime() - prevTest.getTime()) / 1000;
    }
    setDashboardDataAsset(data);

    if (retrievedTestData.webdc && retrievedTestData.export) {
      setRetrievedTestData({
        webdc: false,
        export: false,
      });
    }
  };

  const retrieveAssetData = () => {
    const endDate = new Date();
    let startDate = new Date();
    startDate.setHours(startDate.getHours() - 24);
    const start = dateTimeToISOString(startDate);
    const end = dateTimeToISOString(endDate);
    let validAsset = false;
    if (assetInformation) {
      if (!assetInformation.assetName.startsWith("PCB")) {
        const asset = comboAssetData.find(
          (x) => x.Asset === assetInformation.assetName
        );
        if (asset) {
          validAsset = true;
          void comboDataQuery({
            variables: {
              start: start,
              end: end,
              assetIds: [asset.AssetID],
            },
          });
        }
      } else {
        const asset = processAssetData.find(
          (x) => x.Asset === assetInformation.assetName
        );
        if (asset) {
          validAsset = true;
          void processDataQuery({
            variables: {
              start: start,
              end: end,
              assetIds: [asset.AssetID],
            },
          });
        }
      }
      void exportDataQuery({
        variables: {
          asset: assetInformation.assetName,
          startDate: dateTimeToString(startDate),
          endDate: dateTimeToString(endDate),
        },
      });
    }
    if (!validAsset) {
      setLoading(false);
      enqueueSnackbar(`Error Loading Dashboard! Invalid asset "${assetName}"`, {
        variant: "error",
        autoHideDuration: 5000,
      });
    }
  };

  const subscriptionFunction = async (message: Message) => {
    if (message.value && assetInformation) {
      const isProcess = assetInformation.assetName.startsWith("PCB");
      const jsonValue = JSON.parse(message.value);
      if (
        !isProcess &&
        jsonValue["IDENTIFIERCODE"] &&
        !jsonValue["IDENTIFIERCODE"].toLowerCase().includes("initial") &&
        jsonValue["OPERATOR"] &&
        !jsonValue["DESCRIPTION"]
      ) {
        const testResult = await getTestHistoryById(
          jsonValue["IDENTIFIERCODE"],
          +jsonValue["OPERATIONID"]
        );
        if (testResult && testResult.metadataInfo.operator) {
          let failedTags: string | null = null;
          if (!testResult.passFail) {
            const tagsQuery = await failedTagsQuery({
              variables: {
                metaDataId: testResult.metadataId,
              },
            });
            if (
              tagsQuery.called &&
              !tagsQuery.loading &&
              !tagsQuery.error &&
              tagsQuery.data
            ) {
              failedTags = tagsQuery.data.getFailedTagsByMetadata.join(",");
            }
          }
          const snid =
            ASSET_RAW_DATA.length > 0 &&
            ASSET_RAW_DATA[ASSET_RAW_DATA.length - 1] &&
            ASSET_RAW_DATA[ASSET_RAW_DATA.length - 1].SNID
              ? ASSET_RAW_DATA[ASSET_RAW_DATA.length - 1].SNID +
                SUBSCRIBED_DATA.length +
                1
              : 0;
          const pnid =
            comboPartData.find((x) => x.PartNumber === testResult.partNumber)
              ?.PNID ?? 0;
          const assetId =
            comboAssetData.find((x) => x.Asset === testResult.asset)?.AssetID ??
            0;

          const newRow: SnRow = {
            SNID: snid,
            PNID: pnid,
            AssetID: assetId,
            TestDateTime: new Date(testResult.opEndTime),
            Failed: !testResult.passFail,
            Retest: false,
            Traceable: false,
            TagCount: 0,
            SN: testResult.identifierCode ?? null,
            RevID: +testResult.metadataInfo.revision,
            FailCount: 0,
            FailedTags: failedTags,
            OperID: +testResult.operationId,
            Barcode: testResult.metadataInfo.barcode,
            MetaDataID: testResult.metadataId,
            OperatorID: +testResult.metadataInfo.operator,
            OperationID: String(testResult.operationId),
          };
          let newData = [...SUBSCRIBED_DATA];
          newData.push(newRow);
          newData = newData
            .filter((x) => comboPartData.some((a) => a.PNID === x.PNID))
            .filter(
              (v, i, s) =>
                i === s.findIndex((t) => t.MetaDataID === v.MetaDataID)
            )
            .sort(
              (a, b) => a.TestDateTime.getTime() - b.TestDateTime.getTime()
            );
          SUBSCRIBED_DATA = newData;
          setSubscribedData(newData);
        }
      } else if (
        jsonValue["DESCRIPTION"] &&
        jsonValue["DESCRIPTION"].toLowerCase().includes("loadvision")
      ) {
        let endDate = new Date();
        let startDate = new Date(endDate);
        startDate.setMinutes(startDate.getMinutes() - 5);
        endDate.setMinutes(endDate.getMinutes() + 10);
        const start = startDate.toISOString();
        const end = endDate.toISOString();
        await new Promise((x) => setTimeout(x, 3000));
        const processData = await getProcessData(
          assetInformation.assetName,
          start,
          end
        );
        let newRows: SnRow[] = [];
        for (const process of processData) {
          if (
            process.Description &&
            process.Description.toLowerCase().includes("loadvision")
          ) {
            let failedTags: string | null = null;
            // if (!process.PassFail) {
            //   failedTags = (
            //     await getFailedTagsByMetadata(process.MetaDataId)
            //   ).join(",");
            // }
            // if (process.Description) {
            //   failedTags = process.Description.split(",").join(", ");
            // }
            // failedTags = (
            //   await getFailedTagsByMetadata(process.MetaDataId)
            // ).join(",");
            const tagsQuery = await failedTagsQuery({
              variables: {
                metaDataId: process.MetaDataId,
              },
            });
            if (
              tagsQuery.called &&
              !tagsQuery.loading &&
              !tagsQuery.error &&
              tagsQuery.data
            ) {
              failedTags = tagsQuery.data.getFailedTagsByMetadata.join(",");
            }

            const snid =
              ASSET_RAW_DATA.length > 0 &&
              ASSET_RAW_DATA[ASSET_RAW_DATA.length - 1] &&
              ASSET_RAW_DATA[ASSET_RAW_DATA.length - 1].SNID
                ? ASSET_RAW_DATA[ASSET_RAW_DATA.length - 1].SNID +
                  SUBSCRIBED_DATA.length +
                  1
                : 0;
            const pnid =
              processPartData.find((x) => x.PartNumber === process.PartNumber)
                ?.PNID ?? 0;
            const assetId =
              processAssetData.find((x) => x.Asset === process.Asset)
                ?.AssetID ?? 0;
            const row: SnRow = {
              SNID: snid,
              PNID: pnid,
              AssetID: assetId,
              TestDateTime: new Date(process.OpEndTime),
              Failed: !process.PassFail,
              Retest: false,
              Traceable: false,
              TagCount: 0,
              SN: process.IdentifierCode ?? null,
              RevID: +process.Revision,
              FailCount: 0,
              FailedTags: failedTags,
              OperID: +process.OperationId,
              Barcode: process.Barcode,
              MetaDataID: process.MetaDataId,
              OperatorID: +process.Operator,
              OperationID: String(process.OperationId),
            };
            newRows.push(row);
          }
        }

        let date = new Date();
        date.setSeconds(date.getSeconds() - 60);

        let newData = [...SUBSCRIBED_DATA];
        newData = newData.concat(newRows);
        newData = newData
          .filter((x) => processPartData.some((a) => a.PNID === x.PNID))
          .filter(
            (v, i, s) => i === s.findIndex((t) => t.MetaDataID === v.MetaDataID)
          )
          .sort((a, b) => a.TestDateTime.getTime() - b.TestDateTime.getTime());
        newData = newData.filter(
          (x) =>
            x.TestDateTime.getTime() >
            (assetLastTest?.TestDateTime.getTime() ?? date.getTime())
        );
        SUBSCRIBED_DATA = newData;
        setSubscribedData(newData);
      }
    }
  };

  React.useEffect(() => {
    ASSET_RAW_DATA = [];
    SUBSCRIBED_DATA = [];
    return () => {
      ASSET_RAW_DATA = [];
      SUBSCRIBED_DATA = [];
      SUBSCRIPTION && SUBSCRIPTION.dispose();
    };
  }, []);

  React.useEffect(() => {
    if (props.asset) setAssetName(props.asset);
    else if (routeParams.asset) setAssetName(routeParams.asset);
  }, [props.asset, routeParams.asset]);

  React.useEffect(() => {
    if (props.tabIndex !== undefined) {
      setTabValue(props.tabIndex);
    } else if (routeParams.tab && !Number.isNaN(routeParams.tab)) {
      setTabValue(+routeParams.tab);
    }
  }, [props.tabIndex, routeParams.tab]);

  React.useEffect(() => {
    if (
      assetInfo.called &&
      !assetInfo.loading &&
      !assetInfo.error &&
      assetInfo.data
    ) {
      if (assetInfo.data.getAssetByName) {
        const info: BiAssetInfo = {
          ...assetInfo.data.getAssetByName,
        };
        setAssetInformation(info);
      } else {
        setLoading(false);
        enqueueSnackbar(
          `Error Loading Dashboard! Invalid asset "${assetInfo.variables?.assetName}"`,
          {
            variant: "error",
            autoHideDuration: 5000,
          }
        );
      }
    } else if (assetInfo.called && !assetInfo.loading && assetInfo.error) {
      setLoading(false);
      enqueueSnackbar(
        `Error Loading Dashboard! Invalid asset "${assetInfo.variables?.assetName}"`,
        {
          variant: "error",
          autoHideDuration: 5000,
        }
      );
    }
  }, [assetInfo]);

  React.useEffect(() => {
    if (assetInformation && lineConfigurationsInfo.length > 0) {
      const lineConfig = lineConfigurationsInfo.find(
        (x) => x.lineName === assetInformation.line
      );
      if (lineConfig) {
        setAssetLineConfiguration(lineConfig);
      }
    }
  }, [assetInformation, lineConfigurationsInfo]);

  React.useEffect(() => {
    if (
      employeeDirectoryRedux.length > 0 &&
      dashboardDataOperator.operator &&
      dashboardDataOperator.operator !== "00000"
    ) {
      const foundIndex = employeeDirectoryRedux.findIndex((userInfo) => {
        return userInfo.employeeId === dashboardDataOperator.operator;
      });

      if (foundIndex > -1) {
        setCurrentOperator(employeeDirectoryRedux[foundIndex]);
      }
    }
  }, [employeeDirectoryRedux, dashboardDataOperator]);

  React.useEffect(() => {
    if (assetInformation && !initialLoadTestData) {
      retrieveAssetData();
      void (async () => {
        await subscriptionService.start();
        SUBSCRIPTION = await subscriptionService.subscribe(
          `PartTested.Asset:${assetName}`,
          subscriptionFunction
        );
      })();
      setInitialLoadTestData(true);
    }
  }, [assetInformation, initialLoadTestData]);

  React.useEffect(() => {
    if (subscribedData.length !== prevSubscribedData.length) {
      setPrevSubscribedData(subscribedData);
    } else if (subscribedData.length > 0) {
      const timeoutId = setTimeout(() => {
        const newData = [...rawTestData, ...subscribedData]
          .filter(
            (v, i, s) => i === s.findIndex((t) => t.MetaDataID === v.MetaDataID)
          )
          .sort((a, b) => a.TestDateTime.getTime() - b.TestDateTime.getTime());
        SUBSCRIBED_DATA = [];
        ASSET_RAW_DATA = newData;

        setRawTestData(newData);
        setSubscribedData([]);
        setPrevSubscribedData([]);

        if (!delayedRetrieval) {
          const timeout = setTimeout(() => {
            setDelayedRetrieval(true);
            setSubscribed(true);
            retrieveAssetData();
          }, 12000);
          return () => clearTimeout(timeout);
        }
        // const timeout = setTimeout(() => {
        //   setDelayedRetrieval(true);
        //   setSubscribed(true);
        //   retrieveAssetData();
        //   console.log("Retrieving after subscription...");
        // }, 12000);
        // return () => clearTimeout(timeout);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [subscribedData, prevSubscribedData, rawTestData, delayedRetrieval]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setDashboardDataOperator((x) => {
        if (x.cycleTimer === 0) {
          return x;
        } else {
          return {
            ...x,
            cycleTimer: x.cycleTimer + 1,
          };
        }
      });
      setDashboardDataAsset((x) => {
        if (x.cycleTimer === 0) {
          return x;
        } else {
          return {
            ...x,
            cycleTimer: x.cycleTimer + 1,
          };
        }
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [dashboardDataOperator]);

  React.useEffect(() => {
    let cycleTimer = document.getElementById("cycle-timer");
    const perc =
      (dashboardDataOperator.cycleGoal / dashboardDataOperator.cycleTimer) *
      100.0;
    if (cycleTimer) {
      cycleTimer.style.backgroundColor =
        perc >= 95
          ? "rgba(0, 200, 0, 0.2)"
          : perc >= 85
          ? "rgba(255, 165, 0, 0.2)"
          : "rgba(255, 0, 0, 0.2)";
    }
    const timeoutId = setTimeout(() => {
      if (cycleTimer) {
        cycleTimer.style.backgroundColor = "transparent";
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [dashboardDataOperator]);

  React.useEffect(() => {
    const dashData = _.omit({ ...dashboardDataOperator }, "cycleTimer");
    const prevDashData = _.omit({ ...prevDashboardDataOperator }, "cycleTimer");
    if (!compareObjectArrays(dashData, prevDashData)) {
      let runTheory = document.getElementById("run-theory-operator");
      let runActual = document.getElementById("run-actual-operator");
      let runVariance = document.getElementById("run-variance-operator");
      let cycleGoal = document.getElementById("cycle-goal-operator");
      let cycleAvg = document.getElementById("cycle-average-operator");
      let cycleLast = document.getElementById("cycle-last-operator");
      let pphTarget = document.getElementById("pph-target-operator");
      let pphAverage = document.getElementById("pph-average-operator");
      let opEfficiency = document.getElementById("efficiency-operator");
      let testCount = document.getElementById("test-count-operator");

      const percCycleAvg =
        (dashboardDataOperator.cycleGoal / dashboardDataOperator.cycleAvg) *
        100;
      const percCycleLast =
        (dashboardDataOperator.cycleGoal / dashboardDataOperator.cycleLast) *
        100;
      const percPph =
        (dashboardDataOperator.partsPerHour /
          dashboardDataOperator.partsPerHourGoal) *
        100;

      if (runTheory && dashData.runTheory !== prevDashData.runTheory) {
        runTheory.style.backgroundColor = "rgba(0, 80, 143, 0.2)";
      }
      if (runActual && dashData.runActual !== prevDashData.runActual) {
        runActual.style.backgroundColor =
          dashboardDataOperator.efficiency >= 95
            ? "rgba(0, 200, 0, 0.2)"
            : dashboardDataOperator.efficiency >= 85
            ? "rgba(255, 165, 0, 0.2)"
            : "rgba(255, 0, 0, 0.2)";
      }
      if (runVariance && dashData.runVariance !== prevDashData.runVariance) {
        runVariance.style.backgroundColor =
          dashboardDataOperator.efficiency >= 95
            ? "rgba(0, 200, 0, 0.2)"
            : dashboardDataOperator.efficiency >= 85
            ? "rgba(255, 165, 0, 0.2)"
            : "rgba(255, 0, 0, 0.2)";
      }
      if (cycleGoal && dashData.cycleGoal !== prevDashData.cycleGoal) {
        cycleGoal.style.backgroundColor = "rgba(0, 80, 143, 0.2)";
      }
      if (cycleAvg && dashData.cycleAvg !== prevDashData.cycleAvg) {
        cycleAvg.style.backgroundColor =
          percCycleAvg >= 95
            ? "rgba(0, 200, 0, 0.2)"
            : percCycleAvg >= 85
            ? "rgba(255, 165, 0, 0.2)"
            : "rgba(255, 0, 0, 0.2)";
      }
      if (
        pphTarget &&
        dashData.partsPerHourGoal !== prevDashData.partsPerHourGoal
      ) {
        pphTarget.style.backgroundColor = "rgba(0, 80, 143, 0.2)";
      }
      if (pphAverage && dashData.partsPerHour !== prevDashData.partsPerHour) {
        pphAverage.style.backgroundColor =
          percPph >= 95
            ? "rgba(0, 200, 0, 0.2)"
            : percPph >= 85
            ? "rgba(255, 165, 0, 0.2)"
            : "rgba(255, 0, 0, 0.2)";
      }
      if (
        testCount &&
        dashData.passes + dashData.fails !==
          prevDashData.passes + prevDashData.fails
      ) {
        testCount.style.backgroundColor = "rgba(0, 141, 255, 0.2)";
      }

      cycleLast &&
        (cycleLast.style.backgroundColor =
          percCycleLast >= 95
            ? "rgba(0, 200, 0, 0.2)"
            : percCycleLast >= 85
            ? "rgba(255, 165, 0, 0.2)"
            : "rgba(255, 0, 0, 0.2)");
      opEfficiency &&
        (opEfficiency.style.backgroundColor =
          dashboardDataOperator.efficiency >= 95
            ? "rgba(0, 200, 0, 0.2)"
            : dashboardDataOperator.efficiency >= 85
            ? "rgba(255, 165, 0, 0.2)"
            : "rgba(255, 0, 0, 0.2)");

      const timeoutId = setTimeout(() => {
        runTheory && (runTheory.style.backgroundColor = "transparent");
        runActual && (runActual.style.backgroundColor = "transparent");
        runVariance && (runVariance.style.backgroundColor = "transparent");
        cycleGoal && (cycleGoal.style.backgroundColor = "transparent");
        cycleAvg && (cycleAvg.style.backgroundColor = "transparent");
        cycleLast && (cycleLast.style.backgroundColor = "transparent");
        pphTarget && (pphTarget.style.backgroundColor = "transparent");
        pphAverage && (pphAverage.style.backgroundColor = "transparent");
        opEfficiency && (opEfficiency.style.backgroundColor = "transparent");
        testCount && (testCount.style.backgroundColor = "transparent");

        setPrevDashboardDataOperator(dashboardDataOperator);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [dashboardDataOperator, prevDashboardDataOperator]);

  React.useEffect(() => {
    if (
      comboDataResult.called &&
      !comboDataResult.error &&
      !comboDataResult.loading &&
      comboDataResult.data &&
      comboDataResult.data.comboRowsDateRange
    ) {
      let filterDate = new Date();
      filterDate.setHours(filterDate.getHours() - 24);
      const newRawData = comboDataResult.data.comboRowsDateRange
        .map((x) => {
          return {
            ...x,
            TestDateTime: new Date(x.TestDateTime),
          };
        })
        .filter((x) => comboPartData.some((a) => a.PNID === x.PNID));
      const rawData = [...ASSET_RAW_DATA, ...newRawData]
        .filter(
          (v, i, s) => i === s.findIndex((t) => t.MetaDataID === v.MetaDataID)
        )
        .filter((x) => x.TestDateTime.getTime() >= filterDate.getTime())
        .sort((a, b) => a.TestDateTime.getTime() - b.TestDateTime.getTime());

      // if (rawData.length > 0) {
      //   let testDate = rawData[rawData.length - 1].TestDateTime;
      //   let palletCount = 1;
      //   for (let i = rawData.length - 2; i >= 0; i--) {
      //     const timeDiff = Math.abs(
      //       rawData[i].TestDateTime.getTime() - testDate.getTime()
      //     );
      //     if (timeDiff <= 5000) {
      //       palletCount += 1;
      //     } else {
      //       break;
      //     }
      //   }
      //   setTestPalletCount(palletCount);
      // }

      setRetrievedTestData((x) => {
        return { ...x, webdc: true };
      });

      ASSET_RAW_DATA = rawData;
      setRawTestData(rawData);
      const comboTotal = getDashboardStatsOperatorRows(
        rawData,
        comboPartData,
        comboAssetData,
        cycleTimeInfo,
        bomRoutingsInfo,
        assetBiData
      );
      const leaderboardRows = getLeaderboardOperatorRows(comboTotal);
      const assetPerformance = getDashboardStatsAssetRows(
        rawData,
        comboPartData,
        comboAssetData,
        cycleTimeInfo,
        bomRoutingsInfo,
        assetBiData
      );
      if (comboTotal.length > 0) {
        setAssetLastTest(rawData[rawData.length - 1]);
        setDashboardLastDataOperator(comboTotal[comboTotal.length - 1]);
        loadDashboardDataOperator(rawData, comboTotal[comboTotal.length - 1]);
        loadDashboardDataAsset(
          rawData,
          assetPerformance[assetPerformance.length - 1]
        );
        setOperatorPerformanceRows(comboTotal);
        setOperatorLeaderboardRows(leaderboardRows);
        setAssetPerformanceRows(assetPerformance);
        setSubscribed(false);
      } else {
        enqueueSnackbar(`No test data in the last 24 hours!`, {
          variant: "warning",
          autoHideDuration: 5000,
        });
      }
      setLoading(false);
    }
  }, [
    comboDataResult,
    cycleTimeInfo,
    bomRoutingsInfo,
    comboPartData,
    comboAssetData,
    assetBiData,
  ]);

  React.useEffect(() => {
    if (
      processDataResult.called &&
      !processDataResult.error &&
      !processDataResult.loading &&
      processDataResult.data &&
      processDataResult.data.processRowsDateRange
    ) {
      let filterDate = new Date();
      filterDate.setHours(filterDate.getHours() - 24);
      const newRawData = processDataResult.data.processRowsDateRange
        .map((x) => {
          return {
            ...x,
            TestDateTime: new Date(x.TestDateTime),
          };
        })
        .filter((x) => processPartData.some((a) => a.PNID === x.PNID));
      const rawData = [...ASSET_RAW_DATA, ...newRawData]
        .filter(
          (v, i, s) => i === s.findIndex((t) => t.MetaDataID === v.MetaDataID)
        )
        .filter((x) => x.TestDateTime.getTime() >= filterDate.getTime())
        .sort((a, b) => a.TestDateTime.getTime() - b.TestDateTime.getTime());

      setRetrievedTestData((x) => {
        return { ...x, webdc: true };
      });

      ASSET_RAW_DATA = rawData;
      setRawTestData(rawData);
      const processTotal = getDashboardStatsOperatorRows(
        rawData,
        processPartData,
        processAssetData,
        cycleTimeInfo,
        bomRoutingsInfo,
        assetBiData
      );
      const leaderboardRows = getLeaderboardOperatorRows(processTotal);
      const assetPerformance = getDashboardStatsAssetRows(
        rawData,
        processPartData,
        processAssetData,
        cycleTimeInfo,
        bomRoutingsInfo,
        assetBiData
      );
      if (processTotal.length > 0) {
        setAssetLastTest(rawData[rawData.length - 1]);
        setDashboardLastDataOperator(processTotal[processTotal.length - 1]);
        loadDashboardDataOperator(
          rawData,
          processTotal[processTotal.length - 1]
        );
        loadDashboardDataAsset(
          rawData,
          assetPerformance[assetPerformance.length - 1]
        );
        setOperatorPerformanceRows(processTotal);
        setOperatorLeaderboardRows(leaderboardRows);
        setAssetPerformanceRows(assetPerformance);
        setSubscribed(false);
      } else {
        enqueueSnackbar(`No test data in the last 24 hours!`, {
          variant: "warning",
          autoHideDuration: 5000,
        });
      }
      setLoading(false);
    }
  }, [
    processDataResult,
    cycleTimeInfo,
    bomRoutingsInfo,
    processPartData,
    processAssetData,
    assetBiData,
  ]);

  React.useEffect(() => {
    if (
      assetInformation &&
      exportDataResult &&
      exportDataResult.called &&
      !exportDataResult.error &&
      !exportDataResult.loading &&
      exportDataResult.data
    ) {
      void (async () => {
        if (exportDataResult.data) {
          let filterDate = new Date();
          filterDate.setHours(filterDate.getHours() - 24);
          const isPress = assetInformation.assetName.startsWith("PCB");
          const lastSnId =
            ASSET_RAW_DATA.length > 0
              ? ASSET_RAW_DATA[ASSET_RAW_DATA.length - 1].SNID + 1
              : 0;
          let exportDataRows = exportDataResult.data.getProcessDataExport;
          if (isPress) {
            exportDataRows = exportDataRows.filter(
              (x) =>
                x.Description &&
                x.Description.toLowerCase().includes("loadvision")
            );
          } else {
            exportDataRows = exportDataRows.filter(
              (x) => x.OperationId === "120"
            );
          }
          let newRawData: SnRow[] = [];
          for (let i = 0; i < exportDataRows.length; i++) {
            const exportRow = exportDataRows[i];
            let failedTags: string | null = null;
            if (!exportRow.PassFail || isPress) {
              // failedTags = (
              //   await getFailedTagsByMetadata(exportRow.MetaDataId)
              // ).join(",");
              const tagsQuery = await failedTagsQuery({
                variables: {
                  metaDataId: exportRow.MetaDataId,
                },
              });
              if (
                tagsQuery.called &&
                !tagsQuery.loading &&
                !tagsQuery.error &&
                tagsQuery.data
              ) {
                failedTags = tagsQuery.data.getFailedTagsByMetadata.join(",");
              }
            }
            const row: SnRow = {
              SNID: lastSnId + i,
              PNID: !isPress
                ? comboPartData.find(
                    (x) => x.PartNumber === exportRow.PartNumber
                  )?.PNID ?? 0
                : processPartData.find(
                    (x) => x.PartNumber === exportRow.PartNumber
                  )?.PNID ?? 0,
              AssetID: !isPress
                ? comboAssetData.find((x) => x.Asset === exportRow.Asset)
                    ?.AssetID ?? 0
                : processAssetData.find((x) => x.Asset === exportRow.Asset)
                    ?.AssetID ?? 0,
              TestDateTime: new Date(exportRow.OpEndTime),
              Failed: !exportRow.PassFail,
              Retest: false,
              Traceable: false,
              TagCount: 0,
              SN: exportRow.IdentifierCode ?? exportRow.IdentifierCode2,
              RevID: +exportRow.Revision,
              FailCount: 0,
              FailedTags: failedTags,
              OperID: +exportRow.OperationId,
              Barcode: exportRow.Barcode,
              MetaDataID: exportRow.MetaDataId,
              OperatorID: +exportRow.Operator,
              OperationID: exportRow.OperationId,
            };
            newRawData.push(row);
          }

          newRawData = newRawData.filter((x) =>
            !isPress
              ? comboPartData.some((a) => a.PNID === x.PNID)
              : processPartData.some((a) => a.PNID === x.PNID)
          );

          const rawData = [...ASSET_RAW_DATA, ...newRawData]
            .filter(
              (v, i, s) =>
                i === s.findIndex((t) => t.MetaDataID === v.MetaDataID)
            )
            .filter((x) => x.TestDateTime.getTime() >= filterDate.getTime())
            .sort(
              (a, b) => a.TestDateTime.getTime() - b.TestDateTime.getTime()
            );
          setRetrievedTestData((x) => {
            return { ...x, export: true };
          });

          ASSET_RAW_DATA = rawData;
          setRawTestData(rawData);
        }
      })();
    }
  }, [exportDataResult, assetInformation]);

  React.useEffect(() => {
    if (assetInformation) {
      if (assetInformation.assetName.startsWith("PCB")) {
        const processTotal = getDashboardStatsOperatorRows(
          rawTestData,
          processPartData,
          processAssetData,
          cycleTimeInfo,
          bomRoutingsInfo,
          assetBiData
        );
        const leaderboardRows = getLeaderboardOperatorRows(processTotal);
        const assetPerformance = getDashboardStatsAssetRows(
          rawTestData,
          processPartData,
          processAssetData,
          cycleTimeInfo,
          bomRoutingsInfo,
          assetBiData
        );
        if (processTotal.length > 0) {
          setAssetLastTest(rawTestData[rawTestData.length - 1]);
          setDashboardLastDataOperator(processTotal[processTotal.length - 1]);
          loadDashboardDataOperator(
            rawTestData,
            processTotal[processTotal.length - 1]
          );
          loadDashboardDataAsset(
            rawTestData,
            assetPerformance[assetPerformance.length - 1]
          );
          setOperatorPerformanceRows(processTotal);
          setOperatorLeaderboardRows(leaderboardRows);
          setAssetPerformanceRows(assetPerformance);
          setSubscribed(false);
          setLoading(false);
        }
      } else {
        // if (rawTestData.length > 0) {
        //   let testDate = rawTestData[rawTestData.length - 1].TestDateTime;
        //   let palletCount = 1;
        //   for (let i = rawTestData.length - 2; i >= 0; i--) {
        //     const timeDiff = Math.abs(
        //       rawTestData[i].TestDateTime.getTime() - testDate.getTime()
        //     );
        //     if (timeDiff <= 5000) {
        //       palletCount += 1;
        //     } else {
        //       break;
        //     }
        //   }
        //   setTestPalletCount(palletCount);
        // }
        const comboTotal = getDashboardStatsOperatorRows(
          rawTestData,
          comboPartData,
          comboAssetData,
          cycleTimeInfo,
          bomRoutingsInfo,
          assetBiData
        );
        const leaderboardRows = getLeaderboardOperatorRows(comboTotal);
        const assetPerformance = getDashboardStatsAssetRows(
          rawTestData,
          comboPartData,
          comboAssetData,
          cycleTimeInfo,
          bomRoutingsInfo,
          assetBiData
        );
        if (comboTotal.length > 0) {
          setAssetLastTest(rawTestData[rawTestData.length - 1]);
          setDashboardLastDataOperator(comboTotal[comboTotal.length - 1]);
          loadDashboardDataOperator(
            rawTestData,
            comboTotal[comboTotal.length - 1]
          );
          loadDashboardDataAsset(
            rawTestData,
            assetPerformance[assetPerformance.length - 1]
          );
          setOperatorPerformanceRows(comboTotal);
          setOperatorLeaderboardRows(leaderboardRows);
          setAssetPerformanceRows(assetPerformance);
          setSubscribed(false);
          setLoading(false);
        }
      }
    }
  }, [
    assetInformation,
    rawTestData,
    comboPartData,
    comboAssetData,
    processPartData,
    processAssetData,
    cycleTimeInfo,
    bomRoutingsInfo,
    assetBiData,
  ]);

  React.useEffect(() => {
    type GraphTestRows = {
      dateStart: Date;
      dateEnd: Date;
      testRows: SnRow[];
    };
    let gData: DashboardGraphOperator[] = [];
    let allData: GraphTestRows[] = [];
    let currentDate = new Date();
    const currMins = currentDate.getMinutes();
    const currHours = currentDate.getHours();
    currentDate.setMinutes(((((currMins + 15) / 15) | 0) * 15) % 60);
    currentDate.setHours((((currMins / 90 + 0.5) | 0) + currHours) % 24);
    currentDate.setSeconds(0);
    let rangeStart = new Date(currentDate);
    let rangeEnd = new Date(currentDate);
    rangeStart.setMinutes(rangeStart.getMinutes() - 15);
    for (let i = 95; i >= 0; --i) {
      if (i !== 95) {
        rangeStart.setMinutes(rangeStart.getMinutes() - 15);
        rangeEnd.setMinutes(rangeEnd.getMinutes() - 15);
      }
      allData.push({
        dateStart: new Date(rangeStart),
        dateEnd: new Date(rangeEnd),
        testRows: [],
      });
    }

    rawTestData.forEach((procData) => {
      for (let i = 95; i >= 0; --i) {
        const start = allData[i].dateStart;
        const end = allData[i].dateEnd;
        if (
          procData.TestDateTime.getTime() >= start.getTime() &&
          procData.TestDateTime.getTime() < end.getTime()
        ) {
          allData[i].testRows.push(procData);
          break;
        }
      }
    });
    allData.forEach((procData) => {
      if (procData.testRows.length > 0) {
        let work =
          (procData.testRows[
            procData.testRows.length - 1
          ].TestDateTime.getTime() -
            procData.testRows[0].TestDateTime.getTime()) /
          60000;
        let goal =
          (dashboardLastDataOperator.CycleTime * procData.testRows.length) / 60;
        let efficiency = work > 0 ? (goal / work) * 100 : NaN;
        let data: DashboardGraphOperator = {
          dateTime: procData.dateEnd,
          timeString: procData.dateEnd.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          }),
          efficiency: Math.round(efficiency * 100) / 100,
          efficiencyString:
            (Math.round(efficiency * 100) / 100).toFixed(2) + "%",
        };
        gData.push(data);
      } else {
        gData.push({
          dateTime: procData.dateEnd,
          timeString: procData.dateEnd.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          }),
          efficiency: NaN,
          efficiencyString: "0%",
        });
      }
    });
    gData = gData.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
    gData = gData.slice(63, 96);
    setGraphData(gData);
  }, [dashboardLastDataOperator, rawTestData]);

  const graphAverageLeft = () => {
    const nums = [...graphData]
      .slice(0, 16)
      .filter((x) => x.efficiency)
      .map((x) => x.efficiency);
    const sum = nums.reduce((acc, val) => acc + val, 0);
    return nums.length > 0 ? sum / nums.length : -1;
  };

  const graphAverageRight = () => {
    const nums = [...graphData]
      .slice(16, 32)
      .filter((x) => x.efficiency)
      .map((x) => x.efficiency);
    const sum = nums.reduce((acc, val) => acc + val, 0);
    return nums.length > 0 ? sum / nums.length : -1;
  };

  const graphAverageAll = () => {
    const nums = [...graphData]
      .filter((x) => x.efficiency)
      .map((x) => x.efficiency);
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    return (min + max) / 2;
  };

  const graphMinimum = () => {
    const nums = [...graphData]
      .filter((x) => x.efficiency)
      .map((x) => x.efficiency);
    return Math.min(...nums);
  };

  const graphMaximum = () => {
    const nums = [...graphData]
      .filter((x) => x.efficiency)
      .map((x) => x.efficiency);
    return Math.max(...nums);
  };

  return (
    <div className={classes.root}>
      <Backdrop
        open={loading}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "#fff",
          zIndex: 1,
          flexDirection: "column",
        }}
        id="1"
      >
        <CircularProgress color="inherit" style={{ marginBottom: "10px" }} />
        <Typography>Loading...</Typography>
      </Backdrop>

      <Paper className={classes.tabBar}>
        <Tabs
          value={tabValue}
          onChange={(event, newValue) => {
            setTabValue(newValue);
          }}
          indicatorColor="primary"
          textColor="primary"
          centered={true}
          sx={{
            minHeight: "24px",
            maxHeight: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Tab
            label={<Box className={classes.tabStyle}>{"Operator"}</Box>}
            {...tabProps(0)}
          />
          <Tab
            label={<Box className={classes.tabStyle}>{"Asset"}</Box>}
            {...tabProps(1)}
          />
          <Tab
            label={<Box className={classes.tabStyle}>{"*Placeholder*"}</Box>}
            {...tabProps(2)}
          />
        </Tabs>
      </Paper>
      <SwipeableViews
        className={classes.swipeableView}
        axis={"x"}
        index={tabValue}
        onChangeIndex={(index) => {
          setTabValue(index);
        }}
        containerStyle={{ width: "100%", height: "100%" }}
        slideStyle={{ width: "100%", height: "100%" }}
      >
        <TabPanel value={tabValue} index={0}>
          <OperatorPerformance
            assetName={assetName}
            assetInfo={assetInformation as AssetInfo}
            operator={currentOperator}
            rawTestData={rawTestData}
            dashboardData={dashboardDataOperator}
            graphData={graphData}
            leaderboard={operatorLeaderboardRows}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <AssetPerformance
            assetName={assetName}
            assetInfo={assetInformation as AssetInfo}
            operator={currentOperator}
            rawTestData={rawTestData}
            operatorRows={operatorPerformanceRows}
            assetRows={assetPerformanceRows}
            dashboardData={dashboardDataAsset}
            graphData={graphData}
          />
        </TabPanel>
      </SwipeableViews>

      <AppBar
        position="fixed"
        color="primary"
        sx={{ top: "auto", bottom: 0, height: "24px" }}
      >
        <Toolbar variant="dense" sx={{ minHeight: "24px" }}>
          <div style={{ flexGrow: 1 }} />
          <Box
            style={{
              alignSelf: "center",
              fontSize: "12px",
              fontWeight: "300",
              color: "#FFF",
            }}
          >
            {!assetInformation ? (
              `${dashboardDataOperator.partNumber
                .split(",")
                .at(
                  -1
                )}ㅤㅤ|ㅤㅤ${assetName}ㅤㅤ|ㅤㅤLast Test: ${dashboardDataOperator.lastRun.toLocaleDateString()} ${dashboardDataOperator.lastRun.toLocaleTimeString()}`
            ) : (
              <div style={{ display: "flex" }}>
                {`${dashboardDataOperator.partNumber
                  .split(",")
                  .at(-1)}ㅤㅤ|ㅤㅤ`}
                <div>
                  <AssetInfoHover assetInfo={assetInformation as AssetInfo} />
                </div>
                {`ㅤㅤ|ㅤㅤLast Test: ${dashboardDataOperator.lastRun.toLocaleDateString()} ${dashboardDataOperator.lastRun.toLocaleTimeString()}`}
              </div>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
};
