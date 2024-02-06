// import * as React from "react";
// import {
//   Backdrop,
//   Box,
//   Button,
//   Checkbox,
//   CircularProgress,
//   Collapse,
//   FormControl,
//   FormControlLabel,
//   IconButton,
//   InputLabel,
//   LinearProgress,
//   ListItemText,
//   MenuItem,
//   OutlinedInput,
//   Paper,
//   Radio,
//   RadioGroup,
//   Select,
//   SelectChangeEvent,
//   Tab,
//   Tabs,
//   TextField,
//   Tooltip,
//   Typography,
// } from "@mui/material";
// import { makeStyles, withStyles } from "@mui/styles";
// import SwipeableViews from "react-swipeable-views";
// import {
//   DataGrid,
//   GridColDef,
//   GridColumnVisibilityModel,
//   GridFooter,
//   GridFooterContainer,
//   GridInputRowSelectionModel,
//   GridPaginationModel,
//   GridToolbarColumnsButton,
//   GridToolbarContainer,
//   GridToolbarDensitySelector,
//   GridToolbarExport,
// } from "@mui/x-data-grid";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import * as dayjs from "dayjs";
// import { dateTimeToString, getHHMMSS } from "client/utilities/date-util";
// import { UserDisplayHover } from "client/components/user-display/UserDisplayHover";
// import { getProcessDataExportRange } from "client/utilities/redis";
// import { useSelector } from "react-redux";
// import { UserDisplayClick } from "client/components/user-display/UserDisplayClick";
// import { Close, FilterList } from "@mui/icons-material";
// import { ProcessDataExport, ProcessDataRawData } from "client/utilities/types";
// import {
//   getFinalProcessDataPart,
//   getFinalProcessDataPartTotals,
// } from "client/utilities/process-data";
// import { getEmployeeInfoGentex } from "client/utilities/mes";
// import { enqueueSnackbar } from "notistack";
// import { DateTimeHover } from "./DateTimeHover";
// import { Selectors } from "client/redux/selectors";
// import { UserInformation } from "core/schemas/user-information.gen";
// import { getUserInformation } from "client/user-utils";
// import {
//   useGetComboRowsDateRangeLazyQuery,
//   useGetProcessRowsDateRangeLazyQuery,
//   useGetUsersInfoLazyQuery,
// } from "client/graphql/types.gen";
// import {
//   StatsDataOperatorRow,
//   getFinalDataOperator,
//   getFinalProcessDataOperatorTotals,
//   getStatsDataOperatorRows,
// } from "client/utilities/webdc-data";
// import { SnRow } from "records/combodata";
// import { AssetInfoHover } from "./AssetInfoHover";
// import { AssetInfo } from "rest-endpoints/mes-bi/mes-bi";
// import { groupBy } from "client/utilities/array-util";

// const TabPanel = (props: any) => {
//   const { children, value, index, ...other } = props;
//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`tabpanel-${index}`}
//       aria-labelledby={`tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Typography component={"span"}>{children}</Typography>
//       )}
//     </div>
//   );
// };

// const tabProps = (index: any) => {
//   return {
//     id: `tab-${index}`,
//     "aria-controls": `tabpanel-${index}`,
//   };
// };

// const CustomDataGrid = withStyles({
//   root: {
//     border: "none",
//     "&.MuiDataGrid-root .MuiDataGrid-columnHeader": {
//       padding: 0,
//     },
//     "&.MuiDataGrid-root .MuiDataGrid-columnHeaderTitleContainer": {
//       padding: 0,
//       flex: "none",
//     },
//     "&.MuiDataGrid-root .MuiDataGrid-windowContainer": {
//       display: "table-cell",
//     },
//     "&.MuiDataGrid-root .MuiDataGrid-cell": {
//       padding: 0,
//     },
//   },
//   // row: {
//   //   cursor: "pointer",
//   // },
// })(DataGrid);

// interface FooterStatsTotals {
//   Rows: number;
//   Parts: number;
//   Passes: number;
//   Fails: number;
//   RunActual: number;
//   RunTheory: number;
//   Efficiency: number;
//   PartsPerHour: number;
// }

// const useStyles = makeStyles(() => ({
//   root: {
//     width: "100%",
//     height: "100%",
//   },
//   appHeader: {
//     backgroundColor: "#1d222b",
//     width: "100%",
//     height: "96px",
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     fontSize: "calc(10px + 2vmin)",
//     color: "white",
//     paddingTop: "0px",
//   },
//   paperStyle: {
//     backgroundColor: "#F5F5F5",
//     alignItems: "center",
//     flexDirection: "column",
//     justifyContent: "center",
//     width: "100%",
//     height: "calc(100vh - 48px)",
//   },
//   paperStyle1: {
//     backgroundColor: "#F5F5F5",
//     alignItems: "center",
//     flexDirection: "column",
//     justifyContent: "center",
//     width: "100%",
//     height: "calc(100vh - 98px)",
//     borderTop: "2px solid rgba(0, 0, 0, 0.3)",
//   },
//   tabBar: {
//     flexGrow: 1,
//     backgroundColor: "#FFFFFF",
//     zIndex: 1,
//   },
//   tabStyle: {
//     fontWeight: "bolder",
//     fontSize: "1rem",
//   },
//   gridLayout: {
//     display: "flex",
//     flexDirection: "column",
//     height: "100%",
//   },
//   gridItem: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   swipeableView: {
//     height: "calc(100vh - 96px)",
//     width: "100%",
//   },
//   tabPanel: {
//     width: "100%",
//     height: "100%",
//   },
//   cellStyle: {
//     marginRight: "4px",
//     width: "100%",
//     height: "100%",
//     alignItems: "center",
//     color: "black",
//     fontSize: "16px",
//     fontFamily: "inherit",
//     fontWeight: "bold",
//     display: "flex",
//   },
// }));

// let cancelLoadingAssetOperator = false;
// let cancelLoadingAssetPart = false;

// export const Statistics: React.FC<{}> = () => {
//   document.title = "Stats | EA Performance";

//   const classes = useStyles();

//   const comboPartData = useSelector(Selectors.ComboData.partData);
//   const comboAssetData = useSelector(Selectors.ComboData.assetData);
//   const processPartData = useSelector(Selectors.ProcessData.partData);
//   const processAssetData = useSelector(Selectors.ProcessData.assetData);

//   const assetBiData = useSelector(Selectors.App.assetList);
//   const cycleTimeInfo = useSelector(Selectors.App.cycleTimeInfo);
//   const employeeDirectory = useSelector(Selectors.App.employeeActiveDirectory);
//   const userAppData = useSelector(Selectors.App.currentUserAppData);

//   const [tabValueStats, setTabValueStats] = React.useState(0);

//   const [comboDataQueryOperator, comboDataResultOperator] =
//     useGetComboRowsDateRangeLazyQuery();
//   const [processDataQueryOperator, processDataResultOperator] =
//     useGetProcessRowsDateRangeLazyQuery();
//   const [usersInfoQueryOperator, usersInfoResultOperator] =
//     useGetUsersInfoLazyQuery();
//   const [loadingStatsOperator, setLoadingStatsOperator] = React.useState(false);
//   const [loadingProgressOperator, setLoadingProgressOperator] =
//     React.useState(0);
//   const [cancelLoadingOperator, setCancelLoadingOperator] =
//     React.useState(false);
//   const [employeeInfoOperator, setEmployeeInfoOperator] = React.useState<
//     UserInformation[]
//   >([]);
//   const [filterUserInfoOperator, setFilterUserInfoOperator] = React.useState<
//     UserInformation[]
//   >([]);
//   const [filtersOperator, setFiltersOperator] = React.useState<{
//     operators: string[];
//     assets: string[];
//     parts: string[];
//   }>({ operators: [], assets: [], parts: [] });
//   const [filterOperatorRadioOperator, setFilterOperatorRadioOperator] =
//     React.useState("AllOperators");
//   const [filterAssetRadioOperator, setFilterAssetRadioOperator] =
//     React.useState("AllAssets");
//   const [selectionTypeOperator, setSelectionTypeOperator] =
//     React.useState<string>("");
//   const [dateCheckboxOperator, setDateCheckboxOperator] = React.useState(false);
//   const [dateStartOperator, setDateStartOperator] = React.useState(new Date());
//   const [dateEndOperator, setDateEndOperator] = React.useState(new Date());
//   const [rowsDataOperator, setRowsDataOperator] = React.useState<
//     StatsDataOperatorRow[]
//   >([]);
//   const [rowsFilteredDataOperator, setRowsFilteredDataOperator] =
//     React.useState<StatsDataOperatorRow[]>([]);
//   const [paginationModelOperator, setPaginationModelOperator] =
//     React.useState<GridPaginationModel>({
//       page: 0,
//       pageSize: 100,
//     });
//   const [columnVisibilityModelOperator, setColumnVisibilityModelOperator] =
//     React.useState<GridColumnVisibilityModel>({
//       board: false,
//       recipe: false,
//       changeover: false,
//     });
//   const [rowSelectionModelOperator, setRowSelectionModelOperator] =
//     React.useState<GridInputRowSelectionModel>([]);
//   const [footerStatsOperator, setFooterStatsOperator] =
//     React.useState<FooterStatsTotals>({
//       Rows: 0,
//       Parts: 0,
//       Passes: 0,
//       Fails: 0,
//       RunActual: 0,
//       RunTheory: 0,
//       Efficiency: 0,
//       PartsPerHour: 0,
//     });
//   const [showRawDataOperator, setShowRawDataOperator] = React.useState(false);
//   const [filterPanelOpenOperator, setFilterPanelOpenOperator] =
//     React.useState(false);
//   const [
//     filterPanelCloseHoverStateOperator,
//     setFilterPanelCloseHoverStateOperator,
//   ] = React.useState(false);

//   const [comboDataQueryPart, comboDataResultPart] =
//     useGetComboRowsDateRangeLazyQuery();
//   const [processDataQueryPart, processDataResultPart] =
//     useGetProcessRowsDateRangeLazyQuery();
//   const [usersInfoQueryPart, usersInfoResultPart] = useGetUsersInfoLazyQuery();
//   const [loadingStatsPart, setLoadingStatsPart] = React.useState(false);
//   const [loadingProgressPart, setLoadingProgressPart] = React.useState(0);
//   const [cancelLoadingPart, setCancelLoadingPart] = React.useState(false);
//   const [employeeInfoPart, setEmployeeInfoPart] = React.useState<
//     UserInformation[]
//   >([]);
//   const [filterUserInfoPart, setFilterUserInfoPart] = React.useState<
//     UserInformation[]
//   >([]);
//   const [filtersPart, setFiltersPart] = React.useState<{
//     assets: string[];
//     parts: string[];
//   }>({ assets: [], parts: [] });
//   const [filterAssetRadioPart, setFilterAssetRadioPart] =
//     React.useState("AllAssets");
//   const [selectionTypesPart, setSelectionTypesPart] = React.useState<string[]>(
//     []
//   );
//   const [dateCheckboxPart, setDateCheckboxPart] = React.useState(false);
//   const [dateStartPart, setDateStartPart] = React.useState(new Date());
//   const [dateEndPart, setDateEndPart] = React.useState(new Date());
//   const [rowsDataPart, setRowsDataPart] = React.useState<
//     StatsDataOperatorRow[]
//   >([]);
//   const [rowsFilteredDataPart, setRowsFilteredDataPart] = React.useState<
//     StatsDataOperatorRow[]
//   >([]);
//   const [paginationModelPart, setPaginationModelPart] =
//     React.useState<GridPaginationModel>({
//       page: 0,
//       pageSize: 100,
//     });
//   const [columnVisibilityModelPart, setColumnVisibilityModelPart] =
//     React.useState<GridColumnVisibilityModel>({
//       board: false,
//       recipe: false,
//       changeover: false,
//     });
//   const [rowSelectionModelPart, setRowSelectionModelPart] =
//     React.useState<GridInputRowSelectionModel>([]);
//   const [footerStatsPart, setFooterStatsPart] =
//     React.useState<FooterStatsTotals>({
//       Rows: 0,
//       Parts: 0,
//       Passes: 0,
//       Fails: 0,
//       RunActual: 0,
//       RunTheory: 0,
//       Efficiency: 0,
//       PartsPerHour: 0,
//     });
//   const [showRawDataPart, setShowRawDataPart] = React.useState(false);
//   const [filterPanelOpenPart, setFilterPanelOpenPart] = React.useState(false);
//   const [filterPanelCloseHoverStatePart, setFilterPanelCloseHoverStatePart] =
//     React.useState(false);

//   const loadDataParts = async () => {
//     let startDate = new Date(dateStartPart);
//     let endDate = new Date(dateEndPart);
//     startDate.setHours(0);
//     startDate.setMinutes(0);
//     startDate.setSeconds(0);
//     startDate.setMilliseconds(0);
//     if (dateCheckboxPart) endDate = new Date(startDate);
//     endDate.setHours(23);
//     endDate.setMinutes(59);
//     endDate.setSeconds(59);
//     endDate.setMilliseconds(999);
//     const start = dateTimeToString(startDate);
//     const end = dateTimeToString(endDate);
//     const comboParts = comboPartData
//       .filter((x) => selectionTypesPart.includes(x.PartNumber))
//       .map((x) => x.PNID);
//     const processParts = processPartData
//       .filter((x) => selectionTypesPart.includes(x.PartNumber))
//       .map((x) => x.PNID);
//     void comboDataQueryPart({
//       variables: {
//         start: start,
//         end: end,
//         partIds: comboParts,
//       },
//     });
//     void processDataQueryPart({
//       variables: {
//         start: start,
//         end: end,
//         partIds: processParts,
//       },
//     });
//   };

//   const loadDataAllParts = async () => {
//     let startDate = new Date(dateStartPart);
//     let endDate = new Date(dateEndPart);
//     startDate.setHours(0);
//     startDate.setMinutes(0);
//     startDate.setSeconds(0);
//     startDate.setMilliseconds(0);
//     if (dateCheckboxPart) endDate = new Date(startDate);
//     endDate.setHours(23);
//     endDate.setMinutes(59);
//     endDate.setSeconds(59);
//     endDate.setMilliseconds(999);
//     const start = dateTimeToString(startDate);
//     const end = dateTimeToString(endDate);
//     const comboParts = comboPartData.map((x) => x.PNID);
//     const processParts = processPartData.map((x) => x.PNID);
//     void comboDataQueryPart({
//       variables: {
//         start: start,
//         end: end,
//         partIds: comboParts,
//       },
//     });
//     void processDataQueryPart({
//       variables: {
//         start: start,
//         end: end,
//         partIds: processParts,
//       },
//     });
//   };

//   const loadDataAllAssetsOperator = async () => {
//     let startDate = new Date(dateStartOperator);
//     let endDate = new Date(dateEndOperator);
//     startDate.setHours(0);
//     startDate.setMinutes(0);
//     startDate.setSeconds(0);
//     startDate.setMilliseconds(0);
//     if (dateCheckboxOperator) endDate = new Date(startDate);
//     endDate.setHours(23);
//     endDate.setMinutes(59);
//     endDate.setSeconds(59);
//     endDate.setMilliseconds(999);
//     const start = dateTimeToString(startDate);
//     const end = dateTimeToString(endDate);
//     const comboAssets = comboAssetData.map((x) => x.AssetID);
//     const processAssets = processAssetData.map((x) => x.AssetID);
//     void comboDataQueryOperator({
//       variables: {
//         start: start,
//         end: end,
//         assetIds: comboAssets,
//       },
//     });
//     void processDataQueryOperator({
//       variables: {
//         start: start,
//         end: end,
//         assetIds: processAssets,
//       },
//     });
//   };

//   const loadDataUserAssetsOperator = async () => {
//     let startDate = new Date(dateStartOperator);
//     let endDate = new Date(dateEndOperator);
//     startDate.setHours(0);
//     startDate.setMinutes(0);
//     startDate.setSeconds(0);
//     startDate.setMilliseconds(0);
//     if (dateCheckboxOperator) endDate = new Date(startDate);
//     endDate.setHours(23);
//     endDate.setMinutes(59);
//     endDate.setSeconds(59);
//     endDate.setMilliseconds(999);
//     const start = dateTimeToString(startDate);
//     const end = dateTimeToString(endDate);
//     const comboAssets = comboAssetData
//       .filter((x) => userAppData.assetList.includes(x.Asset))
//       .map((x) => x.AssetID);
//     const processAssets = processAssetData
//       .filter((x) => userAppData.assetList.includes(x.Asset))
//       .map((x) => x.AssetID);
//     void comboDataQueryOperator({
//       variables: {
//         start: start,
//         end: end,
//         assetIds: comboAssets,
//       },
//     });
//     void processDataQueryOperator({
//       variables: {
//         start: start,
//         end: end,
//         assetIds: processAssets,
//       },
//     });
//   };

//   const loadDataUserTeamOperator = async () => {
//     let startDate = new Date(dateStartOperator);
//     let endDate = new Date(dateEndOperator);
//     startDate.setHours(0);
//     startDate.setMinutes(0);
//     startDate.setSeconds(0);
//     startDate.setMilliseconds(0);
//     if (dateCheckboxOperator) endDate = new Date(startDate);
//     endDate.setHours(23);
//     endDate.setMinutes(59);
//     endDate.setSeconds(59);
//     endDate.setMilliseconds(999);
//     const start = dateTimeToString(startDate);
//     const end = dateTimeToString(endDate);
//     const operatorIds = userAppData.operators.map((x) => +x);
//     void comboDataQueryOperator({
//       variables: {
//         start: start,
//         end: end,
//         operatorIds: operatorIds,
//       },
//     });
//     void processDataQueryOperator({
//       variables: {
//         start: start,
//         end: end,
//         operatorIds: operatorIds,
//       },
//     });
//   };

//   React.useEffect(() => {
//     void (async () => {
//       if (comboDataResultOperator.called && processDataResultOperator.called) {
//         if (
//           comboDataResultOperator.loading &&
//           processDataResultOperator.loading
//         ) {
//           setLoadingStatsOperator(true);
//           setLoadingProgressOperator(10);
//           enqueueSnackbar("Loading data...", {
//             variant: "info",
//             autoHideDuration: 3000,
//           });
//         } else if (
//           comboDataResultOperator.error ||
//           processDataResultOperator.error
//         ) {
//           setLoadingStatsOperator(false);
//           setLoadingProgressOperator(0);
//           enqueueSnackbar("Error querying data!", {
//             variant: "error",
//             autoHideDuration: 3000,
//           });
//         } else if (
//           comboDataResultOperator.data &&
//           comboDataResultOperator.data.comboRowsDateRange &&
//           processDataResultOperator.data &&
//           processDataResultOperator.data.processRowsDateRange
//         ) {
//           setLoadingProgressOperator(20);
//           let progress = 20;

//           const comboRows = comboDataResultOperator.data.comboRowsDateRange;
//           const processRows =
//             processDataResultOperator.data.processRowsDateRange;

//           const comboTotals = getStatsDataOperatorRows(
//             comboRows,
//             comboPartData,
//             comboAssetData,
//             cycleTimeInfo,
//             assetBiData
//           );
//           const processTotals = getStatsDataOperatorRows(
//             processRows,
//             processPartData,
//             processAssetData,
//             cycleTimeInfo,
//             assetBiData
//           );

//           let totals = [...comboTotals, ...processTotals];

//           // const totals = [...comboTotals, ...processTotals];
//           // let totals = comboTotals.concat(processTotals);
//           totals.forEach((x, i) => (x.id = i));
//           setRowSelectionModelOperator([]);
//           setRowsDataOperator(totals);
//           loadAllEmployeeInfo(totals);
//           setLoadingProgressOperator(100);
//           setLoadingStatsOperator(false);
//           cancelLoadingAssetOperator = false;
//           setCancelLoadingOperator(false);
//           let opList = [...totals]
//             .map((x) => x.Operator)
//             .filter((v, i, a) => a.indexOf(v) === i);
//           let partList = [...totals]
//             .map((x) => x.PartNumber)
//             .filter((v, i, a) => a.indexOf(v) === i);
//           let assetList = [...totals]
//             .map((x) => x.Asset)
//             .filter((v, i, a) => a.indexOf(v) === i);
//           const opFilter = opList.filter((op) =>
//             filtersOperator.operators.includes(op)
//           );
//           const partFilter = partList.filter((part) =>
//             filtersOperator.parts.includes(part)
//           );
//           const assetFilter = assetList.filter((asset) =>
//             filtersOperator.assets.includes(asset)
//           );
//           setFiltersOperator({
//             operators: opFilter,
//             parts: partFilter,
//             assets: assetFilter,
//           });

//           setLoadingStatsOperator(false);
//           setLoadingProgressOperator(0);
//           enqueueSnackbar("Loaded data successfully!", {
//             variant: "success",
//             autoHideDuration: 3000,
//           });
//         }
//       }
//     })();
//   }, [comboDataResultOperator, processDataResultOperator]);

//   React.useEffect(() => {
//     void (async () => {
//       if (comboDataResultPart.called && processDataResultPart.called) {
//         if (comboDataResultPart.loading && processDataResultPart.loading) {
//           setLoadingStatsPart(true);
//           setLoadingProgressPart(10);
//           enqueueSnackbar("Loading data...", {
//             variant: "info",
//             autoHideDuration: 3000,
//           });
//         } else if (comboDataResultPart.error || processDataResultPart.error) {
//           setLoadingStatsPart(false);
//           setLoadingProgressPart(0);
//           enqueueSnackbar("Error querying data!", {
//             variant: "error",
//             autoHideDuration: 3000,
//           });
//         } else if (
//           comboDataResultPart.data &&
//           comboDataResultPart.data.comboRowsDateRange &&
//           processDataResultPart.data &&
//           processDataResultPart.data.processRowsDateRange
//         ) {
//           setLoadingProgressPart(20);
//           let progress = 20;

//           const comboRows = comboDataResultPart.data.comboRowsDateRange;
//           const processRows = processDataResultPart.data.processRowsDateRange;

//           let comboFinal: StatsDataOperatorRow[] = [];
//           let processFinal: StatsDataOperatorRow[] = [];
//           const comboTotals = getStatsDataOperatorRows(
//             comboRows,
//             comboPartData,
//             comboAssetData,
//             cycleTimeInfo,
//             assetBiData
//           );
//           const processTotals = getStatsDataOperatorRows(
//             processRows,
//             processPartData,
//             processAssetData,
//             cycleTimeInfo,
//             assetBiData
//           );
//           comboTotals.forEach((x) => {
//             let foundStat = comboFinal.find(
//               (a) => x.PartNumber === a.PartNumber && x.Asset === a.Asset
//             );
//             if (foundStat) {
//               const foundIndex = comboFinal.indexOf(foundStat);
//               foundStat.Passes += x.Passes;
//               foundStat.Fails += x.Fails;
//               foundStat.RunActual += x.RunActual;
//               foundStat.RunTheory += x.RunTheory;
//               foundStat.Efficiency =
//                 (foundStat.RunTheory / foundStat.RunActual) * 100;
//               foundStat.PartsPerHour =
//                 (foundStat.Passes + foundStat.Fails) /
//                 (foundStat.RunActual / 60);
//               comboFinal[foundIndex] = foundStat;
//             } else {
//               comboFinal.push(x);
//             }
//           });
//           processTotals.forEach((x) => {
//             let foundStat = processFinal.find(
//               (a) => x.PartNumber === a.PartNumber && x.Asset === a.Asset
//             );
//             if (foundStat) {
//               const foundIndex = processFinal.indexOf(foundStat);
//               foundStat.Passes += x.Passes;
//               foundStat.Fails += x.Fails;
//               foundStat.RunActual += x.RunActual;
//               foundStat.RunTheory += x.RunTheory;
//               foundStat.Efficiency =
//                 (foundStat.RunTheory / foundStat.RunActual) * 100;
//               foundStat.PartsPerHour =
//                 (foundStat.Passes + foundStat.Fails) /
//                 (foundStat.RunActual / 60);
//               processFinal[foundIndex] = foundStat;
//             } else {
//               processFinal.push(x);
//             }
//           });

//           let totals = [...comboFinal, ...processFinal];

//           // const totals = [...comboTotals, ...processTotals];
//           // let totals = comboTotals.concat(processTotals);
//           totals.forEach((x, i) => (x.id = i));
//           setRowSelectionModelPart([]);
//           setRowsDataPart(totals);
//           // loadAllEmployeeInfo(totals);
//           setLoadingProgressPart(100);
//           setLoadingStatsPart(false);
//           cancelLoadingAssetPart = false;
//           setCancelLoadingPart(false);
//           let partList = [...totals]
//             .map((x) => x.PartNumber)
//             .filter((v, i, a) => a.indexOf(v) === i);
//           let assetList = [...totals]
//             .map((x) => x.Asset)
//             .filter((v, i, a) => a.indexOf(v) === i);
//           const partFilter = partList.filter((part) =>
//             filtersPart.parts.includes(part)
//           );
//           const assetFilter = assetList.filter((asset) =>
//             filtersPart.assets.includes(asset)
//           );
//           setFiltersPart({
//             parts: partFilter,
//             assets: assetFilter,
//           });

//           setLoadingStatsPart(false);
//           setLoadingProgressPart(0);
//           enqueueSnackbar("Loaded data successfully!", {
//             variant: "success",
//             autoHideDuration: 3000,
//           });
//         }
//       }
//     })();
//   }, [comboDataResultPart, processDataResultPart]);

//   const loadAllEmployeeInfo = (processData: StatsDataOperatorRow[]) => {
//     const ids = processData
//       .map((x) => x.Operator)
//       .filter((v, i, a) => a.indexOf(v) === i)
//       .sort((a, b) => a.localeCompare(b));
//     const usersInfo = employeeDirectory.filter((x) =>
//       ids.includes(x.employeeId)
//     );
//     setEmployeeInfoOperator(usersInfo);
//     const opInfoIds = usersInfo.map((x) => x.employeeId);
//     const missingIds = ids.filter((x) => opInfoIds.indexOf(x) < 0);
//     void usersInfoQueryOperator({
//       variables: {
//         userIdsOrUsernames: missingIds,
//         includeGroups: false,
//       },
//     });
//   };

//   React.useEffect(() => {
//     if (
//       usersInfoResultOperator.called &&
//       !usersInfoResultOperator.error &&
//       !usersInfoResultOperator.loading &&
//       usersInfoResultOperator.data &&
//       usersInfoResultOperator.data.getUsersInfo
//     ) {
//       const usersInfo = usersInfoResultOperator.data.getUsersInfo;
//       setEmployeeInfoOperator((x) =>
//         [...usersInfo, ...x].sort(
//           (a, b) =>
//             a.firstName.localeCompare(b.firstName) ||
//             a.lastName.localeCompare(b.lastName)
//         )
//       );
//     }
//   }, [usersInfoResultOperator]);

//   React.useEffect(() => {
//     setRowSelectionModelOperator([]);
//     let rows = [...rowsDataOperator];
//     if (filtersOperator.assets.length > 0) {
//       rows = rows.filter((x) => filtersOperator.assets.includes(x.Asset));
//     }
//     if (filtersOperator.operators.length > 0) {
//       rows = rows.filter((x) => filtersOperator.operators.includes(x.Operator));
//     }
//     if (filtersOperator.parts.length > 0) {
//       rows = rows.filter((x) => filtersOperator.parts.includes(x.PartNumber));
//     }
//     if (filterOperatorRadioOperator === "MyTeam") {
//       rows = rows.filter((x) => userAppData.operators.includes(x.Operator));
//     }

//     // if (selectionAssetsRadio === "MyAssets") {
//     //   rows = rows.filter((x) => userDataRedux.assetList.includes(x.Asset));
//     // }

//     if (filterOperatorRadioOperator === "AllOperators") {
//       setFilterUserInfoOperator(employeeInfoOperator);
//     } else {
//       setFilterUserInfoOperator(
//         [...employeeInfoOperator].filter((x) =>
//           userAppData.operators.includes(x.employeeId)
//         )
//       );
//     }

//     setRowsFilteredDataOperator(rows);
//     // setNewRows(rows);
//   }, [
//     rowsDataOperator,
//     filtersOperator,
//     filterOperatorRadioOperator,
//     employeeInfoOperator,
//     userAppData,
//   ]);

//   React.useEffect(() => {
//     if (typeof rowSelectionModelOperator !== "number") {
//       let stats: FooterStatsTotals = {
//         Rows: 0,
//         Parts: 0,
//         Passes: 0,
//         Fails: 0,
//         RunActual: 0,
//         RunTheory: 0,
//         Efficiency: 0,
//         PartsPerHour: 0,
//       };
//       for (const gridRowId of rowSelectionModelOperator) {
//         const id = gridRowId as number;
//         const row = rowsDataOperator[id];
//         stats.Rows += 1;
//         stats.Parts += row.Passes + row.Fails;
//         stats.Passes += row.Passes;
//         stats.Fails += row.Fails;
//         stats.RunActual += row.RunActual;
//         stats.RunTheory += row.RunTheory;
//         const efficiency =
//           stats.RunActual > 0 ? (stats.RunTheory / stats.RunActual) * 100 : 100;
//         const partsPerHour =
//           stats.RunActual > 0
//             ? ((stats.Passes + stats.Fails) / stats.RunActual) * 60
//             : stats.Passes + stats.Fails;
//         stats.Efficiency = efficiency;
//         stats.PartsPerHour = partsPerHour;
//       }
//       setFooterStatsOperator(stats);
//     }
//   }, [rowSelectionModelOperator, rowsDataOperator]);

//   const columnsStatsOperator: GridColDef[] = [
//     {
//       field: "Date",
//       headerName: "Date",
//       description: "Date",
//       width: 110,
//       renderCell: (cellValue) => {
//         return (
//           <div className={classes.cellStyle}>
//             {(cellValue.value as Date).toLocaleDateString()}
//           </div>
//         );
//       },
//     },
//     {
//       field: "StartTime",
//       headerName: "Start Time",
//       description: "Start Time",
//       width: 115,
//       renderCell: (cellValue) => {
//         return (
//           <div className={classes.cellStyle}>
//             <DateTimeHover dateTime={cellValue.value as Date} />
//           </div>
//         );
//       },
//     },
//     {
//       field: "EndTime",
//       headerName: "End Time",
//       description: "End Time",
//       width: 115,
//       renderCell: (cellValue) => {
//         return (
//           <div className={classes.cellStyle}>
//             <DateTimeHover dateTime={cellValue.value as Date} />
//           </div>
//         );
//       },
//     },
//     {
//       field: "Asset",
//       headerName: "Asset",
//       description: "Asset",
//       width: 110,
//       renderCell: (cellValue) => {
//         // return <div className={classes.cellStyle}>{cellValue.value}</div>;
//         const foundAsset =
//           comboAssetData.find((x) => x.Asset === cellValue.value) ??
//           processAssetData.find((x) => x.Asset === cellValue.value);
//         const foundAssetInfo: AssetInfo = assetBiData.find(
//           (x) => x.assetName === cellValue.value
//         ) ?? {
//           assetName: foundAsset?.Asset ?? "-",
//           serial: "",
//           model: "",
//           orgCode: "0",
//           line: "-",
//           dateCreated: "",
//           notes: "",
//           reportGroupID: "",
//           excludeFromHealth: false,
//           autoUpdate: false,
//           recordLastUpdated: "",
//           updatedBy: "",
//         };
//         return (
//           <div className={classes.cellStyle}>
//             <AssetInfoHover assetInfo={foundAssetInfo} />
//           </div>
//         );
//       },
//     },
//     {
//       field: "PartNumber",
//       headerName: "Part",
//       description: "Part Number",
//       width: 114,
//       renderCell: (cellValue) => {
//         return <div className={classes.cellStyle}>{cellValue.value}</div>;
//       },
//     },
//     {
//       field: "Passes",
//       headerName: "Passes",
//       description: "Parts Passed",
//       width: 90,
//       renderCell: (cellValue) => {
//         return <div className={classes.cellStyle}>{cellValue.value}</div>;
//       },
//     },
//     {
//       field: "Fails",
//       headerName: "Fails",
//       description: "Parts Failed",
//       width: 90,
//       renderCell: (cellValue) => {
//         return <div className={classes.cellStyle}>{cellValue.value}</div>;
//       },
//     },
//     {
//       field: "Line",
//       headerName: "Line",
//       description: "Line",
//       width: 120,
//       renderCell: (cellValue) => {
//         return <div className={classes.cellStyle}>{cellValue.value}</div>;
//       },
//     },
//     {
//       field: "Operator",
//       headerName: "Operator",
//       description: "Operator",
//       minWidth: 150,
//       flex: 1,
//       renderCell: (cellValue) => {
//         const id = cellValue.value as string;
//         // return <UserDisplayClick userId={id} />;
//         const foundIndex = employeeInfoOperator.findIndex((userInfo) => {
//           return userInfo.employeeId === id;
//         });

//         return foundIndex > -1 ? (
//           <UserDisplayClick userInfo={employeeInfoOperator[foundIndex]} />
//         ) : (
//           <UserDisplayClick userInfo={id} />
//         );
//       },
//     },
//     {
//       field: "CycleTime",
//       headerName: "Cycle Time",
//       description: "Cycle Time (s)",
//       width: 100,
//       renderCell: (cellValue) => {
//         return (
//           <div className={classes.cellStyle}>
//             {(Math.round(cellValue.value * 100) / 100).toFixed(2)}
//           </div>
//         );
//       },
//     },
//     {
//       field: "RunActual",
//       headerName: "Actual",
//       description: "Actual Runtime",
//       width: 100,
//       renderCell: (cellValue) => {
//         const label = getHHMMSS(cellValue.value);
//         return <div className={classes.cellStyle}>{label}</div>;
//       },
//     },
//     {
//       field: "RunTheory",
//       headerName: "Expected",
//       description: "Expected Runtime",
//       width: 100,
//       renderCell: (cellValue) => {
//         const label = getHHMMSS(cellValue.value);
//         return <div className={classes.cellStyle}>{label}</div>;
//       },
//     },
//     {
//       field: "Efficiency",
//       headerName: "Efficiency",
//       description: "Efficiency",
//       width: 100,
//       renderCell: (cellValue) => {
//         const value = Math.round(cellValue.value * 100) / 100;
//         const label = `${value.toFixed(2)}%`;
//         return (
//           <div
//             className={classes.cellStyle}
//             style={{
//               backgroundColor:
//                 value >= 95
//                   ? "rgb(0, 200, 0)"
//                   : value >= 85
//                   ? "orange"
//                   : value > 0
//                   ? "red"
//                   : "#DFDFDF",
//               paddingLeft: "8px",
//               marginRight: "8px",
//             }}
//           >
//             {label}
//           </div>
//         );
//       },
//     },
//     {
//       field: "PartsPerHour",
//       headerName: "PPH",
//       description: "Parts per Hour",
//       minWidth: 80,
//       flex: 1,
//       renderCell: (cellValue) => {
//         return (
//           <div className={classes.cellStyle}>
//             {(Math.round(cellValue.value * 100) / 100).toFixed(2)}
//           </div>
//         );
//       },
//     },
//   ];

//   const columnsStatsPart: GridColDef[] = [
//     {
//       field: "Date",
//       headerName: "Date",
//       description: "Date",
//       width: 110,
//       renderCell: (cellValue) => {
//         return (
//           <div className={classes.cellStyle}>
//             {(cellValue.value as Date).toLocaleDateString()}
//           </div>
//         );
//       },
//     },
//     {
//       field: "StartTime",
//       headerName: "Start Time",
//       description: "Start Time",
//       width: 115,
//       renderCell: (cellValue) => {
//         return (
//           <div className={classes.cellStyle}>
//             <DateTimeHover dateTime={cellValue.value as Date} />
//           </div>
//         );
//       },
//     },
//     {
//       field: "EndTime",
//       headerName: "End Time",
//       description: "End Time",
//       width: 115,
//       renderCell: (cellValue) => {
//         return (
//           <div className={classes.cellStyle}>
//             <DateTimeHover dateTime={cellValue.value as Date} />
//           </div>
//         );
//       },
//     },
//     {
//       field: "Asset",
//       headerName: "Asset",
//       description: "Asset",
//       width: 110,
//       renderCell: (cellValue) => {
//         // return <div className={classes.cellStyle}>{cellValue.value}</div>;
//         const foundAsset =
//           comboAssetData.find((x) => x.Asset === cellValue.value) ??
//           processAssetData.find((x) => x.Asset === cellValue.value);
//         const foundAssetInfo: AssetInfo = assetBiData.find(
//           (x) => x.assetName === cellValue.value
//         ) ?? {
//           assetName: foundAsset?.Asset ?? "-",
//           serial: "",
//           model: "",
//           orgCode: "0",
//           line: "-",
//           dateCreated: "",
//           notes: "",
//           reportGroupID: "",
//           excludeFromHealth: false,
//           autoUpdate: false,
//           recordLastUpdated: "",
//           updatedBy: "",
//         };
//         return (
//           <div className={classes.cellStyle}>
//             <AssetInfoHover assetInfo={foundAssetInfo} />
//           </div>
//         );
//       },
//     },
//     {
//       field: "PartNumber",
//       headerName: "Part",
//       description: "Part Number",
//       width: 114,
//       renderCell: (cellValue) => {
//         return <div className={classes.cellStyle}>{cellValue.value}</div>;
//       },
//     },
//     {
//       field: "Passes",
//       headerName: "Passes",
//       description: "Parts Passed",
//       width: 90,
//       renderCell: (cellValue) => {
//         return <div className={classes.cellStyle}>{cellValue.value}</div>;
//       },
//     },
//     {
//       field: "Fails",
//       headerName: "Fails",
//       description: "Parts Failed",
//       width: 90,
//       renderCell: (cellValue) => {
//         return <div className={classes.cellStyle}>{cellValue.value}</div>;
//       },
//     },
//     {
//       field: "Line",
//       headerName: "Line",
//       description: "Line",
//       width: 120,
//       renderCell: (cellValue) => {
//         return <div className={classes.cellStyle}>{cellValue.value}</div>;
//       },
//     },
//     {
//       field: "CycleTime",
//       headerName: "Cycle Goal",
//       description: "Cycle Time Goal (s)",
//       width: 100,
//       renderCell: (cellValue) => {
//         return (
//           <div className={classes.cellStyle}>
//             {(Math.round(cellValue.value * 100) / 100).toFixed(2)}
//           </div>
//         );
//       },
//     },
//     {
//       field: "AvgCycleTime",
//       headerName: "Cycle Time",
//       description: "Avg. Cycle Time (s)",
//       width: 100,
//       renderCell: (cellValue) => {
//         return (
//           <div className={classes.cellStyle}>
//             {(Math.round(cellValue.value * 100) / 100).toFixed(2)}
//           </div>
//         );
//       },
//     },
//     {
//       field: "RunActual",
//       headerName: "Actual",
//       description: "Actual Runtime",
//       width: 100,
//       renderCell: (cellValue) => {
//         const label = getHHMMSS(cellValue.value);
//         return <div className={classes.cellStyle}>{label}</div>;
//       },
//     },
//     {
//       field: "RunTheory",
//       headerName: "Expected",
//       description: "Expected Runtime",
//       width: 100,
//       renderCell: (cellValue) => {
//         const label = getHHMMSS(cellValue.value);
//         return <div className={classes.cellStyle}>{label}</div>;
//       },
//     },
//     {
//       field: "Efficiency",
//       headerName: "Efficiency",
//       description: "Efficiency",
//       width: 100,
//       renderCell: (cellValue) => {
//         const value = Math.round(cellValue.value * 100) / 100;
//         const label = `${value.toFixed(2)}%`;
//         return (
//           <div
//             className={classes.cellStyle}
//             style={{
//               backgroundColor:
//                 value >= 95
//                   ? "rgb(0, 200, 0)"
//                   : value >= 85
//                   ? "orange"
//                   : value > 0
//                   ? "red"
//                   : "#DFDFDF",
//               paddingLeft: "8px",
//               marginRight: "8px",
//             }}
//           >
//             {label}
//           </div>
//         );
//       },
//     },
//     {
//       field: "PartsPerHour",
//       headerName: "PPH",
//       description: "Parts per Hour",
//       minWidth: 80,
//       flex: 1,
//       renderCell: (cellValue) => {
//         return (
//           <div className={classes.cellStyle}>
//             {(Math.round(cellValue.value * 100) / 100).toFixed(2)}
//           </div>
//         );
//       },
//     },
//   ];

//   const CustomFooterAssetOperator = () => {
//     return (
//       <GridFooterContainer style={{ justifyContent: "right" }}>
//         {footerStatsOperator.Rows > 0 && (
//           <div style={{ display: "flex" }}>
//             <Typography
//               style={{
//                 paddingRight: "20px",
//                 fontSize: "14px",
//                 fontWeight: "bold",
//               }}
//             >
//               {"Parts: " + footerStatsOperator.Parts}
//             </Typography>
//             <Typography
//               style={{
//                 paddingRight: "20px",
//                 fontSize: "14px",
//                 fontWeight: "bold",
//               }}
//             >
//               {"Passes: " + footerStatsOperator.Passes}
//             </Typography>
//             <Typography
//               style={{
//                 paddingRight: "20px",
//                 fontSize: "14px",
//                 fontWeight: "bold",
//               }}
//             >
//               {"Fails: " + footerStatsOperator.Fails}
//             </Typography>
//             <Typography
//               style={{
//                 paddingRight: "20px",
//                 fontSize: "14px",
//                 fontWeight: "bold",
//               }}
//             >
//               {"Actual: " + getHHMMSS(footerStatsOperator.RunActual)}
//             </Typography>
//             <Typography
//               style={{
//                 paddingRight: "20px",
//                 fontSize: "14px",
//                 fontWeight: "bold",
//               }}
//             >
//               {"Theory: " + getHHMMSS(footerStatsOperator.RunTheory)}
//             </Typography>
//             <Typography
//               style={{
//                 paddingRight: "20px",
//                 fontSize: "14px",
//                 fontWeight: "bold",
//               }}
//             >
//               {"Efficiency: " +
//                 (
//                   Math.round(footerStatsOperator.Efficiency * 100) / 100
//                 ).toFixed(2) +
//                 "%"}
//             </Typography>
//             <Typography
//               style={{
//                 paddingRight: "20px",
//                 fontSize: "14px",
//                 fontWeight: "bold",
//               }}
//             >
//               {"PPH: " +
//                 (
//                   Math.round(footerStatsOperator.PartsPerHour * 100) / 100
//                 ).toFixed(2)}
//             </Typography>
//           </div>
//         )}
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => {
//             setShowRawDataOperator(!showRawDataOperator);
//           }}
//         >
//           {showRawDataOperator ? "Close Raw Data" : "View Raw Data"}
//         </Button>

//         <GridFooter style={{ border: "none" }} />
//       </GridFooterContainer>
//     );
//   };

//   const CustomToolbarAssetOperator = () => {
//     return (
//       <GridToolbarContainer>
//         <Button
//           variant="text"
//           color="primary"
//           sx={{ padding: "4px" }}
//           onClick={() => {
//             setFilterPanelOpenOperator((previousValue) => !previousValue);
//           }}
//         >
//           <FilterList style={{ marginRight: "8px" }} />
//           <Typography
//             style={{ fontSize: "14px", marginBottom: "2px", fontWeight: "500" }}
//           >
//             {"Filters"}
//           </Typography>
//         </Button>
//         <GridToolbarColumnsButton />

//         <GridToolbarDensitySelector />
//         <GridToolbarExport />
//       </GridToolbarContainer>
//     );
//   };

//   return (
//     <div className={classes.root}>
//       <Backdrop
//         open={false}
//         style={{
//           backgroundColor: "rgba(0, 0, 0, 0.8)",
//           color: "#fff",
//           zIndex: 1,
//           flexDirection: "column",
//           marginTop: "48px",
//         }}
//       >
//         <CircularProgress color="inherit" style={{ marginBottom: "10px" }} />
//         <Typography>Loading...</Typography>
//       </Backdrop>
//       <Paper className={classes.paperStyle}>
//         <div className={classes.gridLayout}>
//           <Paper className={classes.tabBar}>
//             <Tabs
//               value={tabValueStats}
//               onChange={(event, newValue) => {
//                 setTabValueStats(newValue);
//               }}
//               indicatorColor="primary"
//               textColor="primary"
//               centered={true}
//             >
//               <Tab
//                 label={
//                   <Box className={classes.tabStyle}>{"Operator Stats"}</Box>
//                 }
//                 {...tabProps(0)}
//               />
//               <Tab
//                 label={<Box className={classes.tabStyle}>{"Part Stats"}</Box>}
//                 {...tabProps(1)}
//               />
//               <Tab
//                 label={
//                   <Box className={classes.tabStyle}>{"*Placeholder*"}</Box>
//                 }
//                 {...tabProps(2)}
//               />
//             </Tabs>
//           </Paper>
//           <SwipeableViews
//             className={classes.swipeableView}
//             axis={"x"}
//             index={tabValueStats}
//             onChangeIndex={(index) => {
//               setTabValueStats(index);
//             }}
//             containerStyle={{ width: "100%", height: "100%" }}
//             slideStyle={{ width: "100%", height: "100%" }}
//           >
//             <TabPanel value={tabValueStats} index={0}>
//               <div style={{ cursor: "default", padding: "0 20px" }}>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                   }}
//                 >
//                   <Tooltip
//                     placement="top"
//                     title={
//                       <Typography
//                         style={{ fontSize: "16px", cursor: "default" }}
//                       >
//                         {selectionTypeOperator
//                           ? selectionTypeOperator
//                           : "Choose where to pull data from"}
//                       </Typography>
//                     }
//                   >
//                     <FormControl
//                       sx={{ m: 1, width: 200, margin: "4px 20px 0 0" }}
//                     >
//                       <InputLabel>Choose...</InputLabel>
//                       <Select
//                         value={selectionTypeOperator}
//                         onChange={(event: SelectChangeEvent) => {
//                           setSelectionTypeOperator(
//                             event.target.value as string
//                           );
//                         }}
//                         input={<OutlinedInput label="Choose..." />}
//                         MenuProps={{
//                           PaperProps: {
//                             style: {
//                               maxHeight: 48 * 4.5 + 8,
//                               width: 200,
//                             },
//                           },
//                         }}
//                       >
//                         <MenuItem value={"All Assets"}>All Assets</MenuItem>
//                         <MenuItem value={"My Assets"}>My Assets</MenuItem>
//                         <MenuItem value={"My Team"}>My Team</MenuItem>
//                       </Select>
//                     </FormControl>
//                   </Tooltip>

//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         color="primary"
//                         checked={dateCheckboxOperator}
//                         onChange={(event) => {
//                           setDateCheckboxOperator(event.target.checked);
//                         }}
//                       />
//                     }
//                     labelPlacement="start"
//                     label={
//                       <Typography variant="body1" style={{ fontSize: "14px" }}>
//                         {"Single Date"}
//                       </Typography>
//                     }
//                     style={{ padding: "4px 30px 0 0" }}
//                   />

//                   <LocalizationProvider dateAdapter={AdapterDayjs}>
//                     <DatePicker
//                       format="MM/DD/YYYY"
//                       label="Start"
//                       value={dayjs(dateStartOperator)}
//                       onChange={(date) => {
//                         setDateStartOperator(date ? date.toDate() : new Date());
//                       }}
//                       sx={{
//                         width: "150px",
//                         marginTop: "16px",
//                         paddingBottom: "8px",
//                       }}
//                     />
//                     <Typography
//                       variant="body1"
//                       component={"span"}
//                       style={{ padding: "10px 20px 0 20px" }}
//                     >
//                       {"- to -"}
//                     </Typography>
//                     <DatePicker
//                       format="MM/DD/YYYY"
//                       label="End"
//                       value={dayjs(dateEndOperator)}
//                       onChange={(date) => {
//                         setDateEndOperator(date ? date.toDate() : new Date());
//                       }}
//                       sx={{
//                         width: "150px",
//                         marginTop: "16px",
//                         paddingBottom: "8px",
//                       }}
//                       disabled={dateCheckboxOperator}
//                     />
//                   </LocalizationProvider>

//                   {!loadingStatsOperator ? (
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={() => {
//                         if (selectionTypeOperator === "All Assets") {
//                           void loadDataAllAssetsOperator();
//                         } else if (selectionTypeOperator === "My Assets") {
//                           void loadDataUserAssetsOperator();
//                         } else if (selectionTypeOperator === "My Team") {
//                           void loadDataUserTeamOperator();
//                         }

//                         // setLoadingAssetOperator(true);
//                       }}
//                       style={{ marginLeft: "50px" }}
//                     >
//                       GET
//                     </Button>
//                   ) : (
//                     <Button
//                       variant="contained"
//                       color={!cancelLoadingAssetOperator ? "error" : "warning"}
//                       onClick={() => {
//                         cancelLoadingAssetOperator = true;
//                         setCancelLoadingOperator(true);
//                       }}
//                       style={{ marginLeft: "50px" }}
//                     >
//                       {!cancelLoadingOperator ? "CANCEL" : "CANCELING..."}
//                     </Button>
//                   )}
//                 </div>

//                 {loadingStatsOperator && (
//                   <Box sx={{ width: "100%" }}>
//                     <LinearProgress
//                       variant="determinate"
//                       value={loadingProgressOperator}
//                     />
//                   </Box>
//                 )}

//                 <Paper style={{ display: "flex" }}>
//                   <Collapse
//                     orientation="horizontal"
//                     in={filterPanelOpenOperator}
//                   >
//                     <Paper
//                       style={{
//                         // display: filterPanelOpen ? "flex" : "none",
//                         display: "flex",
//                         height: "100%",
//                       }}
//                     >
//                       <div style={{ width: 260, textAlign: "center" }}>
//                         <IconButton
//                           aria-label="Close"
//                           style={{
//                             color: filterPanelCloseHoverStateOperator
//                               ? "rgba(0, 0, 0, 0.8)"
//                               : "rgba(0, 0, 0, 0.3)",
//                             position: "sticky",
//                             left: 240,
//                           }}
//                           onMouseEnter={() => {
//                             setFilterPanelCloseHoverStateOperator(true);
//                           }}
//                           onMouseLeave={() => {
//                             setFilterPanelCloseHoverStateOperator(false);
//                           }}
//                           onClick={() => {
//                             setFilterPanelOpenOperator((value) => !value);
//                           }}
//                         >
//                           <Close />
//                         </IconButton>
//                         <Typography
//                           style={{
//                             fontSize: "18px",
//                             fontWeight: "bold",
//                             margin: "10px 0 30px 0",
//                           }}
//                         >
//                           {"FILTERS"}
//                         </Typography>
//                         <div>
//                           <FormControl>
//                             <RadioGroup
//                               sx={{ gap: 0 }}
//                               defaultValue="AllOperators"
//                               name="radio-buttons-group"
//                               value={filterOperatorRadioOperator}
//                               onChange={(event) => {
//                                 const radioValue = (
//                                   event.target as HTMLInputElement
//                                 ).value;
//                                 setFilterOperatorRadioOperator(radioValue);
//                                 setFiltersOperator({
//                                   ...filtersOperator,
//                                   operators: [],
//                                 });
//                               }}
//                             >
//                               <FormControlLabel
//                                 value="AllOperators"
//                                 control={<Radio size="small" />}
//                                 label="All Operators"
//                                 style={{ height: "24px" }}
//                               />
//                               <FormControlLabel
//                                 value="MyTeam"
//                                 control={<Radio size="small" />}
//                                 label="My Team"
//                                 style={{ height: "24px" }}
//                               />
//                             </RadioGroup>
//                           </FormControl>
//                           <Tooltip
//                             placement="top"
//                             title={
//                               <Typography
//                                 style={{ fontSize: "16px", cursor: "default" }}
//                               >
//                                 {filtersOperator.operators.length ===
//                                 userAppData.operators.length
//                                   ? "My Entire Team"
//                                   : filtersOperator.operators.length > 0
//                                   ? filtersOperator.operators.join(", ")
//                                   : "Choose some operators"}
//                               </Typography>
//                             }
//                           >
//                             <FormControl
//                               sx={{ m: 1, width: 220, position: "sticky" }}
//                             >
//                               <InputLabel>Operators</InputLabel>
//                               <Select
//                                 multiple={true}
//                                 value={filtersOperator.operators}
//                                 onChange={(
//                                   event: SelectChangeEvent<
//                                     typeof filtersOperator.operators
//                                   >
//                                 ) => {
//                                   const {
//                                     target: { value },
//                                   } = event;
//                                   setFiltersOperator({
//                                     ...filtersOperator,
//                                     operators:
//                                       typeof value === "string"
//                                         ? value.split(",")
//                                         : value,
//                                   });
//                                 }}
//                                 input={<OutlinedInput label="Operators" />}
//                                 renderValue={(selected) => selected.join(", ")}
//                                 MenuProps={{
//                                   PaperProps: {
//                                     style: {
//                                       maxHeight: 240,
//                                       width: 220,
//                                     },
//                                   },
//                                 }}
//                               >
//                                 {filterUserInfoOperator
//                                   .sort(
//                                     (a, b) =>
//                                       a.firstName.localeCompare(b.firstName) ||
//                                       a.lastName.localeCompare(b.lastName)
//                                   )
//                                   .map((user, i) => {
//                                     return (
//                                       <MenuItem
//                                         key={i}
//                                         value={user.employeeId}
//                                         disableGutters={true}
//                                       >
//                                         <Checkbox
//                                           checked={
//                                             filtersOperator.operators.indexOf(
//                                               user.employeeId
//                                             ) > -1
//                                           }
//                                         />
//                                         <UserDisplayHover userInfo={user} />
//                                       </MenuItem>
//                                     );
//                                   })}
//                               </Select>
//                             </FormControl>
//                           </Tooltip>
//                         </div>
//                         <div style={{ marginTop: "20px" }}>
//                           <FormControl>
//                             <RadioGroup
//                               sx={{ gap: 0 }}
//                               defaultValue="AllAssets"
//                               name="radio-buttons-group"
//                               value={filterAssetRadioOperator}
//                               onChange={(event) => {
//                                 const radioValue = (
//                                   event.target as HTMLInputElement
//                                 ).value;
//                                 setFilterAssetRadioOperator(radioValue);
//                                 // setSelectedAssetsOperator([]);
//                                 // setSelectionAssets({
//                                 //   ...selectionAssets,
//                                 //   assets: [],
//                                 // });
//                               }}
//                             >
//                               <FormControlLabel
//                                 value="AllAssets"
//                                 control={<Radio size="small" />}
//                                 label="All Assets"
//                                 style={{ height: "24px" }}
//                               />
//                               <FormControlLabel
//                                 value="MyAssets"
//                                 control={<Radio size="small" />}
//                                 label="My Assets"
//                                 style={{ height: "24px" }}
//                               />
//                             </RadioGroup>
//                           </FormControl>
//                           <Tooltip
//                             placement="top"
//                             title={
//                               <Typography
//                                 style={{ fontSize: "16px", cursor: "default" }}
//                               >
//                                 {filtersOperator.assets.length > 0
//                                   ? filtersOperator.assets.join(", ")
//                                   : "Choose some assets"}
//                               </Typography>
//                             }
//                           >
//                             <FormControl
//                               sx={{ m: 1, width: 220, position: "sticky" }}
//                             >
//                               <InputLabel>Assets</InputLabel>
//                               <Select
//                                 multiple={true}
//                                 value={filtersOperator.assets}
//                                 onChange={(
//                                   event: SelectChangeEvent<
//                                     typeof filtersOperator.assets
//                                   >
//                                 ) => {
//                                   const {
//                                     target: { value },
//                                   } = event;
//                                   setFiltersOperator({
//                                     ...filtersOperator,
//                                     assets:
//                                       typeof value === "string"
//                                         ? value.split(",")
//                                         : value,
//                                   });
//                                 }}
//                                 input={<OutlinedInput label="Assets" />}
//                                 renderValue={(selected) => selected.join(", ")}
//                                 MenuProps={{
//                                   PaperProps: {
//                                     style: {
//                                       maxHeight: 240,
//                                       width: 220,
//                                     },
//                                   },
//                                 }}
//                               >
//                                 {rowsDataOperator
//                                   .map((x) => x.Asset)
//                                   .filter((v, i, a) => a.indexOf(v) === i)
//                                   .sort((a, b) => a.localeCompare(b))
//                                   .map((name) => (
//                                     <MenuItem key={name} value={name}>
//                                       <Checkbox
//                                         checked={
//                                           filtersOperator.assets.indexOf(name) >
//                                           -1
//                                         }
//                                       />
//                                       <ListItemText primary={name} />
//                                     </MenuItem>
//                                   ))}
//                               </Select>
//                             </FormControl>
//                           </Tooltip>
//                         </div>
//                         <div style={{ marginTop: "60px" }}>
//                           <Tooltip
//                             placement="top"
//                             title={
//                               <Typography
//                                 style={{ fontSize: "16px", cursor: "default" }}
//                               >
//                                 {filtersOperator.parts.length > 0
//                                   ? filtersOperator.parts.join(", ")
//                                   : "Choose some parts"}
//                               </Typography>
//                             }
//                           >
//                             <FormControl
//                               sx={{ m: 1, width: 220, position: "sticky" }}
//                             >
//                               <InputLabel>Parts</InputLabel>
//                               <Select
//                                 multiple={true}
//                                 value={filtersOperator.parts}
//                                 onChange={(
//                                   event: SelectChangeEvent<
//                                     typeof filtersOperator.parts
//                                   >
//                                 ) => {
//                                   const {
//                                     target: { value },
//                                   } = event;
//                                   setFiltersOperator({
//                                     ...filtersOperator,
//                                     parts:
//                                       typeof value === "string"
//                                         ? value.split(",")
//                                         : value,
//                                   });
//                                 }}
//                                 input={<OutlinedInput label="Parts" />}
//                                 renderValue={(selected) => selected.join(", ")}
//                                 MenuProps={{
//                                   PaperProps: {
//                                     style: {
//                                       maxHeight: 240,
//                                       width: 220,
//                                     },
//                                   },
//                                 }}
//                               >
//                                 {rowsDataOperator
//                                   .map((x) => x.PartNumber)
//                                   .filter((v, i, a) => a.indexOf(v) === i)
//                                   .sort((a, b) => a.localeCompare(b))
//                                   .map((name) => (
//                                     <MenuItem key={name} value={name}>
//                                       <Checkbox
//                                         checked={
//                                           filtersOperator.parts.indexOf(name) >
//                                           -1
//                                         }
//                                       />
//                                       <ListItemText primary={name} />
//                                     </MenuItem>
//                                   ))}
//                               </Select>
//                             </FormControl>
//                           </Tooltip>
//                         </div>
//                       </div>
//                     </Paper>
//                   </Collapse>

//                   <Collapse
//                     orientation="horizontal"
//                     in={!filterPanelOpenOperator}
//                     collapsedSize={"calc(100% - 260px)"}
//                   >
//                     <div
//                       style={{
//                         height: "calc(100vh - 200px)",
//                         width: !filterPanelOpenOperator
//                           ? !showRawDataOperator
//                             ? "calc(100vw - 38px)"
//                             : "calc(100vw - 56px)"
//                           : !showRawDataOperator
//                           ? "calc(100vw - 298px)"
//                           : "calc(100vw - 314px)",
//                       }}
//                     >
//                       <CustomDataGrid
//                         columns={columnsStatsOperator}
//                         rows={rowsFilteredDataOperator}
//                         columnBuffer={14}
//                         pagination={true}
//                         rowHeight={44}
//                         loading={loadingStatsOperator}
//                         pageSizeOptions={[10, 25, 50, 100]}
//                         paginationModel={paginationModelOperator}
//                         onPaginationModelChange={(model) => {
//                           setPaginationModelOperator(model);
//                         }}
//                         // rowCount={rowsFilteredAssetOperator.length}
//                         checkboxSelection={true}
//                         disableRowSelectionOnClick={true}
//                         slots={{
//                           toolbar: CustomToolbarAssetOperator,
//                           //toolbar: GridToolbar,
//                           footer: CustomFooterAssetOperator,
//                         }}
//                         slotProps={{
//                           toolbar: {
//                             printOptions: { disableToolbarButton: true },
//                           },
//                         }}
//                         columnVisibilityModel={columnVisibilityModelOperator}
//                         onColumnVisibilityModelChange={(model) => {
//                           setColumnVisibilityModelOperator(model);
//                         }}
//                         rowSelectionModel={rowSelectionModelOperator}
//                         onRowSelectionModelChange={(model) => {
//                           setRowSelectionModelOperator(model);
//                         }}
//                         onCellClick={(params) => {
//                           if (params.field !== "Operator") {
//                             let newSelections = [
//                               ...(rowSelectionModelOperator as number[]),
//                             ];
//                             const rowId = params.id as number;
//                             if (newSelections.includes(rowId)) {
//                               const index = newSelections.indexOf(rowId);
//                               if (index > -1) newSelections.splice(index, 1);
//                             } else newSelections.push(rowId);
//                             setRowSelectionModelOperator(
//                               newSelections as GridInputRowSelectionModel
//                             );
//                           }
//                         }}
//                       />
//                     </div>
//                   </Collapse>
//                 </Paper>
//                 <Collapse orientation="vertical" in={showRawDataOperator}>
//                   <Paper style={{ marginTop: "8px" }}>
//                     {/* <DataGridInfinite rows={processDataAssetOperator} /> */}
//                   </Paper>
//                 </Collapse>
//               </div>
//             </TabPanel>

//             <TabPanel value={tabValueStats} index={1}>
//               <div style={{ cursor: "default", padding: "0 20px" }}>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                   }}
//                 >
//                   <Tooltip
//                     placement="top"
//                     title={
//                       <Typography
//                         style={{ fontSize: "16px", cursor: "default" }}
//                       >
//                         {selectionTypesPart.length > 0
//                           ? selectionTypesPart.join(", ")
//                           : "Choose some parts"}
//                       </Typography>
//                     }
//                   >
//                     <FormControl sx={{ m: 1, width: 220, position: "sticky" }}>
//                       <InputLabel>Part Number(s)</InputLabel>
//                       <Select
//                         multiple={true}
//                         value={selectionTypesPart}
//                         onChange={(
//                           event: SelectChangeEvent<typeof selectionTypesPart>
//                         ) => {
//                           const {
//                             target: { value },
//                           } = event;
//                           setSelectionTypesPart(
//                             typeof value === "string" ? value.split(",") : value
//                           );
//                         }}
//                         input={<OutlinedInput label="Part Number(s)" />}
//                         renderValue={(selected) => selected.join(", ")}
//                         MenuProps={{
//                           PaperProps: {
//                             style: {
//                               maxHeight: 240,
//                               width: 220,
//                             },
//                           },
//                         }}
//                       >
//                         {[...comboPartData, ...processPartData]
//                           .map((x) => x.PartNumber)
//                           .filter((v, i, a) => a.indexOf(v) === i)
//                           .filter((x) => x.length > 7)
//                           .sort(
//                             (a, b) => a.localeCompare(b) || a.localeCompare(b)
//                           )
//                           .map((part, i) => {
//                             return (
//                               <MenuItem
//                                 key={i}
//                                 value={part}
//                                 disableGutters={true}
//                               >
//                                 <Checkbox
//                                   checked={
//                                     selectionTypesPart.indexOf(part) > -1
//                                   }
//                                 />
//                                 <ListItemText primary={part} />
//                               </MenuItem>
//                             );
//                           })}
//                       </Select>
//                     </FormControl>
//                   </Tooltip>

//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         color="primary"
//                         checked={dateCheckboxPart}
//                         onChange={(event) => {
//                           setDateCheckboxPart(event.target.checked);
//                         }}
//                       />
//                     }
//                     labelPlacement="start"
//                     label={
//                       <Typography variant="body1" style={{ fontSize: "14px" }}>
//                         {"Single Date"}
//                       </Typography>
//                     }
//                     style={{ padding: "4px 30px 0 0" }}
//                   />

//                   <LocalizationProvider dateAdapter={AdapterDayjs}>
//                     <DatePicker
//                       format="MM/DD/YYYY"
//                       label="Start"
//                       value={dayjs(dateStartPart)}
//                       onChange={(date) => {
//                         setDateStartPart(date ? date.toDate() : new Date());
//                       }}
//                       sx={{
//                         width: "150px",
//                         marginTop: "16px",
//                         paddingBottom: "8px",
//                       }}
//                     />
//                     <Typography
//                       variant="body1"
//                       component={"span"}
//                       style={{ padding: "10px 20px 0 20px" }}
//                     >
//                       {"- to -"}
//                     </Typography>
//                     <DatePicker
//                       format="MM/DD/YYYY"
//                       label="End"
//                       value={dayjs(dateEndPart)}
//                       onChange={(date) => {
//                         setDateEndPart(date ? date.toDate() : new Date());
//                       }}
//                       sx={{
//                         width: "150px",
//                         marginTop: "16px",
//                         paddingBottom: "8px",
//                       }}
//                       disabled={dateCheckboxPart}
//                     />
//                   </LocalizationProvider>

//                   {!loadingStatsPart ? (
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={() => {
//                         if (selectionTypesPart.length > 0) {
//                           void loadDataParts();
//                         } else {
//                           void loadDataAllParts();
//                         }
//                         // setLoadingAssetOperator(true);
//                       }}
//                       style={{ marginLeft: "50px" }}
//                     >
//                       GET
//                     </Button>
//                   ) : (
//                     <Button
//                       variant="contained"
//                       color={!cancelLoadingAssetPart ? "error" : "warning"}
//                       onClick={() => {
//                         cancelLoadingAssetPart = true;
//                         setCancelLoadingPart(true);
//                       }}
//                       style={{ marginLeft: "50px" }}
//                     >
//                       {!cancelLoadingPart ? "CANCEL" : "CANCELING..."}
//                     </Button>
//                   )}
//                 </div>

//                 {loadingStatsPart && (
//                   <Box sx={{ width: "100%" }}>
//                     <LinearProgress
//                       variant="determinate"
//                       value={loadingProgressPart}
//                     />
//                   </Box>
//                 )}

//                 <Paper style={{ display: "flex" }}>
//                   <Collapse orientation="horizontal" in={filterPanelOpenPart}>
//                     <Paper
//                       style={{
//                         // display: filterPanelOpen ? "flex" : "none",
//                         display: "flex",
//                         height: "100%",
//                       }}
//                     >
//                       <div style={{ width: 260, textAlign: "center" }}>
//                         <IconButton
//                           aria-label="Close"
//                           style={{
//                             color: filterPanelCloseHoverStatePart
//                               ? "rgba(0, 0, 0, 0.8)"
//                               : "rgba(0, 0, 0, 0.3)",
//                             position: "sticky",
//                             left: 240,
//                           }}
//                           onMouseEnter={() => {
//                             setFilterPanelCloseHoverStatePart(true);
//                           }}
//                           onMouseLeave={() => {
//                             setFilterPanelCloseHoverStatePart(false);
//                           }}
//                           onClick={() => {
//                             setFilterPanelOpenPart((value) => !value);
//                           }}
//                         >
//                           <Close />
//                         </IconButton>
//                         <Typography
//                           style={{
//                             fontSize: "18px",
//                             fontWeight: "bold",
//                             margin: "10px 0 30px 0",
//                           }}
//                         >
//                           {"FILTERS"}
//                         </Typography>
//                         <div style={{ marginTop: "20px" }}>
//                           <FormControl>
//                             <RadioGroup
//                               sx={{ gap: 0 }}
//                               defaultValue="AllAssets"
//                               name="radio-buttons-group"
//                               value={filterAssetRadioPart}
//                               onChange={(event) => {
//                                 const radioValue = (
//                                   event.target as HTMLInputElement
//                                 ).value;
//                                 setFilterAssetRadioPart(radioValue);
//                                 // setSelectedAssetsOperator([]);
//                                 // setSelectionAssets({
//                                 //   ...selectionAssets,
//                                 //   assets: [],
//                                 // });
//                               }}
//                             >
//                               <FormControlLabel
//                                 value="AllAssets"
//                                 control={<Radio size="small" />}
//                                 label="All Assets"
//                                 style={{ height: "24px" }}
//                               />
//                               <FormControlLabel
//                                 value="MyAssets"
//                                 control={<Radio size="small" />}
//                                 label="My Assets"
//                                 style={{ height: "24px" }}
//                               />
//                             </RadioGroup>
//                           </FormControl>
//                           <Tooltip
//                             placement="top"
//                             title={
//                               <Typography
//                                 style={{ fontSize: "16px", cursor: "default" }}
//                               >
//                                 {filtersPart.assets.length > 0
//                                   ? filtersPart.assets.join(", ")
//                                   : "Choose some assets"}
//                               </Typography>
//                             }
//                           >
//                             <FormControl
//                               sx={{ m: 1, width: 220, position: "sticky" }}
//                             >
//                               <InputLabel>Assets</InputLabel>
//                               <Select
//                                 multiple={true}
//                                 value={filtersPart.assets}
//                                 onChange={(
//                                   event: SelectChangeEvent<
//                                     typeof filtersPart.assets
//                                   >
//                                 ) => {
//                                   const {
//                                     target: { value },
//                                   } = event;
//                                   setFiltersPart({
//                                     ...filtersPart,
//                                     assets:
//                                       typeof value === "string"
//                                         ? value.split(",")
//                                         : value,
//                                   });
//                                 }}
//                                 input={<OutlinedInput label="Assets" />}
//                                 renderValue={(selected) => selected.join(", ")}
//                                 MenuProps={{
//                                   PaperProps: {
//                                     style: {
//                                       maxHeight: 240,
//                                       width: 220,
//                                     },
//                                   },
//                                 }}
//                               >
//                                 {rowsDataPart
//                                   .map((x) => x.Asset)
//                                   .filter((v, i, a) => a.indexOf(v) === i)
//                                   .sort((a, b) => a.localeCompare(b))
//                                   .map((name) => (
//                                     <MenuItem key={name} value={name}>
//                                       <Checkbox
//                                         checked={
//                                           filtersPart.assets.indexOf(name) > -1
//                                         }
//                                       />
//                                       <ListItemText primary={name} />
//                                     </MenuItem>
//                                   ))}
//                               </Select>
//                             </FormControl>
//                           </Tooltip>
//                         </div>
//                         <div style={{ marginTop: "60px" }}>
//                           <Tooltip
//                             placement="top"
//                             title={
//                               <Typography
//                                 style={{ fontSize: "16px", cursor: "default" }}
//                               >
//                                 {filtersPart.parts.length > 0
//                                   ? filtersPart.parts.join(", ")
//                                   : "Choose some parts"}
//                               </Typography>
//                             }
//                           >
//                             <FormControl
//                               sx={{ m: 1, width: 220, position: "sticky" }}
//                             >
//                               <InputLabel>Parts</InputLabel>
//                               <Select
//                                 multiple={true}
//                                 value={filtersPart.parts}
//                                 onChange={(
//                                   event: SelectChangeEvent<
//                                     typeof filtersPart.parts
//                                   >
//                                 ) => {
//                                   const {
//                                     target: { value },
//                                   } = event;
//                                   setFiltersPart({
//                                     ...filtersPart,
//                                     parts:
//                                       typeof value === "string"
//                                         ? value.split(",")
//                                         : value,
//                                   });
//                                 }}
//                                 input={<OutlinedInput label="Parts" />}
//                                 renderValue={(selected) => selected.join(", ")}
//                                 MenuProps={{
//                                   PaperProps: {
//                                     style: {
//                                       maxHeight: 240,
//                                       width: 220,
//                                     },
//                                   },
//                                 }}
//                               >
//                                 {rowsDataPart
//                                   .map((x) => x.PartNumber)
//                                   .filter((v, i, a) => a.indexOf(v) === i)
//                                   .sort((a, b) => a.localeCompare(b))
//                                   .map((name) => (
//                                     <MenuItem key={name} value={name}>
//                                       <Checkbox
//                                         checked={
//                                           filtersPart.parts.indexOf(name) > -1
//                                         }
//                                       />
//                                       <ListItemText primary={name} />
//                                     </MenuItem>
//                                   ))}
//                               </Select>
//                             </FormControl>
//                           </Tooltip>
//                         </div>
//                       </div>
//                     </Paper>
//                   </Collapse>

//                   <Collapse
//                     orientation="horizontal"
//                     in={!filterPanelOpenPart}
//                     collapsedSize={"calc(100% - 260px)"}
//                   >
//                     <div
//                       style={{
//                         height: "calc(100vh - 200px)",
//                         width: !filterPanelOpenPart
//                           ? !showRawDataPart
//                             ? "calc(100vw - 38px)"
//                             : "calc(100vw - 56px)"
//                           : !showRawDataPart
//                           ? "calc(100vw - 298px)"
//                           : "calc(100vw - 314px)",
//                       }}
//                     >
//                       <CustomDataGrid
//                         columns={columnsStatsPart}
//                         rows={rowsFilteredDataPart}
//                         columnBuffer={14}
//                         pagination={true}
//                         rowHeight={44}
//                         loading={loadingStatsPart}
//                         pageSizeOptions={[10, 25, 50, 100]}
//                         paginationModel={paginationModelPart}
//                         onPaginationModelChange={(model) => {
//                           setPaginationModelPart(model);
//                         }}
//                         // rowCount={rowsFilteredAssetOperator.length}
//                         checkboxSelection={true}
//                         disableRowSelectionOnClick={true}
//                         slots={{
//                           toolbar: CustomToolbarAssetOperator,
//                           //toolbar: GridToolbar,
//                           footer: CustomFooterAssetOperator,
//                         }}
//                         slotProps={{
//                           toolbar: {
//                             printOptions: { disableToolbarButton: true },
//                           },
//                         }}
//                         columnVisibilityModel={columnVisibilityModelPart}
//                         onColumnVisibilityModelChange={(model) => {
//                           setColumnVisibilityModelPart(model);
//                         }}
//                         rowSelectionModel={rowSelectionModelPart}
//                         onRowSelectionModelChange={(model) => {
//                           setRowSelectionModelPart(model);
//                         }}
//                         onCellClick={(params) => {
//                           if (params.field !== "Operator") {
//                             let newSelections = [
//                               ...(rowSelectionModelPart as number[]),
//                             ];
//                             const rowId = params.id as number;
//                             if (newSelections.includes(rowId)) {
//                               const index = newSelections.indexOf(rowId);
//                               if (index > -1) newSelections.splice(index, 1);
//                             } else newSelections.push(rowId);
//                             setRowSelectionModelPart(
//                               newSelections as GridInputRowSelectionModel
//                             );
//                           }
//                         }}
//                       />
//                     </div>
//                   </Collapse>
//                 </Paper>
//                 <Collapse orientation="vertical" in={showRawDataPart}>
//                   <Paper style={{ marginTop: "8px" }}>
//                     {/* <DataGridInfinite rows={processDataAssetOperator} /> */}
//                   </Paper>
//                 </Collapse>
//               </div>
//             </TabPanel>
//           </SwipeableViews>
//         </div>
//       </Paper>
//     </div>
//   );
// };

export {};
