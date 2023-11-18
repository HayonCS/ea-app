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
// import { getHHMMSS } from "client/utilities/date-util";
// import { UserDisplayHover } from "client/components/user-display/UserDisplayHover";
// import { getProcessDataExportRange } from "client/utilities/redis";
// import { useSelector } from "react-redux";
// import { UserDisplayClickGentex } from "client/components/user-display/UserDisplayClickGentex";
// import { Close, FilterList } from "@mui/icons-material";
// import {
//   ProcessDataExport,
//   ProcessDataOperatorTotals,
//   ProcessDataRawData,
// } from "client/utilities/types";
// import {
//   getFinalProcessDataOperator,
//   getFinalProcessDataOperatorTotals,
//   getFinalProcessDataPart,
//   getFinalProcessDataPartTotals,
// } from "client/utilities/process-data";
// import { getEmployeeInfoGentex } from "client/utilities/mes";
// import { enqueueSnackbar } from "notistack";
// import { DateTimeHover } from "./DateTimeHover";
// import { Selectors } from "client/redux/selectors";
// import { UserInformation } from "core/schemas/user-information.gen";
// import { getUserInformation } from "client/user-utils";
// import { UserDisplayClick } from "client/components/user-display/UserDisplayClick";

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
//   document.title = "Stats | EA App";

//   const classes = useStyles();

//   const comboPartData = useSelector(Selectors.ComboData.partData);
//   const comboAssetData = useSelector(Selectors.ComboData.assetData);
//   const processPartData = useSelector(Selectors.ProcessData.partData);
//   const processAssetData = useSelector(Selectors.ProcessData.assetData);

//   // const teamGentexRedux = useSelector(Selectors.App.currentUserTeamInfo);
//   const employeeDirectory = useSelector(Selectors.App.employeeActiveDirectory);
//   const userDataRedux = useSelector(Selectors.App.currentUserAppData);

//   const [userTeamInfo, setUserTeamInfo] = React.useState<UserInformation[]>([]);

//   React.useEffect(() => {
//     let teamInfo = employeeDirectory.filter((x) =>
//       userDataRedux.operators.includes(x.employeeId)
//     );
//     teamInfo = teamInfo.sort((a, b) => a.username.localeCompare(b.username));
//     setUserTeamInfo(teamInfo);
//   }, [userDataRedux, employeeDirectory]);

//   const [tabValueStats, setTabValueStats] = React.useState(0);

//   const [loadingAssetOperator, setLoadingAssetOperator] = React.useState(false);
//   const [loadingProgressAssetOperator, setLoadingProgressAssetOperator] =
//     React.useState(0);
//   const [cancelingLoadingAssetOperator, setCancelingLoadingAssetOperator] =
//     React.useState(false);

//   const [operatorEmployeeInfo, setOperatorEmployeeInfo] = React.useState<
//     UserInformation[]
//   >([]);
//   const [filterOperatorUserInfo, setFilterOperatorUserInfo] = React.useState<
//     UserInformation[]
//   >([]);
//   const [filtersAssetOperator, setFiltersAssetOperator] = React.useState<{
//     operators: string[];
//     assets: string[];
//     parts: string[];
//   }>({ operators: [], assets: [], parts: [] });
//   const [filtersAssetOperatorRadio, setFiltersAssetOperatorRadio] =
//     React.useState("AllOperators");
//   const [selectedAssetsOperator, setSelectedAssetsOperator] = React.useState<
//     string[]
//   >([]);
//   const [checkboxDateAssetOperator, setCheckboxDateAssetOperator] =
//     React.useState(false);
//   const [startDateAssetOperator, setStartDateAssetOperator] = React.useState(
//     new Date()
//   );
//   const [endDateAssetOperator, setEndDateAssetOperator] = React.useState(
//     new Date()
//   );
//   const [processDataAssetOperator, setProcessDataAssetOperator] =
//     React.useState<ProcessDataRawData[]>([]);
//   const [rowsAssetOperator, setRowsAssetOperator] = React.useState<
//     ProcessDataOperatorTotals[]
//   >([]);
//   const [rowsFilteredAssetOperator, setRowsFilteredAssetOperator] =
//     React.useState<ProcessDataOperatorTotals[]>([]);
//   const [paginationModelAssetOperator, setPaginationModelAssetOperator] =
//     React.useState<GridPaginationModel>({
//       page: 0,
//       pageSize: 100,
//     });
//   const [
//     columnVisibilityModelAssetOperator,
//     setColumnVisibilityModelAssetOperator,
//   ] = React.useState<GridColumnVisibilityModel>({
//     board: false,
//     recipe: false,
//     changeover: false,
//   });
//   const [rowSelectionModelAssetOperator, setRowSelectionModelAssetOperator] =
//     React.useState<GridInputRowSelectionModel>([]);
//   const [footerStatsAssetOperator, setFooterStatsAssetOperator] =
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

//   const [partSearchValueAssetPart, setPartSearchValueAssetPart] =
//     React.useState("");
//   const [showRawDataAssetOperator, setShowRawDataAssetOperator] =
//     React.useState(false);
//   const [filterPanelOpenAssetOperator, setFilterPanelOpenAssetOperator] =
//     React.useState(false);
//   const [
//     filterPanelCloseHoverStateAssetOperator,
//     setFilterPanelCloseHoverStateAssetOperator,
//   ] = React.useState(false);

//   const [loadingAssetPart, setLoadingAssetPart] = React.useState(false);
//   const [loadingProgressAssetPart, setLoadingProgressAssetPart] =
//     React.useState(0);
//   const [cancelingLoadingAssetPart, setCancelingLoadingAssetPart] =
//     React.useState(false);
//   const [filtersAssetPart, setFiltersAssetPart] = React.useState<{
//     assets: string[];
//     parts: string[];
//   }>({ assets: [], parts: [] });
//   const [selectedAssetsPart, setSelectedAssetsPart] = React.useState<string[]>(
//     []
//   );
//   const [checkboxDateAssetPart, setCheckboxDateAssetPart] =
//     React.useState(false);
//   const [startDateAssetPart, setStartDateAssetPart] = React.useState(
//     new Date()
//   );
//   const [endDateAssetPart, setEndDateAssetPart] = React.useState(new Date());
//   const [processDataAssetPart, setProcessDataAssetPart] = React.useState<
//     ProcessDataRawData[]
//   >([]);
//   const [rowsAssetPart, setRowsAssetPart] = React.useState<
//     ProcessDataOperatorTotals[]
//   >([]);
//   const [rowsFilteredAssetPart, setRowsFilteredAssetPart] = React.useState<
//     ProcessDataOperatorTotals[]
//   >([]);
//   const [paginationModelAssetPart, setPaginationModelAssetPart] =
//     React.useState<GridPaginationModel>({
//       page: 0,
//       pageSize: 100,
//     });
//   const [columnVisibilityModelAssetPart, setColumnVisibilityModelAssetPart] =
//     React.useState<GridColumnVisibilityModel>({
//       board: false,
//       recipe: false,
//       changeover: false,
//     });
//   const [rowSelectionModelAssetPart, setRowSelectionModelAssetPart] =
//     React.useState<GridInputRowSelectionModel>([]);
//   const [footerStatsAssetPart, setFooterStatsAssetPart] =
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

//   const [showRawDataAssetPart, setShowRawDataAssetPart] = React.useState(false);
//   const [filterPanelOpenAssetPart, setFilterPanelOpenAssetPart] =
//     React.useState(false);
//   const [
//     filterPanelCloseHoverStateAssetPart,
//     setFilterPanelCloseHoverStateAssetPart,
//   ] = React.useState(false);

//   const loadStatsAssetOperator = async () => {
//     enqueueSnackbar("Loading data for operators by assets...", {
//       variant: "info",
//       autoHideDuration: 3000,
//     });
//     setLoadingProgressAssetOperator(0);
//     setLoadingAssetOperator(true);
//     let canceled = false;
//     let progress = 0;
//     const step = 90 / (selectedAssetsOperator.length * 3);
//     let processDataTotal: ProcessDataExport[] = [];
//     let finalOperatorData: ProcessDataOperatorTotals[] = [];
//     for (let i = 0; i < selectedAssetsOperator.length; ++i) {
//       if (cancelLoadingAssetOperator) {
//         canceled = true;
//         break;
//       }
//       const asset = selectedAssetsOperator[i];
//       const processData = await getProcessDataExportRange(
//         asset,
//         startDateAssetOperator,
//         checkboxDateAssetOperator
//           ? startDateAssetOperator
//           : endDateAssetOperator
//       );
//       if (cancelLoadingAssetOperator) {
//         canceled = true;
//         break;
//       }
//       progress += step;
//       setLoadingProgressAssetOperator(progress);
//       if (processData) {
//         const procDataOperator = await getFinalProcessDataOperator(processData);
//         if (cancelLoadingAssetOperator) {
//           canceled = true;
//           break;
//         }
//         progress += step;
//         setLoadingProgressAssetOperator(progress);
//         const operatorTotals = await getFinalProcessDataOperatorTotals(
//           procDataOperator,
//           userDataRedux.orgCode
//         );
//         if (cancelLoadingAssetOperator) {
//           canceled = true;
//           break;
//         }
//         processDataTotal = processDataTotal.concat(processData);
//         finalOperatorData = finalOperatorData.concat(operatorTotals);
//         progress += step;
//         setLoadingProgressAssetOperator(progress);
//       } else {
//         progress += step * 2;
//         setLoadingProgressAssetOperator(progress);
//       }
//     }
//     if (!canceled) {
//       setLoadingProgressAssetOperator(90);
//       finalOperatorData.forEach((x, i) => (x.id = i));
//       let rawDataTotal = processDataTotal.map((x, i) => {
//         let obj: ProcessDataRawData = {
//           id: i,
//           ...x,
//         };
//         return obj;
//       });
//       setRowSelectionModelAssetOperator([]);
//       setRowsAssetOperator(finalOperatorData);
//       setProcessDataAssetOperator(rawDataTotal);
//       loadAllEmployeeInfo(finalOperatorData);
//       setLoadingProgressAssetOperator(100);
//       setLoadingAssetOperator(false);
//       cancelLoadingAssetOperator = false;
//       setCancelingLoadingAssetOperator(false);
//       let opList = [...finalOperatorData]
//         .map((x) => x.Operator)
//         .filter((v, i, a) => a.indexOf(v) === i);
//       let partList = [...finalOperatorData]
//         .map((x) => x.PartNumber)
//         .filter((v, i, a) => a.indexOf(v) === i);
//       let assetList = [...finalOperatorData]
//         .map((x) => x.Asset)
//         .filter((v, i, a) => a.indexOf(v) === i);
//       const opFilter = opList.filter((op) =>
//         filtersAssetOperator.operators.includes(op)
//       );
//       const partFilter = partList.filter((part) =>
//         filtersAssetOperator.parts.includes(part)
//       );
//       const assetFilter = assetList.filter((asset) =>
//         filtersAssetOperator.assets.includes(asset)
//       );
//       setFiltersAssetOperator({
//         operators: opFilter,
//         parts: partFilter,
//         assets: assetFilter,
//       });
//       enqueueSnackbar("Data loaded successfully!", {
//         variant: "success",
//         autoHideDuration: 3000,
//       });
//     } else {
//       setLoadingProgressAssetOperator(0);
//       setLoadingAssetOperator(false);
//       cancelLoadingAssetOperator = false;
//       setCancelingLoadingAssetOperator(false);
//       enqueueSnackbar("Canceled loading data.", {
//         variant: "info",
//         autoHideDuration: 3000,
//       });
//     }
//   };

//   const loadStatsAssetPart = async () => {
//     enqueueSnackbar("Loading data for parts by assets...", {
//       variant: "info",
//       autoHideDuration: 3000,
//     });
//     setLoadingProgressAssetPart(0);
//     setLoadingAssetPart(true);
//     const selectedAssets =
//       selectedAssetsPart.length > 0
//         ? [...selectedAssetsPart]
//         : userDataRedux
//         ? [...userDataRedux.assetList]
//         : [];
//     let canceled = false;
//     let progress = 0;
//     const step = 90 / (selectedAssets.length * 3);
//     let processDataTotal: ProcessDataExport[] = [];
//     let finalPartData: ProcessDataOperatorTotals[] = [];
//     for (let i = 0; i < selectedAssets.length; ++i) {
//       if (cancelLoadingAssetPart) {
//         canceled = true;
//         break;
//       }
//       const asset = selectedAssets[i];
//       const processData = await getProcessDataExportRange(
//         asset,
//         startDateAssetPart,
//         checkboxDateAssetPart ? startDateAssetPart : endDateAssetPart
//       );
//       if (cancelLoadingAssetPart) {
//         canceled = true;
//         break;
//       }
//       progress += step;
//       setLoadingProgressAssetPart(progress);
//       if (processData) {
//         const procDataPart = getFinalProcessDataPart(processData);
//         if (cancelLoadingAssetPart) {
//           canceled = true;
//           break;
//         }
//         progress += step;
//         setLoadingProgressAssetPart(progress);
//         const partTotals = await getFinalProcessDataPartTotals(
//           procDataPart,
//           userDataRedux?.orgCode ?? 14
//         );
//         if (cancelLoadingAssetPart) {
//           canceled = true;
//           break;
//         }
//         processDataTotal = processDataTotal.concat(processData);
//         finalPartData = finalPartData.concat(partTotals);
//         progress += step;
//         setLoadingProgressAssetPart(progress);
//       } else {
//         progress += step * 2;
//         setLoadingProgressAssetPart(progress);
//       }
//     }
//     if (!canceled) {
//       setLoadingProgressAssetPart(90);
//       finalPartData = finalPartData.filter((x) =>
//         x.PartNumber.includes(partSearchValueAssetPart)
//       );
//       finalPartData.forEach((x, i) => (x.id = i));
//       const rawDataTotal = processDataTotal.map((x, i) => {
//         let obj: ProcessDataRawData = {
//           id: i,
//           ...x,
//         };
//         return obj;
//       });
//       setRowSelectionModelAssetPart([]);
//       // setRowsAssetPart(finalPartData);
//       setProcessDataAssetPart(rawDataTotal);
//       setLoadingProgressAssetPart(100);
//       setLoadingAssetPart(false);
//       cancelLoadingAssetPart = false;
//       setCancelingLoadingAssetPart(false);
//       const partList = finalPartData
//         .map((x) => x.PartNumber)
//         .filter((v, i, a) => a.indexOf(v) === i);
//       const assetList = finalPartData
//         .map((x) => x.Asset)
//         .filter((v, i, a) => a.indexOf(v) === i);
//       const partFilter = partList.filter((part) =>
//         filtersAssetPart.parts.includes(part)
//       );
//       const assetFilter = assetList.filter((asset) =>
//         filtersAssetPart.assets.includes(asset)
//       );
//       setFiltersAssetPart({
//         parts: partFilter,
//         assets: assetFilter,
//       });
//       enqueueSnackbar("Data loaded successfully!", {
//         variant: "success",
//         autoHideDuration: 3000,
//       });
//       setRowsAssetPart(finalPartData);
//     } else {
//       setLoadingProgressAssetPart(0);
//       setLoadingAssetPart(false);
//       cancelLoadingAssetPart = false;
//       setCancelingLoadingAssetPart(false);
//       enqueueSnackbar("Canceled loading data.", {
//         variant: "info",
//         autoHideDuration: 3000,
//       });
//     }
//   };

//   const loadAllEmployeeInfo = (processData: ProcessDataOperatorTotals[]) => {
//     let allInfo: UserInformation[] = [];
//     const ids = processData
//       .map((x) => x.Operator)
//       .filter((v, i, a) => a.indexOf(v) === i)
//       .sort((a, b) => a.localeCompare(b));
//     allInfo = employeeDirectory.filter((x) => ids.includes(x.employeeId));
//     // for (let i = 0; i < ids.length; ++i) {
//     //   if (userTeamInfo.some((x) => x.employeeId === ids[i])) {
//     //     const found = userTeamInfo.find((x) => x.employeeId === ids[i]);
//     //     if (found) {
//     //       allInfo.push(found);
//     //     }
//     //   } else {
//     //     const info = await getUserInformation(ids[i]);
//     //     if (info) {
//     //       allInfo.push(info);
//     //     }
//     //   }
//     // }
//     setOperatorEmployeeInfo(allInfo);
//   };

//   React.useEffect(() => {
//     setRowSelectionModelAssetOperator([]);
//     let rows = [...rowsAssetOperator];
//     if (filtersAssetOperator.assets.length > 0) {
//       rows = rows.filter((x) => filtersAssetOperator.assets.includes(x.Asset));
//     }
//     if (filtersAssetOperator.operators.length > 0) {
//       rows = rows.filter((x) =>
//         filtersAssetOperator.operators.includes(x.Operator)
//       );
//     }
//     if (filtersAssetOperator.parts.length > 0) {
//       rows = rows.filter((x) =>
//         filtersAssetOperator.parts.includes(x.PartNumber)
//       );
//     }
//     if (filtersAssetOperatorRadio === "MyTeam") {
//       const myTeam = [...userTeamInfo].map((x) => x.employeeId);
//       rows = rows.filter((x) => myTeam.includes(x.Operator));
//     }
//     // rows = rows.map((row, i) => {
//     //   let newRow = { ...row };
//     //   newRow.id = i + 1;
//     //   return newRow;
//     // });
//     // if (rows.length > 0) {
//     //   rows.push({
//     //     ...rows[rows.length - 1],
//     //     id: rows.length + 1,
//     //   });
//     // }

//     if (filtersAssetOperatorRadio === "AllOperators") {
//       setFilterOperatorUserInfo(operatorEmployeeInfo);
//     } else {
//       setFilterOperatorUserInfo(userTeamInfo);
//     }

//     setRowsFilteredAssetOperator(rows);
//     // setNewRows(rows);
//   }, [
//     rowsAssetOperator,
//     filtersAssetOperator,
//     filtersAssetOperatorRadio,
//     userTeamInfo,
//     operatorEmployeeInfo,
//   ]);

//   const setNewRows = React.useCallback((rows: ProcessDataOperatorTotals[]) => {
//     setTimeout(() => {
//       // setRowsFilteredAssetOperator((prevRows) => prevRows.filter((row) => row.id !== id));
//       setRowsFilteredAssetOperator(rows);
//     }, 1000);
//   }, []);

//   // React.useEffect(() => {
//   //   console.log("SET ROWS");
//   //   const rows = [
//   //     {
//   //       Asset: "asdf",
//   //       CycleTime: 2,
//   //       Date: new Date(),
//   //       Efficiency: 124,
//   //       EndTime: new Date(),
//   //       Fails: 9,
//   //       id: 0,
//   //       Label: "",
//   //       Line: "",
//   //       OperationId: "",
//   //       Operator: "",
//   //       PartNumber: "",
//   //       PartsPerHour: 3,
//   //       Passes: 229,
//   //       Revision: "",
//   //       RunActual: 1234,
//   //       RunTheory: 12,
//   //       Sender: "",
//   //       StartTime: new Date(),
//   //       TestPlan: "",
//   //     },
//   //   ];
//   //   // setNewRows(rows);
//   //   setRowsFilteredAssetOperator(rows);
//   // }, []);

//   React.useEffect(() => {
//     if (typeof rowSelectionModelAssetOperator !== "number") {
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
//       for (const gridRowId of rowSelectionModelAssetOperator) {
//         const id = gridRowId as number;
//         const row = rowsAssetOperator[id];
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
//       setFooterStatsAssetOperator(stats);
//     }
//   }, [rowSelectionModelAssetOperator, rowsAssetOperator]);

//   React.useEffect(() => {
//     setRowSelectionModelAssetPart([]);
//     let rows = [...rowsAssetPart];
//     if (filtersAssetPart.assets.length > 0) {
//       rows = rows.filter((x) => filtersAssetPart.assets.includes(x.Asset));
//     }
//     if (filtersAssetPart.parts.length > 0) {
//       rows = rows.filter((x) => filtersAssetPart.parts.includes(x.PartNumber));
//     }
//     setRowsFilteredAssetPart(rows);
//   }, [rowsAssetPart, filtersAssetPart]);

//   // React.useEffect(() => {
//   //   if (typeof rowSelectionModelAssetPart !== "number") {
//   //     let stats: FooterStatsTotals = {
//   //       Rows: 0,
//   //       Parts: 0,
//   //       Passes: 0,
//   //       Fails: 0,
//   //       RunActual: 0,
//   //       RunTheory: 0,
//   //       Efficiency: 0,
//   //       PartsPerHour: 0,
//   //     };
//   //     for (const gridRowId of rowSelectionModelAssetPart) {
//   //       const id = gridRowId as number;
//   //       const row = rowsAssetPart[id];
//   //       stats.Rows += 1;
//   //       stats.Parts += row.Passes + row.Fails;
//   //       stats.Passes += row.Passes;
//   //       stats.Fails += row.Fails;
//   //       stats.RunActual += row.RunActual;
//   //       stats.RunTheory += row.RunTheory;
//   //       const efficiency =
//   //         stats.RunActual > 0 ? (stats.RunTheory / stats.RunActual) * 100 : 100;
//   //       const partsPerHour =
//   //         stats.RunActual > 0
//   //           ? ((stats.Passes + stats.Fails) / stats.RunActual) * 60
//   //           : stats.Passes + stats.Fails;
//   //       stats.Efficiency = efficiency;
//   //       stats.PartsPerHour = partsPerHour;
//   //     }
//   //     setFooterStatsAssetPart(stats);
//   //   }
//   // }, [rowSelectionModelAssetPart, rowsAssetPart]);

//   const columnsAssetOperator: GridColDef[] = [
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
//         return <div className={classes.cellStyle}>{cellValue.value}</div>;
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
//         const foundIndex = operatorEmployeeInfo.findIndex((userInfo) => {
//           return userInfo.employeeId === id;
//         });

//         return foundIndex > -1 ? (
//           <UserDisplayClickGentex userInfo={operatorEmployeeInfo[foundIndex]} />
//         ) : (
//           // <UserDisplayClick userId={"-1"} />
//           <div className={classes.cellStyle}>{cellValue.value}</div>
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

//   const columnsAssetPart: GridColDef[] = [
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
//         return <div className={classes.cellStyle}>{cellValue.value}</div>;
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
//                 value >= 95 ? "rgb(0, 200, 0)" : value >= 85 ? "orange" : "red",
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
//         {footerStatsAssetOperator.Rows > 0 && (
//           <div style={{ display: "flex" }}>
//             <Typography
//               style={{
//                 paddingRight: "20px",
//                 fontSize: "14px",
//                 fontWeight: "bold",
//               }}
//             >
//               {"Parts: " + footerStatsAssetOperator.Parts}
//             </Typography>
//             <Typography
//               style={{
//                 paddingRight: "20px",
//                 fontSize: "14px",
//                 fontWeight: "bold",
//               }}
//             >
//               {"Passes: " + footerStatsAssetOperator.Passes}
//             </Typography>
//             <Typography
//               style={{
//                 paddingRight: "20px",
//                 fontSize: "14px",
//                 fontWeight: "bold",
//               }}
//             >
//               {"Fails: " + footerStatsAssetOperator.Fails}
//             </Typography>
//             <Typography
//               style={{
//                 paddingRight: "20px",
//                 fontSize: "14px",
//                 fontWeight: "bold",
//               }}
//             >
//               {"Actual: " + getHHMMSS(footerStatsAssetOperator.RunActual)}
//             </Typography>
//             <Typography
//               style={{
//                 paddingRight: "20px",
//                 fontSize: "14px",
//                 fontWeight: "bold",
//               }}
//             >
//               {"Theory: " + getHHMMSS(footerStatsAssetOperator.RunTheory)}
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
//                   Math.round(footerStatsAssetOperator.Efficiency * 100) / 100
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
//                   Math.round(footerStatsAssetOperator.PartsPerHour * 100) / 100
//                 ).toFixed(2)}
//             </Typography>
//           </div>
//         )}
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => {
//             setShowRawDataAssetOperator(!showRawDataAssetOperator);
//           }}
//         >
//           {showRawDataAssetOperator ? "Close Raw Data" : "View Raw Data"}
//         </Button>

//         <GridFooter style={{ border: "none" }} />
//       </GridFooterContainer>
//     );
//   };

//   // function CustomFooterAssetOperator() {
//   //   return (
//   //     <GridFooterContainer style={{ justifyContent: "right" }}>
//   //       {footerStatsAssetOperator.Rows > 0 && (
//   //         <div style={{ display: "flex" }}>
//   //           <Typography
//   //             style={{
//   //               paddingRight: "20px",
//   //               fontSize: "14px",
//   //               fontWeight: "bold",
//   //             }}
//   //           >
//   //             {"Parts: " + footerStatsAssetOperator.Parts}
//   //           </Typography>
//   //           <Typography
//   //             style={{
//   //               paddingRight: "20px",
//   //               fontSize: "14px",
//   //               fontWeight: "bold",
//   //             }}
//   //           >
//   //             {"Passes: " + footerStatsAssetOperator.Passes}
//   //           </Typography>
//   //           <Typography
//   //             style={{
//   //               paddingRight: "20px",
//   //               fontSize: "14px",
//   //               fontWeight: "bold",
//   //             }}
//   //           >
//   //             {"Fails: " + footerStatsAssetOperator.Fails}
//   //           </Typography>
//   //           <Typography
//   //             style={{
//   //               paddingRight: "20px",
//   //               fontSize: "14px",
//   //               fontWeight: "bold",
//   //             }}
//   //           >
//   //             {"Actual: " + getHHMMSS(footerStatsAssetOperator.RunActual)}
//   //           </Typography>
//   //           <Typography
//   //             style={{
//   //               paddingRight: "20px",
//   //               fontSize: "14px",
//   //               fontWeight: "bold",
//   //             }}
//   //           >
//   //             {"Theory: " + getHHMMSS(footerStatsAssetOperator.RunTheory)}
//   //           </Typography>
//   //           <Typography
//   //             style={{
//   //               paddingRight: "20px",
//   //               fontSize: "14px",
//   //               fontWeight: "bold",
//   //             }}
//   //           >
//   //             {"Efficiency: " +
//   //               (
//   //                 Math.round(footerStatsAssetOperator.Efficiency * 100) / 100
//   //               ).toFixed(2) +
//   //               "%"}
//   //           </Typography>
//   //           <Typography
//   //             style={{
//   //               paddingRight: "20px",
//   //               fontSize: "14px",
//   //               fontWeight: "bold",
//   //             }}
//   //           >
//   //             {"PPH: " +
//   //               (
//   //                 Math.round(footerStatsAssetOperator.PartsPerHour * 100) / 100
//   //               ).toFixed(2)}
//   //           </Typography>
//   //         </div>
//   //       )}
//   //       <PopupState variant="popover">
//   //         {(popupState: any) => (
//   //           <div>
//   //             <Button
//   //               variant="contained"
//   //               color="primary"
//   //               {...bindTrigger(popupState)}
//   //             >
//   //               Calculate
//   //             </Button>
//   //             <Popover
//   //               {...bindPopover(popupState)}
//   //               anchorOrigin={{
//   //                 vertical: "bottom",
//   //                 horizontal: "center",
//   //               }}
//   //               transformOrigin={{
//   //                 vertical: "bottom",
//   //                 horizontal: "center",
//   //               }}
//   //             >
//   //               <Box p={4}>
//   //                 <div>
//   //                   <Typography
//   //                     style={{ paddingRight: "20px", fontWeight: "bold" }}
//   //                   >
//   //                     {"Parts: " + footerStatsAssetOperator.Parts}
//   //                   </Typography>
//   //                   <Typography
//   //                     style={{ paddingRight: "20px", fontWeight: "bold" }}
//   //                   >
//   //                     {"Passes: " + footerStatsAssetOperator.Passes}
//   //                   </Typography>
//   //                   <Typography
//   //                     style={{ paddingRight: "20px", fontWeight: "bold" }}
//   //                   >
//   //                     {"Fails: " + footerStatsAssetOperator.Fails}
//   //                   </Typography>
//   //                   <Typography
//   //                     style={{ paddingRight: "20px", fontWeight: "bold" }}
//   //                   >
//   //                     {"Actual: " +
//   //                       getHHMMSS(footerStatsAssetOperator.RunActual)}
//   //                   </Typography>
//   //                   <Typography
//   //                     style={{ paddingRight: "20px", fontWeight: "bold" }}
//   //                   >
//   //                     {"Theory: " +
//   //                       getHHMMSS(footerStatsAssetOperator.RunTheory)}
//   //                   </Typography>
//   //                   <Typography
//   //                     style={{ paddingRight: "20px", fontWeight: "bold" }}
//   //                   >
//   //                     {"Efficiency: " +
//   //                       (
//   //                         Math.round(
//   //                           footerStatsAssetOperator.Efficiency * 100
//   //                         ) / 100
//   //                       ).toFixed(2) +
//   //                       "%"}
//   //                   </Typography>
//   //                   <Typography
//   //                     style={{ paddingRight: "20px", fontWeight: "bold" }}
//   //                   >
//   //                     {"PPH: " +
//   //                       (
//   //                         Math.round(
//   //                           footerStatsAssetOperator.PartsPerHour * 100
//   //                         ) / 100
//   //                       ).toFixed(2)}
//   //                   </Typography>
//   //                 </div>
//   //               </Box>
//   //             </Popover>
//   //           </div>
//   //         )}
//   //       </PopupState>
//   //       <GridFooter style={{ border: "none" }} />
//   //     </GridFooterContainer>
//   //   );
//   // }

//   // const CustomToolbarAssetOperator = () => {
//   //   return (
//   //     <GridToolbarContainer>
//   //       <GridToolbarColumnsButton />
//   //       <PopupState variant="popover">
//   //         {(popupState: any) => (
//   //           <div>
//   //             <Button
//   //               variant="text"
//   //               color="primary"
//   //               {...bindTrigger(popupState)}
//   //               sx={{ padding: "4px" }}
//   //             >
//   //               <FilterList style={{ marginRight: "8px" }} />
//   //               <Typography style={{ fontSize: "14px", marginBottom: "2px" }}>
//   //                 {"Filters"}
//   //               </Typography>
//   //             </Button>
//   //             <Popover
//   //               {...bindPopover(popupState)}
//   //               anchorOrigin={{
//   //                 vertical: "bottom",
//   //                 horizontal: "left",
//   //               }}
//   //               transformOrigin={{
//   //                 vertical: "top",
//   //                 horizontal: "left",
//   //               }}
//   //               autoFocus={true}
//   //               disableEnforceFocus={true}
//   //             >
//   //               <Box p={4}>
//   //                 <div style={{ textAlign: "center" }}>
//   //                   <Typography
//   //                     style={{
//   //                       fontSize: "18px",
//   //                       fontWeight: "bold",
//   //                       margin: "40px 0 30px 0",
//   //                     }}
//   //                   >
//   //                     {"Filters"}
//   //                   </Typography>
//   //                   <div>
//   //                     <Tooltip
//   //                       placement="top"
//   //                       title={
//   //                         <Typography
//   //                           style={{ fontSize: "16px", cursor: "default" }}
//   //                         >
//   //                           {filtersAssetOperator.operators.length > 0
//   //                             ? filtersAssetOperator.operators.join(", ")
//   //                             : "Choose some operators"}
//   //                         </Typography>
//   //                       }
//   //                     >
//   //                       <FormControl
//   //                         sx={{ m: 1, width: 200, position: "sticky" }}
//   //                       >
//   //                         <InputLabel>Operators</InputLabel>
//   //                         <Select
//   //                           multiple={true}
//   //                           value={filtersAssetOperator.operators}
//   //                           onChange={(
//   //                             event: SelectChangeEvent<
//   //                               typeof filtersAssetOperator.operators
//   //                             >
//   //                           ) => {
//   //                             const {
//   //                               target: { value },
//   //                             } = event;
//   //                             setFiltersAssetOperator({
//   //                               ...filtersAssetOperator,
//   //                               operators:
//   //                                 typeof value === "string"
//   //                                   ? value.split(",")
//   //                                   : value,
//   //                             });
//   //                           }}
//   //                           input={<OutlinedInput label="Operators" />}
//   //                           renderValue={(selected) => selected.join(", ")}
//   //                           MenuProps={{
//   //                             PaperProps: {
//   //                               style: {
//   //                                 maxHeight: 240,
//   //                                 width: 200,
//   //                               },
//   //                             },
//   //                           }}
//   //                         >
//   //                           {userInfo.map((user, i) => {
//   //                             return (
//   //                               <MenuItem key={i} value={user.employeeId}>
//   //                                 <Checkbox
//   //                                   checked={
//   //                                     filtersAssetOperator.operators.indexOf(
//   //                                       user.employeeId
//   //                                     ) > -1
//   //                                   }
//   //                                 />
//   //                                 <UserDisplayHover userInfo={user} />
//   //                               </MenuItem>
//   //                             );
//   //                           })}
//   //                         </Select>
//   //                       </FormControl>
//   //                     </Tooltip>
//   //                   </div>
//   //                   <div style={{ marginTop: "40px" }}>
//   //                     <Tooltip
//   //                       placement="top"
//   //                       title={
//   //                         <Typography
//   //                           style={{ fontSize: "16px", cursor: "default" }}
//   //                         >
//   //                           {filtersAssetOperator.assets.length > 0
//   //                             ? filtersAssetOperator.assets.join(", ")
//   //                             : "Choose some assets"}
//   //                         </Typography>
//   //                       }
//   //                     >
//   //                       <FormControl
//   //                         sx={{ m: 1, width: 200, position: "sticky" }}
//   //                       >
//   //                         <InputLabel>Assets</InputLabel>
//   //                         <Select
//   //                           multiple={true}
//   //                           value={filtersAssetOperator.assets}
//   //                           onChange={(
//   //                             event: SelectChangeEvent<
//   //                               typeof filtersAssetOperator.assets
//   //                             >
//   //                           ) => {
//   //                             const {
//   //                               target: { value },
//   //                             } = event;
//   //                             setFiltersAssetOperator({
//   //                               ...filtersAssetOperator,
//   //                               assets:
//   //                                 typeof value === "string"
//   //                                   ? value.split(",")
//   //                                   : value,
//   //                             });
//   //                           }}
//   //                           input={<OutlinedInput label="Assets" />}
//   //                           renderValue={(selected) => selected.join(", ")}
//   //                           MenuProps={{
//   //                             PaperProps: {
//   //                               style: {
//   //                                 maxHeight: 240,
//   //                                 width: 200,
//   //                               },
//   //                             },
//   //                           }}
//   //                         >
//   //                           {rowsAssetOperator
//   //                             .map((x) => x.Asset)
//   //                             .filter((v, i, a) => a.indexOf(v) === i)
//   //                             .sort((a, b) => a.localeCompare(b))
//   //                             .map((name) => (
//   //                               <MenuItem key={name} value={name}>
//   //                                 <Checkbox
//   //                                   checked={
//   //                                     filtersAssetOperator.assets.indexOf(
//   //                                       name
//   //                                     ) > -1
//   //                                   }
//   //                                 />
//   //                                 <ListItemText primary={name} />
//   //                               </MenuItem>
//   //                             ))}
//   //                         </Select>
//   //                       </FormControl>
//   //                     </Tooltip>
//   //                   </div>
//   //                   <div style={{ marginTop: "40px" }}>
//   //                     <Tooltip
//   //                       placement="top"
//   //                       title={
//   //                         <Typography
//   //                           style={{ fontSize: "16px", cursor: "default" }}
//   //                         >
//   //                           {filtersAssetOperator.parts.length > 0
//   //                             ? filtersAssetOperator.parts.join(", ")
//   //                             : "Choose some parts"}
//   //                         </Typography>
//   //                       }
//   //                     >
//   //                       <FormControl
//   //                         sx={{ m: 1, width: 200, position: "sticky" }}
//   //                       >
//   //                         <InputLabel>Parts</InputLabel>
//   //                         <Select
//   //                           multiple={true}
//   //                           value={filtersAssetOperator.parts}
//   //                           onChange={(
//   //                             event: SelectChangeEvent<
//   //                               typeof filtersAssetOperator.parts
//   //                             >
//   //                           ) => {
//   //                             const {
//   //                               target: { value },
//   //                             } = event;
//   //                             setFiltersAssetOperator({
//   //                               ...filtersAssetOperator,
//   //                               parts:
//   //                                 typeof value === "string"
//   //                                   ? value.split(",")
//   //                                   : value,
//   //                             });
//   //                           }}
//   //                           input={<OutlinedInput label="Parts" />}
//   //                           renderValue={(selected) => selected.join(", ")}
//   //                           MenuProps={{
//   //                             PaperProps: {
//   //                               style: {
//   //                                 maxHeight: 240,
//   //                                 width: 200,
//   //                               },
//   //                             },
//   //                           }}
//   //                         >
//   //                           {rowsAssetOperator
//   //                             .map((x) => x.PartNumber)
//   //                             .filter((v, i, a) => a.indexOf(v) === i)
//   //                             .sort((a, b) => a.localeCompare(b))
//   //                             .map((name) => (
//   //                               <MenuItem key={name} value={name}>
//   //                                 <Checkbox
//   //                                   checked={
//   //                                     filtersAssetOperator.parts.indexOf(name) >
//   //                                     -1
//   //                                   }
//   //                                 />
//   //                                 <ListItemText primary={name} />
//   //                               </MenuItem>
//   //                             ))}
//   //                         </Select>
//   //                       </FormControl>
//   //                     </Tooltip>
//   //                   </div>
//   //                 </div>
//   //               </Box>
//   //             </Popover>
//   //           </div>
//   //         )}
//   //       </PopupState>
//   //       <GridToolbarDensitySelector />
//   //       <GridToolbarExport />
//   //     </GridToolbarContainer>
//   //   );
//   // };

//   const CustomToolbarAssetOperator = () => {
//     return (
//       <GridToolbarContainer>
//         <Button
//           variant="text"
//           color="primary"
//           sx={{ padding: "4px" }}
//           onClick={() => {
//             setFilterPanelOpenAssetOperator((previousValue) => !previousValue);
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

//   const CustomToolbarAssetPart = () => {
//     return (
//       <GridToolbarContainer>
//         <Button
//           variant="text"
//           color="primary"
//           sx={{ padding: "4px" }}
//           onClick={() => {
//             setFilterPanelOpenAssetPart((previousValue) => !previousValue);
//           }}
//         >
//           <FilterList style={{ marginRight: "8px" }} />
//           <Typography style={{ fontSize: "14px", marginBottom: "2px" }}>
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
//                         {selectedAssetsOperator.length > 0
//                           ? selectedAssetsOperator.join(", ")
//                           : "Choose some assets"}
//                       </Typography>
//                     }
//                   >
//                     <FormControl
//                       sx={{ m: 1, width: 200, margin: "4px 20px 0 0" }}
//                     >
//                       <InputLabel>Assets</InputLabel>
//                       <Select
//                         multiple
//                         value={selectedAssetsOperator}
//                         onChange={(
//                           event: SelectChangeEvent<
//                             typeof selectedAssetsOperator
//                           >
//                         ) => {
//                           const {
//                             target: { value },
//                           } = event;
//                           setSelectedAssetsOperator(
//                             typeof value === "string" ? value.split(",") : value
//                           );
//                         }}
//                         input={<OutlinedInput label="Assets" />}
//                         renderValue={(selected) => selected.join(", ")}
//                         MenuProps={{
//                           PaperProps: {
//                             style: {
//                               maxHeight: 48 * 4.5 + 8,
//                               width: 200,
//                             },
//                           },
//                         }}
//                       >
//                         {(userDataRedux?.assetList ?? []).map((name) => (
//                           <MenuItem key={name} value={name}>
//                             <Checkbox
//                               checked={
//                                 selectedAssetsOperator.indexOf(name) > -1
//                               }
//                             />
//                             <ListItemText primary={name} />
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </Tooltip>

//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         color="primary"
//                         checked={checkboxDateAssetOperator}
//                         onChange={(event) => {
//                           setCheckboxDateAssetOperator(event.target.checked);
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
//                       value={dayjs(startDateAssetOperator)}
//                       onChange={(date) => {
//                         setStartDateAssetOperator(
//                           date ? date.toDate() : new Date()
//                         );
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
//                       value={dayjs(endDateAssetOperator)}
//                       onChange={(date) => {
//                         setEndDateAssetOperator(
//                           date ? date.toDate() : new Date()
//                         );
//                       }}
//                       sx={{
//                         width: "150px",
//                         marginTop: "16px",
//                         paddingBottom: "8px",
//                       }}
//                       disabled={checkboxDateAssetOperator}
//                     />
//                   </LocalizationProvider>

//                   {!loadingAssetOperator ? (
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={() => {
//                         void loadStatsAssetOperator();
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
//                         setCancelingLoadingAssetOperator(true);
//                       }}
//                       style={{ marginLeft: "50px" }}
//                     >
//                       {!cancelingLoadingAssetOperator
//                         ? "CANCEL"
//                         : "CANCELING..."}
//                     </Button>
//                   )}
//                 </div>

//                 {loadingAssetOperator && (
//                   <Box sx={{ width: "100%" }}>
//                     <LinearProgress
//                       variant="determinate"
//                       value={loadingProgressAssetOperator}
//                     />
//                   </Box>
//                 )}

//                 <Paper style={{ display: "flex" }}>
//                   <Collapse
//                     orientation="horizontal"
//                     in={filterPanelOpenAssetOperator}
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
//                             color: filterPanelCloseHoverStateAssetOperator
//                               ? "rgba(0, 0, 0, 0.8)"
//                               : "rgba(0, 0, 0, 0.3)",
//                             position: "sticky",
//                             left: 240,
//                           }}
//                           onMouseEnter={() => {
//                             setFilterPanelCloseHoverStateAssetOperator(true);
//                           }}
//                           onMouseLeave={() => {
//                             setFilterPanelCloseHoverStateAssetOperator(false);
//                           }}
//                           onClick={() => {
//                             setFilterPanelOpenAssetOperator((value) => !value);
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
//                               value={filtersAssetOperatorRadio}
//                               onChange={(event) => {
//                                 const radioValue = (
//                                   event.target as HTMLInputElement
//                                 ).value;
//                                 setFiltersAssetOperatorRadio(radioValue);
//                                 setFiltersAssetOperator({
//                                   ...filtersAssetOperator,
//                                   operators: [],
//                                 });
//                               }}
//                             >
//                               <FormControlLabel
//                                 value="AllOperators"
//                                 control={<Radio />}
//                                 label="All Operators"
//                                 style={{ height: "16px" }}
//                               />
//                               <FormControlLabel
//                                 value="MyTeam"
//                                 control={<Radio />}
//                                 label="My Team"
//                               />
//                             </RadioGroup>
//                           </FormControl>
//                           <Tooltip
//                             placement="top"
//                             title={
//                               <Typography
//                                 style={{ fontSize: "16px", cursor: "default" }}
//                               >
//                                 {filtersAssetOperator.operators.length ===
//                                 userTeamInfo.length
//                                   ? "My Entire Team"
//                                   : filtersAssetOperator.operators.length > 0
//                                   ? filtersAssetOperator.operators.join(", ")
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
//                                 value={filtersAssetOperator.operators}
//                                 onChange={(
//                                   event: SelectChangeEvent<
//                                     typeof filtersAssetOperator.operators
//                                   >
//                                 ) => {
//                                   const {
//                                     target: { value },
//                                   } = event;
//                                   setFiltersAssetOperator({
//                                     ...filtersAssetOperator,
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
//                                 {filterOperatorUserInfo
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
//                                             filtersAssetOperator.operators.indexOf(
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
//                         <div style={{ marginTop: "40px" }}>
//                           <Tooltip
//                             placement="top"
//                             title={
//                               <Typography
//                                 style={{ fontSize: "16px", cursor: "default" }}
//                               >
//                                 {filtersAssetOperator.assets.length > 0
//                                   ? filtersAssetOperator.assets.join(", ")
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
//                                 value={filtersAssetOperator.assets}
//                                 onChange={(
//                                   event: SelectChangeEvent<
//                                     typeof filtersAssetOperator.assets
//                                   >
//                                 ) => {
//                                   const {
//                                     target: { value },
//                                   } = event;
//                                   setFiltersAssetOperator({
//                                     ...filtersAssetOperator,
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
//                                 {rowsAssetOperator
//                                   .map((x) => x.Asset)
//                                   .filter((v, i, a) => a.indexOf(v) === i)
//                                   .sort((a, b) => a.localeCompare(b))
//                                   .map((name) => (
//                                     <MenuItem key={name} value={name}>
//                                       <Checkbox
//                                         checked={
//                                           filtersAssetOperator.assets.indexOf(
//                                             name
//                                           ) > -1
//                                         }
//                                       />
//                                       <ListItemText primary={name} />
//                                     </MenuItem>
//                                   ))}
//                               </Select>
//                             </FormControl>
//                           </Tooltip>
//                         </div>
//                         <div style={{ marginTop: "40px" }}>
//                           <Tooltip
//                             placement="top"
//                             title={
//                               <Typography
//                                 style={{ fontSize: "16px", cursor: "default" }}
//                               >
//                                 {filtersAssetOperator.parts.length > 0
//                                   ? filtersAssetOperator.parts.join(", ")
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
//                                 value={filtersAssetOperator.parts}
//                                 onChange={(
//                                   event: SelectChangeEvent<
//                                     typeof filtersAssetOperator.parts
//                                   >
//                                 ) => {
//                                   const {
//                                     target: { value },
//                                   } = event;
//                                   setFiltersAssetOperator({
//                                     ...filtersAssetOperator,
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
//                                 {rowsAssetOperator
//                                   .map((x) => x.PartNumber)
//                                   .filter((v, i, a) => a.indexOf(v) === i)
//                                   .sort((a, b) => a.localeCompare(b))
//                                   .map((name) => (
//                                     <MenuItem key={name} value={name}>
//                                       <Checkbox
//                                         checked={
//                                           filtersAssetOperator.parts.indexOf(
//                                             name
//                                           ) > -1
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
//                     in={!filterPanelOpenAssetOperator}
//                     collapsedSize={"calc(100% - 260px)"}
//                   >
//                     <div
//                       style={{
//                         height: "calc(100vh - 200px)",
//                         width: !filterPanelOpenAssetOperator
//                           ? !showRawDataAssetOperator
//                             ? "calc(100vw - 38px)"
//                             : "calc(100vw - 56px)"
//                           : !showRawDataAssetOperator
//                           ? "calc(100vw - 298px)"
//                           : "calc(100vw - 314px)",
//                       }}
//                     >
//                       <CustomDataGrid
//                         columns={columnsAssetOperator}
//                         rows={rowsFilteredAssetOperator}
//                         columnBuffer={14}
//                         pagination={true}
//                         rowHeight={44}
//                         loading={loadingAssetOperator}
//                         pageSizeOptions={[10, 25, 50, 100]}
//                         paginationModel={paginationModelAssetOperator}
//                         onPaginationModelChange={(model) => {
//                           setPaginationModelAssetOperator(model);
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
//                         columnVisibilityModel={
//                           columnVisibilityModelAssetOperator
//                         }
//                         onColumnVisibilityModelChange={(model) => {
//                           setColumnVisibilityModelAssetOperator(model);
//                         }}
//                         rowSelectionModel={rowSelectionModelAssetOperator}
//                         onRowSelectionModelChange={(model) => {
//                           setRowSelectionModelAssetOperator(model);
//                         }}
//                         onCellClick={(params) => {
//                           if (params.field !== "Operator") {
//                             let newSelections = [
//                               ...(rowSelectionModelAssetOperator as number[]),
//                             ];
//                             const rowId = params.id as number;
//                             if (newSelections.includes(rowId)) {
//                               const index = newSelections.indexOf(rowId);
//                               if (index > -1) newSelections.splice(index, 1);
//                             } else newSelections.push(rowId);
//                             setRowSelectionModelAssetOperator(
//                               newSelections as GridInputRowSelectionModel
//                             );
//                           }
//                         }}
//                       />
//                     </div>
//                   </Collapse>
//                 </Paper>
//                 <Collapse orientation="vertical" in={showRawDataAssetOperator}>
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
//                         {"Search for Part Number"}
//                       </Typography>
//                     }
//                   >
//                     <TextField
//                       id="outlined-error"
//                       label="Part Number"
//                       // placeholder="Part Number"
//                       variant="outlined"
//                       sx={{ m: 1, width: 200, margin: "4px 20px 0 0" }}
//                       value={partSearchValueAssetPart}
//                       onChange={(event) => {
//                         setPartSearchValueAssetPart(event.target.value);
//                       }}
//                     />
//                   </Tooltip>
//                   <Tooltip
//                     placement="top"
//                     title={
//                       <Typography
//                         style={{ fontSize: "16px", cursor: "default" }}
//                       >
//                         {selectedAssetsPart.length > 0
//                           ? selectedAssetsPart.join(", ")
//                           : "Choose some assets"}
//                       </Typography>
//                     }
//                   >
//                     <FormControl
//                       sx={{ m: 1, width: 200, margin: "4px 20px 0 0" }}
//                     >
//                       <InputLabel>Assets</InputLabel>
//                       <Select
//                         multiple
//                         value={selectedAssetsPart}
//                         onChange={(
//                           event: SelectChangeEvent<typeof selectedAssetsPart>
//                         ) => {
//                           const {
//                             target: { value },
//                           } = event;
//                           setSelectedAssetsPart(
//                             typeof value === "string" ? value.split(",") : value
//                           );
//                         }}
//                         input={<OutlinedInput label="Assets" />}
//                         renderValue={(selected) => selected.join(", ")}
//                         MenuProps={{
//                           PaperProps: {
//                             style: {
//                               maxHeight: 48 * 4.5 + 8,
//                               width: 200,
//                             },
//                           },
//                         }}
//                       >
//                         {(userDataRedux?.assetList ?? []).map((name) => (
//                           <MenuItem key={name} value={name}>
//                             <Checkbox
//                               checked={selectedAssetsPart.indexOf(name) > -1}
//                             />
//                             <ListItemText primary={name} />
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </Tooltip>

//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         color="primary"
//                         checked={checkboxDateAssetPart}
//                         onChange={(event) => {
//                           setCheckboxDateAssetPart(event.target.checked);
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
//                       value={dayjs(startDateAssetPart)}
//                       onChange={(date) => {
//                         setStartDateAssetPart(
//                           date ? date.toDate() : new Date()
//                         );
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
//                       value={dayjs(endDateAssetPart)}
//                       onChange={(date) => {
//                         setEndDateAssetPart(date ? date.toDate() : new Date());
//                       }}
//                       sx={{
//                         width: "150px",
//                         marginTop: "16px",
//                         paddingBottom: "8px",
//                       }}
//                       disabled={checkboxDateAssetPart}
//                     />
//                   </LocalizationProvider>

//                   {!loadingAssetPart ? (
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={() => {
//                         void loadStatsAssetPart();
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
//                         setCancelingLoadingAssetPart(true);
//                       }}
//                       style={{ marginLeft: "50px" }}
//                     >
//                       {!cancelingLoadingAssetPart ? "CANCEL" : "CANCELING..."}
//                     </Button>
//                   )}
//                 </div>

//                 {loadingAssetPart && (
//                   <Box sx={{ width: "100%" }}>
//                     <LinearProgress
//                       variant="determinate"
//                       value={loadingProgressAssetPart}
//                     />
//                   </Box>
//                 )}

//                 <Paper style={{ display: "flex" }}>
//                   <Collapse
//                     orientation="horizontal"
//                     in={filterPanelOpenAssetPart}
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
//                             color: filterPanelCloseHoverStateAssetPart
//                               ? "rgba(0, 0, 0, 0.8)"
//                               : "rgba(0, 0, 0, 0.3)",
//                             position: "sticky",
//                             left: 240,
//                           }}
//                           onMouseEnter={() => {
//                             setFilterPanelCloseHoverStateAssetPart(true);
//                           }}
//                           onMouseLeave={() => {
//                             setFilterPanelCloseHoverStateAssetPart(false);
//                           }}
//                           onClick={() => {
//                             setFilterPanelOpenAssetPart((value) => !value);
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

//                         <div style={{ marginTop: "40px" }}>
//                           <Tooltip
//                             placement="top"
//                             title={
//                               <Typography
//                                 style={{ fontSize: "16px", cursor: "default" }}
//                               >
//                                 {filtersAssetPart.assets.length > 0
//                                   ? filtersAssetPart.assets.join(", ")
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
//                                 value={filtersAssetPart.assets}
//                                 onChange={(
//                                   event: SelectChangeEvent<
//                                     typeof filtersAssetPart.assets
//                                   >
//                                 ) => {
//                                   const {
//                                     target: { value },
//                                   } = event;
//                                   setFiltersAssetPart({
//                                     ...filtersAssetPart,
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
//                                 {rowsAssetPart
//                                   .map((x) => x.Asset)
//                                   .filter((v, i, a) => a.indexOf(v) === i)
//                                   .sort((a, b) => a.localeCompare(b))
//                                   .map((name) => (
//                                     <MenuItem key={name} value={name}>
//                                       <Checkbox
//                                         checked={
//                                           filtersAssetPart.assets.indexOf(
//                                             name
//                                           ) > -1
//                                         }
//                                       />
//                                       <ListItemText primary={name} />
//                                     </MenuItem>
//                                   ))}
//                               </Select>
//                             </FormControl>
//                           </Tooltip>
//                         </div>
//                         <div style={{ marginTop: "40px" }}>
//                           <Tooltip
//                             placement="top"
//                             title={
//                               <Typography
//                                 style={{ fontSize: "16px", cursor: "default" }}
//                               >
//                                 {filtersAssetPart.parts.length > 0
//                                   ? filtersAssetPart.parts.join(", ")
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
//                                 value={filtersAssetPart.parts}
//                                 onChange={(
//                                   event: SelectChangeEvent<
//                                     typeof filtersAssetPart.parts
//                                   >
//                                 ) => {
//                                   const {
//                                     target: { value },
//                                   } = event;
//                                   setFiltersAssetPart({
//                                     ...filtersAssetPart,
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
//                                 {rowsAssetPart
//                                   .map((x) => x.PartNumber)
//                                   .filter((v, i, a) => a.indexOf(v) === i)
//                                   .sort((a, b) => a.localeCompare(b))
//                                   .map((name) => (
//                                     <MenuItem key={name} value={name}>
//                                       <Checkbox
//                                         checked={
//                                           filtersAssetPart.parts.indexOf(name) >
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
//                     in={!filterPanelOpenAssetPart}
//                     collapsedSize={"calc(100% - 260px)"}
//                   >
//                     <div
//                       style={{
//                         height: "calc(100vh - 200px)",
//                         width: !filterPanelOpenAssetPart
//                           ? !showRawDataAssetPart
//                             ? "calc(100vw - 38px)"
//                             : "calc(100vw - 56px)"
//                           : !showRawDataAssetPart
//                           ? "calc(100vw - 298px)"
//                           : "calc(100vw - 314px)",
//                       }}
//                     >
//                       <CustomDataGrid
//                         columns={columnsAssetPart}
//                         rows={rowsFilteredAssetPart}
//                         columnBuffer={14}
//                         pagination={true}
//                         rowHeight={44}
//                         loading={loadingAssetPart}
//                         pageSizeOptions={[10, 25, 50, 100]}
//                         paginationModel={paginationModelAssetPart}
//                         onPaginationModelChange={(model) => {
//                           setPaginationModelAssetPart(model);
//                         }}
//                         // rowCount={rowsFilteredAssetPart.length}
//                         checkboxSelection={true}
//                         disableRowSelectionOnClick={true}
//                         slots={{
//                           toolbar: CustomToolbarAssetPart,
//                           // footer: CustomFooterAssetOperator,
//                         }}
//                         slotProps={{
//                           toolbar: {
//                             printOptions: { disableToolbarButton: true },
//                           },
//                         }}
//                         columnVisibilityModel={columnVisibilityModelAssetPart}
//                         onColumnVisibilityModelChange={(model) => {
//                           setColumnVisibilityModelAssetPart(model);
//                         }}
//                         rowSelectionModel={rowSelectionModelAssetPart}
//                         onRowSelectionModelChange={(model) => {
//                           setRowSelectionModelAssetPart(model);
//                         }}
//                         onCellClick={(params) => {
//                           if (params.field !== "Operator") {
//                             let newSelections = [
//                               ...(rowSelectionModelAssetPart as number[]),
//                             ];
//                             const rowId = params.id as number;
//                             if (newSelections.includes(rowId)) {
//                               const index = newSelections.indexOf(rowId);
//                               if (index > -1) newSelections.splice(index, 1);
//                             } else newSelections.push(rowId);
//                             setRowSelectionModelAssetPart(
//                               newSelections as GridInputRowSelectionModel
//                             );
//                           }
//                         }}
//                       />
//                     </div>
//                   </Collapse>
//                 </Paper>
//                 <Collapse orientation="vertical" in={showRawDataAssetPart}>
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
