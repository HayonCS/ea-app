import * as React from "react";
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Collapse,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  LinearProgress,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Popover,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import { makeStyles, styled, withStyles } from "@mui/styles";
import SwipeableViews from "react-swipeable-views";
import {
  DataGrid,
  GridColDef,
  GridColumnVisibilityModel,
  GridFooter,
  GridFooterContainer,
  GridInputRowSelectionModel,
  GridPaginationModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  gridClasses,
} from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import * as dayjs from "dayjs";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { getHHMMSS } from "../../utilities/date-util";
import { UserDisplayHover } from "client/components/user-display/UserDisplayHover";
import {
  getProcessDataExport,
  getProcessDataExportRange,
} from "../../utilities/redis";
import { useSelector, shallowEqual } from "react-redux";
import { UserDisplayClickGentex } from "client/components/user-display/UserDisplayClickGentex";
import { Close, FilterList } from "@mui/icons-material";
import {
  ProcessDataExport,
  ProcessDataOperatorTotals,
  ProcessDataRawData,
} from "../../utilities/types";
import {
  getFinalProcessDataOperator,
  getFinalProcessDataOperatorTotals,
} from "../../utilities/process-data";
import { getEmployeeInfoGentex } from "../../utilities/mes";
import { enqueueSnackbar } from "notistack";
import { UserInformation } from "core/schemas/user-information.gen";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    height: "100%",
  },
  appHeader: {
    backgroundColor: "#1d222b",
    width: "100%",
    height: "96px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    fontSize: "calc(10px + 2vmin)",
    color: "white",
    paddingTop: "0px",
  },
  paperStyle: {
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    height: "calc(100vh - 48px)",
  },
  paperStyle1: {
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    height: "calc(100vh - 98px)",
    borderTop: "2px solid rgba(0, 0, 0, 0.3)",
  },
  tabBar: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    zIndex: 1,
  },
  tabStyle: {
    fontWeight: "bolder",
    fontSize: "1rem",
  },
  gridLayout: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  gridItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  swipeableView: {
    height: "calc(100vh - 96px)",
    width: "100%",
  },
  tabPanel: {
    width: "100%",
    height: "100%",
  },
  cellStyle: {
    marginRight: "4px",
    width: "100%",
    height: "100%",
    alignItems: "center",
    color: "black",
    fontSize: "16px",
    fontFamily: "inherit",
    fontWeight: "bold",
    display: "flex",
  },
}));

interface FooterStatsTotals {
  Rows: number;
  Parts: number;
  Passes: number;
  Fails: number;
  RunActual: number;
  RunTheory: number;
  Efficiency: number;
  PartsPerHour: number;
}

let cancelLoadingAssetOperator = false;

export const OperatorAsset: React.FC<{}> = (props) => {
  const classes = useStyles();

  const [loadingAssetOperator, setLoadingAssetOperator] = React.useState(false);
  const [loadingProgressAssetOperator, setLoadingProgressAssetOperator] =
    React.useState(0);
  const [cancelingLoadingAssetOperator, setCancelingLoadingAssetOperator] =
    React.useState(false);

  const [operatorEmployeeInfo, setOperatorEmployeeInfo] = React.useState<
    UserInformation[]
  >([]);
  const [filterOperatorUserInfo, setFilterOperatorUserInfo] = React.useState<
    UserInformation[]
  >([]);
  const [filtersAssetOperator, setFiltersAssetOperator] = React.useState<{
    operators: string[];
    assets: string[];
    parts: string[];
  }>({ operators: [], assets: [], parts: [] });
  const [filtersAssetOperatorRadio, setFiltersAssetOperatorRadio] =
    React.useState("AllOperators");
  const [selectedAssetsOperator, setSelectedAssetsOperator] = React.useState<
    string[]
  >([]);
  const [checkboxDateAssetOperator, setCheckboxDateAssetOperator] =
    React.useState(false);
  const [startDateAssetOperator, setStartDateAssetOperator] = React.useState(
    new Date()
  );
  const [endDateAssetOperator, setEndDateAssetOperator] = React.useState(
    new Date()
  );
  const [processDataAssetOperator, setProcessDataAssetOperator] =
    React.useState<ProcessDataRawData[]>([]);
  const [rowsAssetOperator, setRowsAssetOperator] = React.useState<
    ProcessDataOperatorTotals[]
  >([]);
  const [rowsFilteredAssetOperator, setRowsFilteredAssetOperator] =
    React.useState<ProcessDataOperatorTotals[]>([]);
  const [paginationModelAssetOperator, setPaginationModelAssetOperator] =
    React.useState<GridPaginationModel>({
      page: 0,
      pageSize: 100,
    });
  const [
    columnVisibilityModelAssetOperator,
    setColumnVisibilityModelAssetOperator,
  ] = React.useState<GridColumnVisibilityModel>({
    board: false,
    recipe: false,
    changeover: false,
  });
  const [rowSelectionModelAssetOperator, setRowSelectionModelAssetOperator] =
    React.useState<GridInputRowSelectionModel>([]);
  const [footerStatsAssetOperator, setFooterStatsAssetOperator] =
    React.useState<FooterStatsTotals>({
      Rows: 0,
      Parts: 0,
      Passes: 0,
      Fails: 0,
      RunActual: 0,
      RunTheory: 0,
      Efficiency: 0,
      PartsPerHour: 0,
    });

  const [showRawDataAssetOperator, setShowRawDataAssetOperator] =
    React.useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = React.useState(false);
  const [filterPanelCloseHoverState, setFilterPanelCloseHoverState] =
    React.useState(false);

  // const loadStatsAssetOperator = async () => {
  //   enqueueSnackbar("Loading data for operators by assets...", {
  //     variant: "info",
  //     autoHideDuration: 3000,
  //   });
  //   setLoadingProgressAssetOperator(0);
  //   setLoadingAssetOperator(true);
  //   let canceled = false;
  //   let progress = 0;
  //   const step = 90 / (selectedAssetsOperator.length * 3);
  //   let processDataTotal: ProcessDataExport[] = [];
  //   let finalOperatorData: ProcessDataOperatorTotals[] = [];
  //   for (let i = 0; i < selectedAssetsOperator.length; ++i) {
  //     if (cancelLoadingAssetOperator) {
  //       canceled = true;
  //       break;
  //     }
  //     const asset = selectedAssetsOperator[i];
  //     const processData = await getProcessDataExportRange(
  //       asset,
  //       startDateAssetOperator,
  //       checkboxDateAssetOperator
  //         ? startDateAssetOperator
  //         : endDateAssetOperator
  //     );
  //     if (cancelLoadingAssetOperator) {
  //       canceled = true;
  //       break;
  //     }
  //     progress += step;
  //     setLoadingProgressAssetOperator(progress);
  //     if (processData) {
  //       const procDataOperator = await getFinalProcessDataOperator(processData);
  //       if (cancelLoadingAssetOperator) {
  //         canceled = true;
  //         break;
  //       }
  //       progress += step;
  //       setLoadingProgressAssetOperator(progress);
  //       const operatorTotals = await getFinalProcessDataOperatorTotals(
  //         procDataOperator,
  //         userDataRedux?.orgCode ?? "14"
  //       );
  //       if (cancelLoadingAssetOperator) {
  //         canceled = true;
  //         break;
  //       }
  //       processDataTotal = processDataTotal.concat(processData);
  //       finalOperatorData = finalOperatorData.concat(operatorTotals);
  //       progress += step;
  //       setLoadingProgressAssetOperator(progress);
  //     } else {
  //       progress += step * 2;
  //       setLoadingProgressAssetOperator(progress);
  //     }
  //   }
  //   if (!canceled) {
  //     setLoadingProgressAssetOperator(90);
  //     finalOperatorData.forEach((x, i) => (x.id = i));
  //     const rawDataTotal = processDataTotal.map((x, i) => {
  //       let obj: ProcessDataRawData = {
  //         id: i,
  //         ...x,
  //       };
  //       return obj;
  //     });
  //     setRowSelectionModelAssetOperator([]);
  //     setRowsAssetOperator(finalOperatorData);
  //     setProcessDataAssetOperator(rawDataTotal);
  //     await loadAllEmployeeInfo(finalOperatorData);
  //     setLoadingProgressAssetOperator(100);
  //     setLoadingAssetOperator(false);
  //     cancelLoadingAssetOperator = false;
  //     setCancelingLoadingAssetOperator(false);
  //     const opList = finalOperatorData
  //       .map((x) => x.Operator)
  //       .filter((v, i, a) => a.indexOf(v) === i);
  //     const partList = finalOperatorData
  //       .map((x) => x.PartNumber)
  //       .filter((v, i, a) => a.indexOf(v) === i);
  //     const assetList = finalOperatorData
  //       .map((x) => x.Asset)
  //       .filter((v, i, a) => a.indexOf(v) === i);
  //     const opFilter = opList.filter((op) =>
  //       filtersAssetOperator.operators.includes(op)
  //     );
  //     const partFilter = partList.filter((part) =>
  //       filtersAssetOperator.parts.includes(part)
  //     );
  //     const assetFilter = assetList.filter((asset) =>
  //       filtersAssetOperator.assets.includes(asset)
  //     );
  //     setFiltersAssetOperator({
  //       operators: opFilter,
  //       parts: partFilter,
  //       assets: assetFilter,
  //     });
  //     enqueueSnackbar("Data loaded successfully!", {
  //       variant: "success",
  //       autoHideDuration: 3000,
  //     });
  //   } else {
  //     setLoadingProgressAssetOperator(0);
  //     setLoadingAssetOperator(false);
  //     cancelLoadingAssetOperator = false;
  //     setCancelingLoadingAssetOperator(false);
  //     enqueueSnackbar("Canceled loading data.", {
  //       variant: "info",
  //       autoHideDuration: 3000,
  //     });
  //   }
  // };

  // const loadAllEmployeeInfo = async (
  //   processData: ProcessDataOperatorTotals[]
  // ) => {
  //   let allInfo: EmployeeInfoGentex[] = [];
  //   const ids = processData
  //     .map((x) => x.Operator)
  //     .filter((v, i, a) => a.indexOf(v) === i)
  //     .sort((a, b) => a.localeCompare(b));
  //   for (let i = 0; i < ids.length; ++i) {
  //     if (
  //       teamGentexRedux &&
  //       teamGentexRedux.some((x) => x.employeeNumber === ids[i])
  //     ) {
  //       const found = teamGentexRedux.find((x) => x.employeeNumber === ids[i]);
  //       if (found) {
  //         allInfo.push(found);
  //       }
  //     } else {
  //       const info = await getEmployeeInfoGentex(ids[i]);
  //       if (info) {
  //         allInfo.push(info);
  //       }
  //     }
  //   }
  //   setOperatorEmployeeInfo(allInfo);
  // };

  // React.useEffect(() => {
  //   setRowSelectionModelAssetOperator([]);
  //   let rows = [...rowsAssetOperator];
  //   if (filtersAssetOperator.assets.length > 0) {
  //     rows = rows.filter((x) => filtersAssetOperator.assets.includes(x.Asset));
  //   }
  //   if (filtersAssetOperator.operators.length > 0) {
  //     rows = rows.filter((x) =>
  //       filtersAssetOperator.operators.includes(x.Operator)
  //     );
  //   }
  //   if (filtersAssetOperator.parts.length > 0) {
  //     rows = rows.filter((x) =>
  //       filtersAssetOperator.parts.includes(x.PartNumber)
  //     );
  //   }
  //   if (filtersAssetOperatorRadio === "MyTeam") {
  //     const myTeam = teamGentexRedux?.map((x) => x.employeeNumber) ?? [];
  //     rows = rows.filter((x) => myTeam.includes(x.Operator));
  //   }
  //   setRowsFilteredAssetOperator(rows);

  //   if (filtersAssetOperatorRadio === "AllOperators") {
  //     setFilterOperatorUserInfo(operatorEmployeeInfo);
  //   } else {
  //     setFilterOperatorUserInfo(teamGentexRedux ?? []);
  //   }
  // }, [
  //   rowsAssetOperator,
  //   filtersAssetOperator,
  //   filtersAssetOperatorRadio,
  //   teamGentexRedux,
  //   operatorEmployeeInfo,
  // ]);

  // React.useEffect(() => {
  //   if (typeof rowSelectionModelAssetOperator !== "number") {
  //     let stats: FooterStatsTotals = {
  //       Rows: 0,
  //       Parts: 0,
  //       Passes: 0,
  //       Fails: 0,
  //       RunActual: 0,
  //       RunTheory: 0,
  //       Efficiency: 0,
  //       PartsPerHour: 0,
  //     };
  //     for (const gridRowId of rowSelectionModelAssetOperator) {
  //       const id = gridRowId as number;
  //       const row = rowsAssetOperator[id];
  //       stats.Rows += 1;
  //       stats.Parts += row.Passes + row.Fails;
  //       stats.Passes += row.Passes;
  //       stats.Fails += row.Fails;
  //       stats.RunActual += row.RunActual;
  //       stats.RunTheory += row.RunTheory;
  //       const efficiency =
  //         stats.RunActual > 0 ? (stats.RunTheory / stats.RunActual) * 100 : 100;
  //       const partsPerHour =
  //         stats.RunActual > 0
  //           ? ((stats.Passes + stats.Fails) / stats.RunActual) * 60
  //           : stats.Passes + stats.Fails;
  //       stats.Efficiency = efficiency;
  //       stats.PartsPerHour = partsPerHour;
  //     }
  //     setFooterStatsAssetOperator(stats);
  //   }
  // }, [rowSelectionModelAssetOperator, rowsAssetOperator]);

  const columnsAssetOperator: GridColDef[] = [
    {
      field: "Date",
      headerName: "Date",
      description: "Date",
      width: 110,
      renderCell: (cellValue) => {
        return (
          <div className={classes.cellStyle}>
            {(cellValue.value as Date).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      field: "StartTime",
      headerName: "Start Time",
      description: "Start Time",
      width: 115,
      renderCell: (cellValue) => {
        return (
          <div className={classes.cellStyle}>
            {(cellValue.value as Date).toLocaleTimeString()}
          </div>
        );
      },
    },
    {
      field: "EndTime",
      headerName: "End Time",
      description: "End Time",
      width: 115,
      renderCell: (cellValue) => {
        return (
          <div className={classes.cellStyle}>
            {(cellValue.value as Date).toLocaleTimeString()}
          </div>
        );
      },
    },
    {
      field: "Asset",
      headerName: "Asset",
      description: "Asset",
      width: 110,
      renderCell: (cellValue) => {
        return <div className={classes.cellStyle}>{cellValue.value}</div>;
      },
    },
    {
      field: "PartNumber",
      headerName: "Part",
      description: "Part Number",
      width: 114,
      renderCell: (cellValue) => {
        return <div className={classes.cellStyle}>{cellValue.value}</div>;
      },
    },
    {
      field: "Passes",
      headerName: "Passes",
      description: "Parts Passed",
      width: 90,
      renderCell: (cellValue) => {
        return <div className={classes.cellStyle}>{cellValue.value}</div>;
      },
    },
    {
      field: "Fails",
      headerName: "Fails",
      description: "Parts Failed",
      width: 90,
      renderCell: (cellValue) => {
        return <div className={classes.cellStyle}>{cellValue.value}</div>;
      },
    },
    {
      field: "Line",
      headerName: "Line",
      description: "Line",
      width: 120,
      renderCell: (cellValue) => {
        return <div className={classes.cellStyle}>{cellValue.value}</div>;
      },
    },
    {
      field: "Operator",
      headerName: "Operator",
      description: "Operator",
      minWidth: 150,
      flex: 1,
      renderCell: (cellValue) => {
        const id = cellValue.value as string;
        const foundIndex = operatorEmployeeInfo.findIndex((userInfo) => {
          return userInfo.employeeId === id;
        });

        return foundIndex > -1 ? (
          <UserDisplayClickGentex userInfo={operatorEmployeeInfo[foundIndex]} />
        ) : (
          // <UserDisplayClick userId={"-1"} />
          <div className={classes.cellStyle}>{cellValue.value}</div>
        );
      },
    },
    {
      field: "CycleTime",
      headerName: "Cycle Time",
      description: "Cycle Time (s)",
      width: 100,
      renderCell: (cellValue) => {
        return (
          <div className={classes.cellStyle}>
            {(Math.round(cellValue.value * 100) / 100).toFixed(2)}
          </div>
        );
      },
    },
    {
      field: "RunActual",
      headerName: "Actual",
      description: "Actual Runtime",
      width: 100,
      renderCell: (cellValue) => {
        const label = getHHMMSS(cellValue.value);
        return <div className={classes.cellStyle}>{label}</div>;
      },
    },
    {
      field: "RunTheory",
      headerName: "Expected",
      description: "Expected Runtime",
      width: 100,
      renderCell: (cellValue) => {
        const label = getHHMMSS(cellValue.value);
        return <div className={classes.cellStyle}>{label}</div>;
      },
    },
    {
      field: "Efficiency",
      headerName: "Efficiency",
      description: "Efficiency",
      width: 100,
      renderCell: (cellValue) => {
        const value = Math.round(cellValue.value * 100) / 100;
        const label = `${value.toFixed(2)}%`;
        return (
          <div
            className={classes.cellStyle}
            style={{
              backgroundColor:
                value >= 95 ? "rgb(0, 200, 0)" : value >= 85 ? "orange" : "red",
              paddingLeft: "8px",
              marginRight: "8px",
            }}
          >
            {label}
          </div>
        );
      },
    },
    {
      field: "PartsPerHour",
      headerName: "PPH",
      description: "Parts per Hour",
      minWidth: 80,
      flex: 1,
      renderCell: (cellValue) => {
        return (
          <div className={classes.cellStyle}>
            {(Math.round(cellValue.value * 100) / 100).toFixed(2)}
          </div>
        );
      },
    },
  ];

  return <div />;

  // return (
  //   <div style={{ cursor: "default", padding: "0 20px" }}>
  //               <div
  //                 style={{
  //                   display: "flex",
  //                   justifyContent: "center",
  //                   alignItems: "center",
  //                 }}
  //               >
  //                 <Tooltip
  //                   placement="top"
  //                   title={
  //                     <Typography
  //                       style={{ fontSize: "16px", cursor: "default" }}
  //                     >
  //                       {selectedAssetsOperator.length > 0
  //                         ? selectedAssetsOperator.join(", ")
  //                         : "Choose some assets"}
  //                     </Typography>
  //                   }
  //                 >
  //                   <FormControl
  //                     sx={{ m: 1, width: 200, margin: "4px 20px 0 0" }}
  //                   >
  //                     <InputLabel>Assets</InputLabel>
  //                     <Select
  //                       multiple
  //                       value={selectedAssetsOperator}
  //                       onChange={(
  //                         event: SelectChangeEvent<
  //                           typeof selectedAssetsOperator
  //                         >
  //                       ) => {
  //                         const {
  //                           target: { value },
  //                         } = event;
  //                         setSelectedAssetsOperator(
  //                           typeof value === "string" ? value.split(",") : value
  //                         );
  //                       }}
  //                       input={<OutlinedInput label="Assets" />}
  //                       renderValue={(selected) => selected.join(", ")}
  //                       MenuProps={{
  //                         PaperProps: {
  //                           style: {
  //                             maxHeight: 48 * 4.5 + 8,
  //                             width: 200,
  //                           },
  //                         },
  //                       }}
  //                     >
  //                       {(userDataRedux?.assets ?? []).map((name) => (
  //                         <MenuItem key={name} value={name}>
  //                           <Checkbox
  //                             checked={
  //                               selectedAssetsOperator.indexOf(name) > -1
  //                             }
  //                           />
  //                           <ListItemText primary={name} />
  //                         </MenuItem>
  //                       ))}
  //                     </Select>
  //                   </FormControl>
  //                 </Tooltip>

  //                 <FormControlLabel
  //                   control={
  //                     <Checkbox
  //                       color="primary"
  //                       checked={checkboxDateAssetOperator}
  //                       onChange={(event) => {
  //                         setCheckboxDateAssetOperator(event.target.checked);
  //                       }}
  //                     />
  //                   }
  //                   labelPlacement="start"
  //                   label={
  //                     <Typography variant="body1" style={{ fontSize: "14px" }}>
  //                       {"Single Date"}
  //                     </Typography>
  //                   }
  //                   style={{ padding: "4px 30px 0 0" }}
  //                 />

  //                 <LocalizationProvider dateAdapter={AdapterDayjs}>
  //                   <DatePicker
  //                     format="MM/DD/YYYY"
  //                     label="Start"
  //                     value={dayjs(startDateAssetOperator)}
  //                     onChange={(date) => {
  //                       setStartDateAssetOperator(
  //                         date ? date.toDate() : new Date()
  //                       );
  //                     }}
  //                     sx={{
  //                       width: "150px",
  //                       marginTop: "16px",
  //                       paddingBottom: "8px",
  //                     }}
  //                   />
  //                   <Typography
  //                     variant="body1"
  //                     component={"span"}
  //                     style={{ padding: "10px 20px 0 20px" }}
  //                   >
  //                     {"- to -"}
  //                   </Typography>
  //                   <DatePicker
  //                     format="MM/DD/YYYY"
  //                     label="End"
  //                     value={dayjs(endDateAssetOperator)}
  //                     onChange={(date) => {
  //                       setEndDateAssetOperator(
  //                         date ? date.toDate() : new Date()
  //                       );
  //                     }}
  //                     sx={{
  //                       width: "150px",
  //                       marginTop: "16px",
  //                       paddingBottom: "8px",
  //                     }}
  //                     disabled={checkboxDateAssetOperator}
  //                   />
  //                 </LocalizationProvider>

  //                 {!loadingAssetOperator ? (
  //                   <Button
  //                     variant="contained"
  //                     color="primary"
  //                     onClick={(event) => {
  //                       loadStatsAssetOperator();
  //                       // setLoadingAssetOperator(true);
  //                     }}
  //                     style={{ marginLeft: "50px" }}
  //                   >
  //                     GET
  //                   </Button>
  //                 ) : (
  //                   <Button
  //                     variant="contained"
  //                     color={!cancelLoadingAssetOperator ? "error" : "warning"}
  //                     onClick={(event) => {
  //                       cancelLoadingAssetOperator = true;
  //                       setCancelingLoadingAssetOperator(true);
  //                     }}
  //                     style={{ marginLeft: "50px" }}
  //                   >
  //                     {!cancelingLoadingAssetOperator
  //                       ? "CANCEL"
  //                       : "CANCELING..."}
  //                   </Button>
  //                 )}
  //               </div>

  //               {loadingAssetOperator && (
  //                 <Box sx={{ width: "100%" }}>
  //                   <LinearProgress
  //                     variant="determinate"
  //                     value={loadingProgressAssetOperator}
  //                   />
  //                 </Box>
  //               )}

  //               <Paper style={{ display: "flex" }}>
  //                 <Collapse orientation="horizontal" in={filterPanelOpen}>
  //                   <Paper
  //                     style={{
  //                       // display: filterPanelOpen ? "flex" : "none",
  //                       display: "flex",
  //                       height: "100%",
  //                     }}
  //                   >
  //                     <div style={{ width: 260, textAlign: "center" }}>
  //                       <IconButton
  //                         aria-label="Close"
  //                         style={{
  //                           color: filterPanelCloseHoverState
  //                             ? "rgba(0, 0, 0, 0.8)"
  //                             : "rgba(0, 0, 0, 0.3)",
  //                           position: "sticky",
  //                           left: 240,
  //                         }}
  //                         onMouseEnter={() => {
  //                           setFilterPanelCloseHoverState(true);
  //                         }}
  //                         onMouseLeave={() => {
  //                           setFilterPanelCloseHoverState(false);
  //                         }}
  //                         onClick={() => {
  //                           setFilterPanelOpen((value) => !value);
  //                         }}
  //                       >
  //                         <Close />
  //                       </IconButton>
  //                       <Typography
  //                         style={{
  //                           fontSize: "18px",
  //                           fontWeight: "bold",
  //                           margin: "10px 0 30px 0",
  //                         }}
  //                       >
  //                         {"FILTERS"}
  //                       </Typography>
  //                       <div>
  //                         <FormControl>
  //                           <RadioGroup
  //                             sx={{ gap: 0 }}
  //                             defaultValue="AllOperators"
  //                             name="radio-buttons-group"
  //                             value={filtersAssetOperatorRadio}
  //                             onChange={(event) => {
  //                               const radioValue = (
  //                                 event.target as HTMLInputElement
  //                               ).value;
  //                               setFiltersAssetOperatorRadio(radioValue);
  //                               setFiltersAssetOperator({
  //                                 ...filtersAssetOperator,
  //                                 operators: [],
  //                               });
  //                             }}
  //                           >
  //                             <FormControlLabel
  //                               value="AllOperators"
  //                               control={<Radio />}
  //                               label="All Operators"
  //                               style={{ height: "16px" }}
  //                             />
  //                             <FormControlLabel
  //                               value="MyTeam"
  //                               control={<Radio />}
  //                               label="My Team"
  //                             />
  //                           </RadioGroup>
  //                         </FormControl>
  //                         <Tooltip
  //                           placement="top"
  //                           title={
  //                             <Typography
  //                               style={{ fontSize: "16px", cursor: "default" }}
  //                             >
  //                               {filtersAssetOperator.operators.length ===
  //                               teamGentexRedux?.length
  //                                 ? "My Entire Team"
  //                                 : filtersAssetOperator.operators.length > 0
  //                                 ? filtersAssetOperator.operators.join(", ")
  //                                 : "Choose some operators"}
  //                             </Typography>
  //                           }
  //                         >
  //                           <FormControl
  //                             sx={{ m: 1, width: 220, position: "sticky" }}
  //                           >
  //                             <InputLabel>Operators</InputLabel>
  //                             <Select
  //                               multiple={true}
  //                               value={filtersAssetOperator.operators}
  //                               onChange={(
  //                                 event: SelectChangeEvent<
  //                                   typeof filtersAssetOperator.operators
  //                                 >
  //                               ) => {
  //                                 const {
  //                                   target: { value },
  //                                 } = event;
  //                                 setFiltersAssetOperator({
  //                                   ...filtersAssetOperator,
  //                                   operators:
  //                                     typeof value === "string"
  //                                       ? value.split(",")
  //                                       : value,
  //                                 });
  //                               }}
  //                               input={<OutlinedInput label="Operators" />}
  //                               renderValue={(selected) => selected.join(", ")}
  //                               MenuProps={{
  //                                 PaperProps: {
  //                                   style: {
  //                                     maxHeight: 240,
  //                                     width: 220,
  //                                   },
  //                                 },
  //                               }}
  //                             >
  //                               {filterOperatorUserInfo
  //                                 .sort(
  //                                   (a, b) =>
  //                                     a.firstName.localeCompare(b.firstName) ||
  //                                     a.lastName.localeCompare(b.lastName)
  //                                 )
  //                                 .map((user, i) => {
  //                                   return (
  //                                     <MenuItem
  //                                       key={i}
  //                                       value={user.employeeNumber}
  //                                       disableGutters={true}
  //                                     >
  //                                       <Checkbox
  //                                         checked={
  //                                           filtersAssetOperator.operators.indexOf(
  //                                             user.employeeNumber
  //                                           ) > -1
  //                                         }
  //                                       />
  //                                       <UserDisplayHover userInfo={user} />
  //                                     </MenuItem>
  //                                   );
  //                                 })}
  //                             </Select>
  //                           </FormControl>
  //                         </Tooltip>
  //                       </div>
  //                       <div style={{ marginTop: "40px" }}>
  //                         <Tooltip
  //                           placement="top"
  //                           title={
  //                             <Typography
  //                               style={{ fontSize: "16px", cursor: "default" }}
  //                             >
  //                               {filtersAssetOperator.assets.length > 0
  //                                 ? filtersAssetOperator.assets.join(", ")
  //                                 : "Choose some assets"}
  //                             </Typography>
  //                           }
  //                         >
  //                           <FormControl
  //                             sx={{ m: 1, width: 220, position: "sticky" }}
  //                           >
  //                             <InputLabel>Assets</InputLabel>
  //                             <Select
  //                               multiple={true}
  //                               value={filtersAssetOperator.assets}
  //                               onChange={(
  //                                 event: SelectChangeEvent<
  //                                   typeof filtersAssetOperator.assets
  //                                 >
  //                               ) => {
  //                                 const {
  //                                   target: { value },
  //                                 } = event;
  //                                 setFiltersAssetOperator({
  //                                   ...filtersAssetOperator,
  //                                   assets:
  //                                     typeof value === "string"
  //                                       ? value.split(",")
  //                                       : value,
  //                                 });
  //                               }}
  //                               input={<OutlinedInput label="Assets" />}
  //                               renderValue={(selected) => selected.join(", ")}
  //                               MenuProps={{
  //                                 PaperProps: {
  //                                   style: {
  //                                     maxHeight: 240,
  //                                     width: 220,
  //                                   },
  //                                 },
  //                               }}
  //                             >
  //                               {rowsAssetOperator
  //                                 .map((x) => x.Asset)
  //                                 .filter((v, i, a) => a.indexOf(v) === i)
  //                                 .sort((a, b) => a.localeCompare(b))
  //                                 .map((name) => (
  //                                   <MenuItem key={name} value={name}>
  //                                     <Checkbox
  //                                       checked={
  //                                         filtersAssetOperator.assets.indexOf(
  //                                           name
  //                                         ) > -1
  //                                       }
  //                                     />
  //                                     <ListItemText primary={name} />
  //                                   </MenuItem>
  //                                 ))}
  //                             </Select>
  //                           </FormControl>
  //                         </Tooltip>
  //                       </div>
  //                       <div style={{ marginTop: "40px" }}>
  //                         <Tooltip
  //                           placement="top"
  //                           title={
  //                             <Typography
  //                               style={{ fontSize: "16px", cursor: "default" }}
  //                             >
  //                               {filtersAssetOperator.parts.length > 0
  //                                 ? filtersAssetOperator.parts.join(", ")
  //                                 : "Choose some parts"}
  //                             </Typography>
  //                           }
  //                         >
  //                           <FormControl
  //                             sx={{ m: 1, width: 220, position: "sticky" }}
  //                           >
  //                             <InputLabel>Parts</InputLabel>
  //                             <Select
  //                               multiple={true}
  //                               value={filtersAssetOperator.parts}
  //                               onChange={(
  //                                 event: SelectChangeEvent<
  //                                   typeof filtersAssetOperator.parts
  //                                 >
  //                               ) => {
  //                                 const {
  //                                   target: { value },
  //                                 } = event;
  //                                 setFiltersAssetOperator({
  //                                   ...filtersAssetOperator,
  //                                   parts:
  //                                     typeof value === "string"
  //                                       ? value.split(",")
  //                                       : value,
  //                                 });
  //                               }}
  //                               input={<OutlinedInput label="Parts" />}
  //                               renderValue={(selected) => selected.join(", ")}
  //                               MenuProps={{
  //                                 PaperProps: {
  //                                   style: {
  //                                     maxHeight: 240,
  //                                     width: 220,
  //                                   },
  //                                 },
  //                               }}
  //                             >
  //                               {rowsAssetOperator
  //                                 .map((x) => x.PartNumber)
  //                                 .filter((v, i, a) => a.indexOf(v) === i)
  //                                 .sort((a, b) => a.localeCompare(b))
  //                                 .map((name) => (
  //                                   <MenuItem key={name} value={name}>
  //                                     <Checkbox
  //                                       checked={
  //                                         filtersAssetOperator.parts.indexOf(
  //                                           name
  //                                         ) > -1
  //                                       }
  //                                     />
  //                                     <ListItemText primary={name} />
  //                                   </MenuItem>
  //                                 ))}
  //                             </Select>
  //                           </FormControl>
  //                         </Tooltip>
  //                       </div>
  //                     </div>
  //                   </Paper>
  //                 </Collapse>

  //                 <Collapse
  //                   orientation="horizontal"
  //                   in={!filterPanelOpen}
  //                   collapsedSize={"calc(100% - 260px)"}
  //                 >
  //                   <div
  //                     style={{
  //                       height: "calc(100vh - 200px)",
  //                       width: !filterPanelOpen
  //                         ? !showRawDataAssetOperator
  //                           ? "calc(100vw - 38px)"
  //                           : "calc(100vw - 56px)"
  //                         : !showRawDataAssetOperator
  //                         ? "calc(100vw - 298px)"
  //                         : "calc(100vw - 314px)",
  //                     }}
  //                   >
  //                     <CustomDataGrid
  //                       columns={columnsAssetOperator}
  //                       rows={rowsFilteredAssetOperator}
  //                       columnBuffer={14}
  //                       pagination={true}
  //                       rowHeight={44}
  //                       loading={loadingAssetOperator}
  //                       pageSizeOptions={[10, 25, 50, 100]}
  //                       paginationModel={paginationModelAssetOperator}
  //                       onPaginationModelChange={(model) => {
  //                         setPaginationModelAssetOperator(model);
  //                       }}
  //                       rowCount={rowsFilteredAssetOperator.length}
  //                       checkboxSelection={true}
  //                       disableRowSelectionOnClick={true}
  //                       slots={{
  //                         toolbar: CustomToolbarAssetOperator,
  //                         //toolbar: GridToolbar,
  //                         footer: CustomFooterAssetOperator,
  //                       }}
  //                       slotProps={{
  //                         toolbar: {
  //                           printOptions: { disableToolbarButton: true },
  //                         },
  //                       }}
  //                       columnVisibilityModel={
  //                         columnVisibilityModelAssetOperator
  //                       }
  //                       onColumnVisibilityModelChange={(model) => {
  //                         setColumnVisibilityModelAssetOperator(model);
  //                       }}
  //                       rowSelectionModel={rowSelectionModelAssetOperator}
  //                       onRowSelectionModelChange={(model) => {
  //                         setRowSelectionModelAssetOperator(model);
  //                       }}
  //                       onCellClick={(params) => {
  //                         if (params.field !== "Operator") {
  //                           let newSelections = [
  //                             ...(rowSelectionModelAssetOperator as number[]),
  //                           ];
  //                           const rowId = params.id as number;
  //                           if (newSelections.includes(rowId)) {
  //                             const index = newSelections.indexOf(rowId);
  //                             if (index > -1) newSelections.splice(index, 1);
  //                           } else newSelections.push(rowId);
  //                           setRowSelectionModelAssetOperator(
  //                             newSelections as GridInputRowSelectionModel
  //                           );
  //                         }
  //                       }}
  //                     />
  //                   </div>
  //                 </Collapse>
  //               </Paper>
  //               <Collapse orientation="vertical" in={showRawDataAssetOperator}>
  //                 <Paper style={{ marginTop: "8px" }}>
  //                   {/* <DataGridInfinite rows={processDataAssetOperator} /> */}
  //                 </Paper>
  //               </Collapse>
  //             </div>
  // );
};
