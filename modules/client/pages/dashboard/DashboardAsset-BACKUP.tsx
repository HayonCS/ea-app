// import * as React from "react";
// import { Backdrop, CircularProgress, Typography } from "@mui/material";
// import { makeStyles } from "@mui/styles";
// import {
//   CartesianGrid,
//   Label,
//   Line,
//   LineChart,
//   ReferenceLine,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";
// import { BiAssetInfo } from "../../utilities/types";
// import { dateTimeToString, getHHMMSS } from "../../utilities/date-util";
// import { useParams } from "react-router";
// import {
//   useGetAssetByNameQuery,
//   useGetComboRowsDateRangeLazyQuery,
//   useGetProcessRowsDateRangeLazyQuery,
// } from "client/graphql/types.gen";
// import { useSelector } from "react-redux";
// import { Selectors } from "client/redux/selectors";
// import { UserInformation } from "core/schemas/user-information.gen";
// import { OperatorDisplayDashboard } from "client/components/user-display/OperatorDisplayDashboard";
// import {
//   StatsDataOperatorRow,
//   getStatsDataOperatorRows,
// } from "client/utilities/webdc-data";
// import { SnRow } from "records/combodata";
// import { Message, Subscription, SubscriptionManager } from "@gentex/redis-http";
// import { getTestHistoryById } from "rest-endpoints/test-history/test-history";
// import { getProcessData } from "rest-endpoints/mes-process-data/mes-process-data";
// import { enqueueSnackbar } from "notistack";

// const useStyles = makeStyles(() => ({
//   root: {
//     width: "100%",
//     height: "100%",
//     cursor: "default",
//   },
//   title: {
//     alignSelf: "center",
//     fontSize: "24px",
//     fontWeight: "bold",
//     color: "#000",
//     paddingRight: "10px",
//   },
//   labelData1: {
//     alignSelf: "center",
//     fontSize: "64px",
//     fontWeight: "bold",
//     color: "#003BFF",
//   },
//   labelPart: {
//     alignSelf: "center",
//     fontSize: "112px",
//     fontWeight: "bold",
//     color: "#000",
//     paddingLeft: "calc(100vw / 2 - 530px)",
//     marginTop: "-30px",
//     marginLeft: "60px",
//   },
//   divTotals: {
//     display: "flex",
//   },
// }));

// interface DashboardData {
//   Operator: string;
//   LastRun: Date;
//   PartNumber: string;
//   Passes: number;
//   Fails: number;
//   CycleTime: number;
//   CycleGoal: number;
//   LastSince: number;
//   PartsPerHour: number;
//   RunActual: number;
//   RunTheory: number;
//   Efficiency: number;
// }

// interface GraphData {
//   time: Date;
//   timeString: string;
//   efficiency: number;
//   Efficiency: string;
// }

// let ASSET_RAW_DATA: SnRow[] = [];
// let SUBSCRIBED_DATA: SnRow[] = [];
// let SUBSCRIPTION: Subscription;

// export const DashboardAsset: React.FC<{ asset?: string }> = (props) => {
//   const routeParams = useParams();
//   document.title = `Dashboard | ${props.asset ?? routeParams.asset ?? "?"}`;

//   const classes = useStyles();

//   const subscriptionService = new SubscriptionManager(
//     "https://api.gentex.com/"
//   );

//   const comboAssetData = useSelector(Selectors.ComboData.assetData);
//   const comboPartData = useSelector(Selectors.ComboData.partData);
//   const processAssetData = useSelector(Selectors.ProcessData.assetData);
//   const processPartData = useSelector(Selectors.ProcessData.partData);
//   const cycleTimeInfo = useSelector(Selectors.App.cycleTimeInfo);
//   const assetBiData = useSelector(Selectors.App.assetList);
//   const employeeDirectoryRedux = useSelector(
//     Selectors.App.employeeActiveDirectory
//   );

//   const [assetName, setAssetName] = React.useState("");
//   const [assetInformation, setAssetInformation] = React.useState<BiAssetInfo>();

//   const [rawTestData, setRawTestData] = React.useState<SnRow[]>([]);
//   const [subscribedData, setSubscribedData] = React.useState<SnRow[]>([]);
//   const [prevSubscribedData, setPrevSubscribedData] = React.useState<SnRow[]>(
//     []
//   );
//   const [assetLastTest, setAssetLastTest] = React.useState<SnRow>();
//   const [testPalletCount, setTestPalletCount] = React.useState(1);

//   const [subscribed, setSubscribed] = React.useState(false);
//   const [delayedRetrieval, setDelayedRetrieval] = React.useState(false);
//   const [loadedTestData, setLoadedTestData] = React.useState(false);

//   const [currentOperator, setCurrentOperator] =
//     React.useState<UserInformation>();

//   const [loading, setLoading] = React.useState(true);
//   const [graphData, setGraphData] = React.useState<GraphData[]>([]);

//   const [operatorPerformanceRows, setOperatorPerformanceRows] = React.useState<
//     StatsDataOperatorRow[]
//   >([]);
//   const [dashboardLastData, setDashboardLastData] =
//     React.useState<StatsDataOperatorRow>({
//       id: 0,
//       Asset: props.asset ?? routeParams.asset ?? "",
//       PartNumber: "000-0000",
//       Date: new Date(),
//       StartTime: new Date(),
//       EndTime: new Date(),
//       Passes: 1234,
//       Fails: 123,
//       Line: "",
//       Operator: "",
//       CycleTime: 0,
//       RunActual: 0,
//       RunTheory: 0,
//       Efficiency: 0,
//       PartsPerHour: 0,
//     });
//   const [dashboardData, setDashboardData] = React.useState<DashboardData>({
//     Operator: "00000",
//     LastRun: new Date(),
//     PartNumber: "000-0000",
//     Passes: 0,
//     Fails: 0,
//     CycleTime: 0,
//     CycleGoal: 0,
//     LastSince: 0,
//     PartsPerHour: 0,
//     RunActual: 0,
//     RunTheory: 0,
//     Efficiency: 100,
//   });

//   const [comboDataQuery, comboDataResult] = useGetComboRowsDateRangeLazyQuery();
//   const [processDataQuery, processDataResult] =
//     useGetProcessRowsDateRangeLazyQuery();
//   const assetInfo = useGetAssetByNameQuery({
//     variables: {
//       assetName: assetName,
//     },
//     skip: !assetName,
//     fetchPolicy: "cache-and-network",
//   });

//   const loadDashboardData = (
//     processData: SnRow[],
//     lastTotal: StatsDataOperatorRow
//   ) => {
//     let data: DashboardData = {
//       ...dashboardData,
//       Operator: lastTotal.Operator,
//       LastRun: lastTotal.EndTime,
//       PartNumber: lastTotal.PartNumber,
//       Passes: lastTotal.Passes,
//       Fails: lastTotal.Fails,
//       CycleTime: 0,
//       CycleGoal: lastTotal.CycleTime * testPalletCount,
//       LastSince: !subscribed ? 1 : dashboardData.LastSince,
//       PartsPerHour: lastTotal.PartsPerHour,
//       RunActual: lastTotal.RunActual,
//       RunTheory: lastTotal.RunTheory,
//       Efficiency: lastTotal.Efficiency,
//     };
//     if (processData.length > 0) {
//       let lastTest = processData[processData.length - 1].TestDateTime;
//       let prevTest = assetLastTest?.TestDateTime ?? new Date(lastTest);
//       for (let i = processData.length - 2; i >= 0; i--) {
//         const test = processData[i];
//         if (test.TestDateTime.getTime() !== lastTest.getTime()) {
//           prevTest = test.TestDateTime;
//           break;
//         }
//       }
//       data.CycleTime = (lastTest.getTime() - prevTest.getTime()) / 1000;
//     }
//     setDashboardData(data);
//   };

//   const retrieveAssetData = () => {
//     const endDate = new Date();
//     let startDate = new Date();
//     startDate.setHours(startDate.getHours() - 24);
//     const start = dateTimeToString(startDate);
//     const end = dateTimeToString(endDate);
//     let validAsset = false;
//     if (assetInformation) {
//       if (!assetInformation.assetName.startsWith("PCB")) {
//         const asset = comboAssetData.find(
//           (x) => x.Asset === assetInformation.assetName
//         );
//         if (asset) {
//           validAsset = true;
//           void comboDataQuery({
//             variables: {
//               start: start,
//               end: end,
//               assetIds: [asset.AssetID],
//             },
//           });
//         }
//       } else {
//         const asset = processAssetData.find(
//           (x) => x.Asset === assetInformation.assetName
//         );
//         if (asset) {
//           validAsset = true;
//           void processDataQuery({
//             variables: {
//               start: start,
//               end: end,
//               assetIds: [asset.AssetID],
//             },
//           });
//         }
//       }
//     }
//     if (!validAsset) {
//       setLoading(false);
//       enqueueSnackbar(`Error Loading Dashboard! Invalid asset "${assetName}"`, {
//         variant: "error",
//         autoHideDuration: 5000,
//       });
//     }
//   };

//   const subscriptionFunction = async (message: Message) => {
//     if (message.value && assetInformation) {
//       const isProcess = assetInformation.assetName.startsWith("PCB");
//       const jsonValue = JSON.parse(message.value);
//       if (
//         !isProcess &&
//         jsonValue["IDENTIFIERCODE"] &&
//         jsonValue["OPERATOR"] &&
//         !jsonValue["DESCRIPTION"]
//       ) {
//         const testResult = await getTestHistoryById(
//           jsonValue["IDENTIFIERCODE"],
//           +jsonValue["OPERATIONID"]
//         );
//         if (testResult && testResult.metadataInfo.operator) {
//           const snid =
//             ASSET_RAW_DATA.length > 0 &&
//             ASSET_RAW_DATA[ASSET_RAW_DATA.length - 1] &&
//             ASSET_RAW_DATA[ASSET_RAW_DATA.length - 1].SNID
//               ? ASSET_RAW_DATA[ASSET_RAW_DATA.length - 1].SNID +
//                 SUBSCRIBED_DATA.length +
//                 1
//               : 0;
//           const pnid =
//             comboPartData.find((x) => x.PartNumber === testResult.partNumber)
//               ?.PNID ?? 0;
//           const assetId =
//             comboAssetData.find((x) => x.Asset === testResult.asset)?.AssetID ??
//             0;

//           const newRow: SnRow = {
//             SNID: snid,
//             PNID: pnid,
//             AssetID: assetId,
//             TestDateTime: new Date(testResult.opEndTime),
//             Failed: !testResult.passFail,
//             Retest: false,
//             Traceable: false,
//             TagCount: 0,
//             SN: null,
//             RevID: +testResult.metadataInfo.revision,
//             FailCount: 0,
//             FailedTags: null,
//             OperID: +testResult.operationId,
//             Barcode: testResult.metadataInfo.barcode,
//             MetaDataID: testResult.metadataId,
//             OperatorID: +testResult.metadataInfo.operator,
//             OperationID: String(testResult.operationId),
//           };
//           let newData = [...SUBSCRIBED_DATA];
//           newData.push(newRow);
//           newData = newData
//             .filter((x) => comboPartData.some((a) => a.PNID === x.PNID))
//             .filter(
//               (v, i, s) =>
//                 i === s.findIndex((t) => t.MetaDataID === v.MetaDataID)
//             )
//             .sort(
//               (a, b) => a.TestDateTime.getTime() - b.TestDateTime.getTime()
//             );
//           SUBSCRIBED_DATA = newData;
//           setSubscribedData(newData);
//         }
//       } else if (
//         jsonValue["DESCRIPTION"] &&
//         jsonValue["DESCRIPTION"].toLowerCase().includes("loadvision")
//       ) {
//         let endDate = new Date();
//         let startDate = new Date(endDate);
//         startDate.setMinutes(startDate.getMinutes() - 5);
//         endDate.setMinutes(endDate.getMinutes() + 10);
//         const start = startDate.toISOString();
//         const end = endDate.toISOString();
//         await new Promise((x) => setTimeout(x, 3000));
//         const processData = await getProcessData(
//           assetInformation.assetName,
//           start,
//           end
//         );
//         let newRows: SnRow[] = [];
//         for (const process of processData) {
//           if (
//             process.Description &&
//             process.Description.toLowerCase().includes("loadvision")
//           ) {
//             const snid =
//               ASSET_RAW_DATA.length > 0 &&
//               ASSET_RAW_DATA[ASSET_RAW_DATA.length - 1] &&
//               ASSET_RAW_DATA[ASSET_RAW_DATA.length - 1].SNID
//                 ? ASSET_RAW_DATA[ASSET_RAW_DATA.length - 1].SNID +
//                   SUBSCRIBED_DATA.length +
//                   1
//                 : 0;
//             const pnid =
//               processPartData.find((x) => x.PartNumber === process.PartNumber)
//                 ?.PNID ?? 0;
//             const assetId =
//               processAssetData.find((x) => x.Asset === process.Asset)
//                 ?.AssetID ?? 0;
//             const row: SnRow = {
//               SNID: snid,
//               PNID: pnid,
//               AssetID: assetId,
//               TestDateTime: new Date(process.OpEndTime),
//               Failed: !process.PassFail,
//               Retest: false,
//               Traceable: false,
//               TagCount: 0,
//               SN: null,
//               RevID: +process.Revision,
//               FailCount: 0,
//               FailedTags: null,
//               OperID: +process.OperationId,
//               Barcode: process.Barcode,
//               MetaDataID: process.MetaDataId,
//               OperatorID: +process.Operator,
//               OperationID: String(process.OperationId),
//             };
//             newRows.push(row);
//           }
//         }

//         let date = new Date();
//         date.setSeconds(date.getSeconds() - 60);

//         let newData = [...SUBSCRIBED_DATA];
//         newData = newData.concat(newRows);
//         newData = newData
//           .filter((x) => processPartData.some((a) => a.PNID === x.PNID))
//           .filter(
//             (v, i, s) => i === s.findIndex((t) => t.MetaDataID === v.MetaDataID)
//           )
//           .sort((a, b) => a.TestDateTime.getTime() - b.TestDateTime.getTime());
//         newData = newData.filter(
//           (x) =>
//             x.TestDateTime.getTime() >
//             (assetLastTest?.TestDateTime.getTime() ?? date.getTime())
//         );
//         SUBSCRIBED_DATA = newData;
//         setSubscribedData(newData);
//       }
//     }
//   };

//   React.useEffect(() => {
//     ASSET_RAW_DATA = [];
//     SUBSCRIBED_DATA = [];
//     return () => {
//       ASSET_RAW_DATA = [];
//       SUBSCRIBED_DATA = [];
//       SUBSCRIPTION && SUBSCRIPTION.dispose();
//     };
//   }, []);

//   React.useEffect(() => {
//     if (props.asset) setAssetName(props.asset);
//     else if (routeParams.asset) setAssetName(routeParams.asset);
//   }, [props, routeParams]);

//   React.useEffect(() => {
//     if (
//       assetInfo.called &&
//       !assetInfo.loading &&
//       !assetInfo.error &&
//       assetInfo.data
//     ) {
//       if (assetInfo.data.getAssetByName) {
//         const info: BiAssetInfo = {
//           ...assetInfo.data.getAssetByName,
//         };
//         setAssetInformation(info);
//       } else {
//         setLoading(false);
//         enqueueSnackbar(
//           `Error Loading Dashboard! Invalid asset "${assetInfo.variables?.assetName}"`,
//           {
//             variant: "error",
//             autoHideDuration: 5000,
//           }
//         );
//       }
//     } else if (assetInfo.called && !assetInfo.loading && assetInfo.error) {
//       setLoading(false);
//       enqueueSnackbar(
//         `Error Loading Dashboard! Invalid asset "${assetInfo.variables?.assetName}"`,
//         {
//           variant: "error",
//           autoHideDuration: 5000,
//         }
//       );
//     }
//   }, [assetInfo]);

//   React.useEffect(() => {
//     if (
//       employeeDirectoryRedux.length > 0 &&
//       dashboardData.Operator &&
//       dashboardData.Operator !== "00000"
//     ) {
//       const foundIndex = employeeDirectoryRedux.findIndex((userInfo) => {
//         return userInfo.employeeId === dashboardData.Operator;
//       });

//       if (foundIndex > -1)
//         setCurrentOperator(employeeDirectoryRedux[foundIndex]);
//     }
//   }, [employeeDirectoryRedux, dashboardData]);

//   React.useEffect(() => {
//     if (assetInformation && !loadedTestData) {
//       retrieveAssetData();
//       void (async () => {
//         await subscriptionService.start();
//         SUBSCRIPTION = await subscriptionService.subscribe(
//           `PartTested.Asset:${assetName}`,
//           subscriptionFunction
//         );
//       })();
//       setLoadedTestData(true);
//     }
//   }, [assetInformation, loadedTestData]);

//   React.useEffect(() => {
//     if (subscribedData.length !== prevSubscribedData.length) {
//       setPrevSubscribedData(subscribedData);
//     } else if (subscribedData.length > 0) {
//       const timeoutId = setTimeout(() => {
//         let newData = [...rawTestData];
//         newData = newData.concat(subscribedData);
//         newData = newData.filter(
//           (v, i, s) => i === s.findIndex((t) => t.MetaDataID === v.MetaDataID)
//         );
//         newData = newData.sort(
//           (a, b) => a.TestDateTime.getTime() - b.TestDateTime.getTime()
//         );
//         SUBSCRIBED_DATA = [];
//         ASSET_RAW_DATA = newData;

//         setRawTestData(newData);
//         setSubscribedData([]);
//         setPrevSubscribedData([]);

//         if (!delayedRetrieval) {
//           const timeout = setTimeout(() => {
//             setDelayedRetrieval(true);
//             setSubscribed(true);
//             retrieveAssetData();
//           }, 12000);
//           return () => clearTimeout(timeout);
//         }
//       }, 2000);
//       return () => clearTimeout(timeoutId);
//     }
//   }, [subscribedData, prevSubscribedData, rawTestData, delayedRetrieval]);

//   React.useEffect(() => {
//     const intervalId = setInterval(() => {
//       setDashboardData((x) => {
//         if (x.LastSince === 0) {
//           return x;
//         } else {
//           return {
//             ...x,
//             LastSince: x.LastSince + 1,
//           };
//         }
//       });
//     }, 1000);
//     return () => clearInterval(intervalId);
//   }, [dashboardData]);

//   React.useEffect(() => {
//     if (
//       comboDataResult.called &&
//       !comboDataResult.error &&
//       !comboDataResult.loading &&
//       comboDataResult.data &&
//       comboDataResult.data.comboRowsDateRange
//     ) {
//       const rawData = comboDataResult.data.comboRowsDateRange
//         .map((x) => {
//           return {
//             ...x,
//             TestDateTime: new Date(x.TestDateTime),
//           };
//         })
//         .filter((x) => comboPartData.some((a) => a.PNID === x.PNID))
//         .sort((a, b) => a.TestDateTime.getTime() - b.TestDateTime.getTime());

//       if (rawData.length > 0) {
//         let testDate = rawData[rawData.length - 1].TestDateTime;
//         let palletCount = 1;
//         for (let i = rawData.length - 2; i >= 0; i--) {
//           const timeDiff = Math.abs(
//             rawData[i].TestDateTime.getTime() - testDate.getTime()
//           );
//           if (timeDiff <= 5000) {
//             palletCount += 1;
//           } else {
//             break;
//           }
//         }
//         setTestPalletCount(palletCount);
//       }

//       ASSET_RAW_DATA = rawData;
//       setRawTestData(rawData);
//       const comboTotal = getStatsDataOperatorRows(
//         rawData,
//         comboPartData,
//         comboAssetData,
//         cycleTimeInfo,
//         assetBiData
//       );
//       if (comboTotal.length > 0) {
//         setAssetLastTest(rawData[rawData.length - 1]);
//         setDashboardLastData(comboTotal[comboTotal.length - 1]);
//         loadDashboardData(rawData, comboTotal[comboTotal.length - 1]);
//         setOperatorPerformanceRows(comboTotal);
//         setLoading(false);
//       }
//     }
//   }, [comboDataResult]);

//   React.useEffect(() => {
//     if (
//       processDataResult.called &&
//       !processDataResult.error &&
//       !processDataResult.loading &&
//       processDataResult.data &&
//       processDataResult.data.processRowsDateRange
//     ) {
//       let rawData = processDataResult.data.processRowsDateRange;
//       rawData = rawData
//         .map((x) => {
//           return {
//             ...x,
//             TestDateTime: new Date(x.TestDateTime),
//           };
//         })
//         .filter((x) => processPartData.some((a) => a.PNID === x.PNID));

//       rawData = rawData.sort(
//         (a, b) => a.TestDateTime.getTime() - b.TestDateTime.getTime()
//       );
//       ASSET_RAW_DATA = rawData;
//       setRawTestData(rawData);
//       const processTotal = getStatsDataOperatorRows(
//         rawData,
//         processPartData,
//         processAssetData,
//         cycleTimeInfo,
//         assetBiData
//       );
//       if (processTotal.length > 0) {
//         setAssetLastTest(rawData[rawData.length - 1]);
//         setDashboardLastData(processTotal[processTotal.length - 1]);
//         loadDashboardData(rawData, processTotal[processTotal.length - 1]);
//         setOperatorPerformanceRows(processTotal);
//         setLoading(false);
//       }
//     }
//   }, [processDataResult]);

//   React.useEffect(() => {
//     if (assetInformation) {
//       if (assetInformation.assetName.startsWith("PCB")) {
//         const processTotal = getStatsDataOperatorRows(
//           rawTestData,
//           processPartData,
//           processAssetData,
//           cycleTimeInfo,
//           assetBiData
//         );
//         if (processTotal.length > 0) {
//           setAssetLastTest(rawTestData[rawTestData.length - 1]);
//           setDashboardLastData(processTotal[processTotal.length - 1]);
//           loadDashboardData(rawTestData, processTotal[processTotal.length - 1]);
//           setOperatorPerformanceRows(processTotal);
//           setSubscribed(false);
//           setLoading(false);
//         }
//       } else {
//         const comboTotal = getStatsDataOperatorRows(
//           rawTestData,
//           comboPartData,
//           comboAssetData,
//           cycleTimeInfo,
//           assetBiData
//         );
//         if (comboTotal.length > 0) {
//           setAssetLastTest(rawTestData[rawTestData.length - 1]);
//           setDashboardLastData(comboTotal[comboTotal.length - 1]);
//           loadDashboardData(rawTestData, comboTotal[comboTotal.length - 1]);
//           setOperatorPerformanceRows(comboTotal);
//           setSubscribed(false);
//           setLoading(false);
//         }
//       }
//     }
//   }, [assetInformation, rawTestData]);

//   React.useEffect(() => {
//     let gData: GraphData[] = [];
//     let allData: SnRow[][] = [];
//     for (let i = 0; i < 96; ++i) {
//       allData.push([]);
//     }
//     let rawData = rawTestData.map((x) => {
//       return {
//         ...x,
//         TestDateTime: new Date(x.TestDateTime),
//       };
//     });
//     //assetRawData.forEach((x) => (x.TestDateTime = new Date(x.TestDateTime)));
//     rawData.forEach((procData) => {
//       const hr = procData.TestDateTime.getHours();
//       const mins = procData.TestDateTime.getMinutes();
//       for (let i = 0; i < 24; ++i) {
//         if (hr === i) {
//           if (mins <= 15) {
//             allData[i * 4].push(procData);
//           } else if (mins <= 30) {
//             allData[i * 4 + 1].push(procData);
//           } else if (mins <= 45) {
//             allData[i * 4 + 2].push(procData);
//           } else {
//             allData[i * 4 + 3].push(procData);
//           }
//         }
//       }
//     });
//     allData.forEach((procData) => {
//       if (procData.length > 3) {
//         let work =
//           (procData[procData.length - 1].TestDateTime.getTime() -
//             procData[0].TestDateTime.getTime()) /
//           60000;
//         let goal = (dashboardLastData.CycleTime * procData.length) / 60;
//         let efficiency = (goal / work) * 100;
//         let date = procData[procData.length - 1].TestDateTime;
//         const mins = date.getMinutes();
//         const hours = date.getHours();
//         date.setMinutes(((((mins + 7.5) / 15) | 0) * 15) % 60);
//         date.setHours((((mins / 105 + 0.5) | 0) + hours) % 24);
//         date.setSeconds(0);
//         let data: GraphData = {
//           time: date,
//           timeString: date.toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           }),
//           efficiency: Math.round(efficiency * 100) / 100,
//           Efficiency: (Math.round(efficiency * 100) / 100).toFixed(2) + "%",
//         };
//         gData.push(data);
//       }
//     });
//     gData = gData.sort((a, b) => a.time.getTime() - b.time.getTime());
//     let count = 0;
//     for (let i = gData.length - 1; i >= 0; --i) {
//       if (gData[i]) {
//         if (gData[i].efficiency) {
//           ++count;
//         }
//         if (count > 40) {
//           gData.splice(i, 1);
//           //++i;
//         }
//       }
//     }
//     setGraphData(gData);
//   }, [dashboardLastData, rawTestData]);

//   return (
//     <div className={classes.root}>
//       <Backdrop
//         open={loading}
//         style={{
//           backgroundColor: "rgba(0, 0, 0, 0.8)",
//           color: "#fff",
//           zIndex: 1,
//           flexDirection: "column",
//         }}
//         id="1"
//       >
//         <CircularProgress color="inherit" style={{ marginBottom: "10px" }} />
//         <Typography>Loading...</Typography>
//       </Backdrop>

//       <div className={classes.divTotals}>
//         <Typography
//           style={{
//             alignSelf: "center",
//             fontSize: "24px",
//             fontWeight: "bold",
//             color: "#000",
//             paddingRight: "10px",
//             marginLeft: "8px",
//           }}
//         >
//           {"Passes:"}
//         </Typography>
//         <Typography
//           style={{
//             alignSelf: "center",
//             fontSize: "64px",
//             fontWeight: "bold",
//             color: "#003BFF",
//           }}
//         >
//           {dashboardData.Passes}
//         </Typography>
//         <Typography
//           style={{
//             alignSelf: "center",
//             fontSize: "24px",
//             fontWeight: "bold",
//             color: "#000",
//             paddingRight: "10px",
//             paddingLeft: "48px",
//           }}
//         >
//           {"Fails:"}
//         </Typography>
//         <Typography
//           style={{
//             alignSelf: "center",
//             fontSize: "64px",
//             fontWeight: "bold",
//             color: "#003BFF",
//           }}
//         >
//           {dashboardData.Fails}
//         </Typography>
//         <div
//           style={{
//             marginLeft: "auto",
//             display: "flex",
//           }}
//         >
//           <Typography style={{ fontSize: "24px", marginRight: "8px" }}>
//             {"Asset:"}
//           </Typography>
//           <Typography style={{ fontSize: "24px", fontWeight: "bold" }}>
//             {assetName}
//           </Typography>
//         </div>
//         <div
//           style={{
//             marginLeft: "auto",
//             display: "flex",
//           }}
//         >
//           <Typography style={{ fontSize: "16px", marginRight: "8px" }}>
//             {"Last Run:"}
//           </Typography>
//           <Typography style={{ fontSize: "16px", fontWeight: "bold" }}>
//             {dashboardData.LastRun.toLocaleTimeString()}
//           </Typography>
//         </div>
//       </div>
//       <div style={{ display: "flex", marginTop: "-20px" }}>
//         <Typography
//           style={{
//             alignSelf: "center",
//             fontSize: "24px",
//             fontWeight: "bold",
//             color: "#000",
//             paddingRight: "10px",
//           }}
//         >
//           {"Operator:"}
//         </Typography>
//         {currentOperator ? (
//           <div style={{ display: "flex" }}>
//             <OperatorDisplayDashboard userInfo={currentOperator} />
//           </div>
//         ) : (
//           <Typography
//             style={{
//               alignSelf: "center",
//               fontSize: "64px",
//               fontWeight: "bold",
//               color: "#003BFF",
//             }}
//           >
//             {dashboardData.Operator}
//           </Typography>
//         )}

//         <Typography
//           style={{
//             alignSelf: "center",
//             fontSize: "112px",
//             fontWeight: "bold",
//             color: "#000",
//             paddingLeft: "calc(100vw / 2 - 630px)",
//             marginTop: "-30px",
//             marginLeft: "60px",
//           }}
//         >
//           {dashboardData.PartNumber}
//         </Typography>
//       </div>
//       {/* <div style={{ display: "flex", marginTop: "-40px" }}>
//         <Typography
//           style={{
//             alignSelf: "center",
//             fontSize: "24px",
//             fontWeight: "bold",
//             color: "#000",
//             paddingRight: "10px",
//           }}
//         >
//           {"Parts:"}
//         </Typography>
//         <Typography
//           style={{
//             alignSelf: "center",
//             fontSize: "64px",
//             fontWeight: "bold",
//             color: "#003BFF",
//           }}
//         >
//           {"1234"}
//         </Typography>
//       </div> */}
//       <div
//         style={{ display: "flex", position: "absolute", top: 240, right: 50 }}
//       >
//         <div style={{ paddingRight: "80px" }}>
//           <div style={{ display: "Flex" }}>
//             <Typography
//               style={{
//                 alignSelf: "center",
//                 fontSize: "24px",
//                 fontWeight: "bold",
//                 color: "#000",
//                 paddingRight: "10px",
//               }}
//             >
//               {dashboardData.Efficiency >= 95 ? "Ahead: " : "Behind: "}
//             </Typography>
//             <Typography
//               style={{
//                 alignSelf: "center",
//                 verticalAlign: "center",
//                 fontSize: "64px",
//                 fontWeight: "bold",
//                 color:
//                   dashboardData.Efficiency >= 95
//                     ? "rgb(0, 200, 0)"
//                     : dashboardData.Efficiency >= 85
//                     ? "orange"
//                     : "red",
//               }}
//             >
//               {getHHMMSS(dashboardData.RunTheory - dashboardData.RunActual)}
//             </Typography>
//           </div>
//           {/* <div style={{ display: "Flex", marginTop: "-20px" }}>
//             <Typography
//               style={{
//                 alignSelf: "center",
//                 fontSize: "24px",
//                 fontWeight: "bold",
//                 color: "#000",
//                 paddingRight: "10px",
//               }}
//             >
//               {waveData.efficiencyTotal >= 100
//                 ? "Ahead (Total):"
//                 : " Behind (Total):"}
//               {"Ahead: "}
//             </Typography>
//             <Typography
//               style={{
//                 alignSelf: "center",
//                 fontSize: "64px",
//                 fontWeight: "bold",
//                 color: "#003BFF",
//               }}
//               style={
//                 waveData.efficiencyTotal >= 95
//                   ? { color: "rgb(0, 200, 0)" }
//                   : waveData.efficiencyTotal >= 85
//                   ? { color: "orange" }
//                   : { color: "red" }
//               }
//             >
//               {"hh:mm:ss"}
//             </Typography>
//           </div> */}
//         </div>
//         <div style={{ paddingRight: "80px" }}>
//           <div style={{ display: "flex" }}>
//             <Typography
//               style={{
//                 alignSelf: "center",
//                 fontSize: "24px",
//                 fontWeight: "bold",
//                 color: "#000",
//                 paddingRight: "10px",
//               }}
//             >
//               {"Last Cycle:"}
//             </Typography>
//             <Typography
//               style={{
//                 alignSelf: "center",
//                 fontSize: "64px",
//                 fontWeight: "bold",
//                 color:
//                   dashboardData.CycleTime <= dashboardData.CycleGoal
//                     ? "rgb(0, 200, 0)"
//                     : "red",
//               }}
//             >
//               {(Math.round(dashboardData.CycleTime * 100) / 100).toFixed(1)}
//             </Typography>
//           </div>
//           <div style={{ display: "flex", marginTop: "-20px" }}>
//             <Typography
//               style={{
//                 alignSelf: "center",
//                 fontSize: "24px",
//                 fontWeight: "bold",
//                 color: "#000",
//                 paddingRight: "10px",
//               }}
//             >
//               {"Cycle Goal:"}
//             </Typography>
//             <Typography
//               style={{
//                 alignSelf: "center",
//                 fontSize: "64px",
//                 fontWeight: "bold",
//                 color: "#000",
//               }}
//             >
//               {(Math.round(dashboardData.CycleGoal * 100) / 100).toFixed(1)}
//             </Typography>
//           </div>
//           <div style={{ display: "flex", marginTop: "-20px" }}>
//             <Typography
//               style={{
//                 alignSelf: "center",
//                 fontSize: "24px",
//                 fontWeight: "bold",
//                 color: "#000",
//                 paddingRight: "10px",
//               }}
//             >
//               {"Cycle Timer:"}
//             </Typography>
//             <Typography
//               style={{
//                 alignSelf: "center",
//                 fontSize: "64px",
//                 fontWeight: "bold",
//                 color: "#003BFF",
//               }}
//             >
//               {(Math.round(dashboardData.LastSince * 100) / 100).toFixed(1)}
//             </Typography>
//           </div>
//         </div>
//         <div>
//           <div style={{ display: "flex" }}>
//             <Typography
//               style={{
//                 alignSelf: "center",
//                 fontSize: "24px",
//                 fontWeight: "bold",
//                 color: "#000",
//                 paddingRight: "10px",
//               }}
//             >
//               {"Efficiency:"}
//             </Typography>
//             <Typography
//               style={{
//                 alignSelf: "center",
//                 fontSize: "64px",
//                 fontWeight: "bold",
//                 color:
//                   dashboardData.Efficiency >= 95
//                     ? "rgb(0, 200, 0)"
//                     : dashboardData.Efficiency >= 85
//                     ? "orange"
//                     : "red",
//               }}
//             >
//               {(Math.round(dashboardData.Efficiency * 100) / 100).toFixed(2) +
//                 "%"}
//             </Typography>
//           </div>
//           {/* <div style={{ display: "flex", marginTop: "-20px" }}>
//             <Typography
//               style={{
//                 alignSelf: "center",
//                 fontSize: "24px",
//                 fontWeight: "bold",
//                 color: "#000",
//                 paddingRight: "10px",
//               }}
//             >
//               {"Efficiency (Total):"}
//             </Typography>
//             <Typography
//               style={{
//                 alignSelf: "center",
//                 fontSize: "64px",
//                 fontWeight: "bold",
//                 color: "#003BFF",
//               }}
//               style={
//                 waveData.efficiencyTotal >= 95
//                   ? { color: "rgb(0, 200, 0)" }
//                   : waveData.efficiencyTotal >= 85
//                   ? { color: "orange" }
//                   : { color: "red" }
//               }
//             >
//               {"100%"}
//             </Typography>
//           </div> */}
//         </div>
//       </div>
//       <div style={{ position: "absolute", bottom: 0 }}>
//         <div style={{ display: "flex", marginBottom: "-20px" }}>
//           <Typography
//             style={{
//               alignSelf: "center",
//               fontSize: "24px",
//               fontWeight: "bold",
//               color: "#000",
//               paddingRight: "10px",
//             }}
//           >
//             {"Work (Actual):"}
//           </Typography>
//           <Typography
//             style={{
//               alignSelf: "center",
//               fontSize: "64px",
//               fontWeight: "bold",
//               color:
//                 dashboardData.Efficiency >= 95
//                   ? "rgb(0, 200, 0)"
//                   : dashboardData.Efficiency >= 85
//                   ? "orange"
//                   : "red",
//             }}
//             // style={
//             //   waveData.efficiency >= 95
//             //     ? { color: "rgb(0, 200, 0)" }
//             //     : waveData.efficiency >= 85
//             //     ? { color: "orange" }
//             //     : { color: "red" }
//             // }
//           >
//             {getHHMMSS(dashboardData.RunActual)}
//           </Typography>
//         </div>
//         <div style={{ display: "flex", marginBottom: "-20px" }}>
//           <Typography
//             style={{
//               alignSelf: "center",
//               fontSize: "24px",
//               fontWeight: "bold",
//               color: "#000",
//               paddingRight: "10px",
//             }}
//           >
//             {"Work (Goal):"}
//           </Typography>
//           <Typography
//             style={{
//               alignSelf: "center",
//               fontSize: "64px",
//               fontWeight: "bold",
//               color: "#000",
//             }}
//           >
//             {getHHMMSS(dashboardData.RunTheory)}
//           </Typography>
//         </div>
//         <div style={{ display: "flex", marginBottom: "-20px" }}>
//           <Typography
//             style={{
//               alignSelf: "center",
//               fontSize: "24px",
//               fontWeight: "bold",
//               color: "#000",
//               paddingRight: "10px",
//             }}
//           >
//             {"Total (Actual):"}
//           </Typography>
//           <Typography
//             style={{
//               alignSelf: "center",
//               fontSize: "64px",
//               fontWeight: "bold",
//               color: "#003BFF",
//             }}
//             // style={
//             //   waveData.efficiencyTotal >= 95
//             //     ? { color: "rgb(0, 200, 0)" }
//             //     : waveData.efficiencyTotal >= 85
//             //     ? { color: "orange" }
//             //     : { color: "red" }
//             // }
//           >
//             {"hh:mm:ss"}
//           </Typography>
//         </div>
//         <div style={{ display: "flex", marginBottom: "-20px" }}>
//           <Typography
//             style={{
//               alignSelf: "center",
//               fontSize: "24px",
//               fontWeight: "bold",
//               color: "#000",
//               paddingRight: "10px",
//             }}
//           >
//             {"Total (Goal):"}
//           </Typography>
//           <Typography
//             style={{
//               alignSelf: "center",
//               fontSize: "64px",
//               fontWeight: "bold",
//               color: "#000",
//             }}
//           >
//             {"hh:mm:ss"}
//           </Typography>
//         </div>
//         <div style={{ display: "flex", marginBottom: "-20px" }}>
//           <Typography
//             style={{
//               alignSelf: "center",
//               fontSize: "24px",
//               fontWeight: "bold",
//               color: "#000",
//               paddingRight: "10px",
//             }}
//           >
//             {"Changeover:"}
//           </Typography>
//           <Typography
//             style={{
//               alignSelf: "center",
//               fontSize: "64px",
//               fontWeight: "bold",
//               color: "#000",
//             }}
//           >
//             {"hh:mm:ss"}
//           </Typography>
//         </div>
//         <div style={{ display: "flex" }}>
//           <Typography
//             style={{
//               alignSelf: "center",
//               fontSize: "24px",
//               fontWeight: "bold",
//               color: "#000",
//               paddingRight: "10px",
//             }}
//           >
//             {"Starve Time:"}
//           </Typography>
//           <Typography
//             style={{
//               alignSelf: "center",
//               fontSize: "64px",
//               fontWeight: "bold",
//               color: "#000",
//             }}
//           >
//             {"hh:mm:ss"}
//           </Typography>
//         </div>
//       </div>
//       <div
//         style={{
//           position: "absolute",
//           bottom: 10,
//           right: 0,
//           width: "calc(100vw - 500px)",
//           height: "calc(100vh - 500px)",
//         }}
//       >
//         <ResponsiveContainer width="100%">
//           <LineChart data={[...graphData]} margin={{ right: 100 }}>
//             <CartesianGrid stroke="#000" strokeDasharray="5 5" />
//             <XAxis
//               dataKey="timeString"
//               //interval={"preserveStartEnd"}
//               interval={2}
//               stroke="#000"
//               style={{ fontSize: "1rem" }}
//             >
//               <Label value="Time" offset={0} position="insideBottom" />
//             </XAxis>
//             <YAxis
//               stroke="#000"
//               style={{ fontSize: "1rem" }}
//               interval={2}
//               // domain={[
//               //   0,
//               //   Math.round(
//               //     Math.max(...graphData.map((o) => o.efficiency)) + 10
//               //   ),
//               // ]}
//               domain={[0, 150]}
//               allowDataOverflow={true}
//             >
//               <Label
//                 value="Efficiency"
//                 offset={20}
//                 angle={-90}
//                 position="insideLeft"
//               />
//             </YAxis>

//             <Tooltip wrapperStyle={{ fontSize: "1rem" }} itemStyle={{}} />
//             <ReferenceLine
//               y={100}
//               label={{
//                 value: "100%",
//                 fontSize: "1rem",
//                 position: "right",
//               }}
//               stroke="red"
//               strokeDasharray="5 5"
//               strokeWidth={2}
//             />
//             <Line
//               dataKey="efficiency"
//               stroke="green"
//               strokeWidth={3}
//               activeDot={{ r: 8 }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//         {/* <ResponsiveContainer width="100%">
//           <LineChart data={graphData} margin={{ right: 100 }}>
//             <CartesianGrid stroke="#000" strokeDasharray="5 5" />
//             <XAxis
//               dataKey="timeString"
//               //interval={"preserveStartEnd"}
//               interval={2}
//               stroke="#000"
//               style={{ fontSize: "1rem" }}
//             >
//               <Label value="Time" offset={0} position="insideBottom" />
//             </XAxis>
//             <YAxis
//               stroke="#000"
//               style={{ fontSize: "1rem" }}
//               domain={[
//                 0,
//                 Math.round(
//                   Math.max(...graphData.map((o) => o.efficiency)) + 10
//                 ),
//               ]}
//               // domain={[0, 150]}
//               allowDataOverflow={true}
//             >
//               <Label
//                 value="Efficiency"
//                 offset={20}
//                 angle={-90}
//                 position="insideLeft"
//               />
//             </YAxis>

//             <Tooltip wrapperStyle={{ fontSize: "1rem" }} itemStyle={{}} />
//             <ReferenceLine
//               y={100}
//               label={{
//                 value: "100%",
//                 fontSize: "1rem",
//                 position: "right",
//               }}
//               stroke="red"
//               strokeDasharray="5 5"
//               strokeWidth={2}
//             />
//             <Line
//               dataKey="efficiency"
//               stroke="green"
//               strokeWidth={3}
//               activeDot={{ r: 8 }}
//             />
//           </LineChart>
//         </ResponsiveContainer> */}
//       </div>
//     </div>
//   );
// };

export {};
