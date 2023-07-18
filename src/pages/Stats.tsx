import * as React from "react";
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
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
} from "@mui/material";
import { makeStyles, withStyles } from "@mui/styles";
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
} from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { getEmployeeInfoGentex } from "../utils/MES";
import { getHHMMSS } from "../utils/DateUtility";
import { UserDisplayHover } from "../modules/UserDisplayHover";
import { getProcessOperatorTotalsRange } from "../utils/redis";
import { useSelector, shallowEqual } from "react-redux";
import { AppState } from "../store/type";
import { UserDisplayClickGentex } from "../modules/UserDisplayClickGentex";
import { Close, FilterList } from "@mui/icons-material";
import {
  EmployeeInfoGentex,
  ProcessDataOperatorTotals,
} from "../utils/DataTypes";

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Typography component={"span"}>{children}</Typography>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const CustomDataGrid = withStyles({
  root: {
    border: "none",
    "&.MuiDataGrid-root .MuiDataGrid-columnHeader": {
      padding: 0,
    },
    "&.MuiDataGrid-root .MuiDataGrid-columnHeaderTitleContainer": {
      padding: 0,
      flex: "none",
    },
    "&.MuiDataGrid-root .MuiDataGrid-windowContainer": {
      display: "table-cell",
    },
    "&.MuiDataGrid-root .MuiDataGrid-cell": {
      padding: 0,
    },
  },
  // row: {
  //   cursor: "pointer",
  // },
})(DataGrid);

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
    paddingLeft: "8px",
    width: "100%",
    alignItems: "left",
    color: "black",
    fontSize: "16px",
    fontFamily: "inherit",
    fontWeight: "bold",
  },
}));

export const Stats: React.FC<{}> = (p) => {
  document.title = "Stats | EA App";

  const classes = useStyles();

  const teamGentexRedux = useSelector(
    (state: AppState) => state.userTeamGentex,
    shallowEqual
  );
  const userDataRedux = useSelector(
    (state: AppState) => state.userData,
    shallowEqual
  );

  const [tabValueStats, setTabValueStats] = React.useState(0);

  const [loadingAssetOperator, setLoadingAssetOperator] = React.useState(false);

  const [operatorEmployeeInfo, setOperatorEmployeeInfo] = React.useState<
    EmployeeInfoGentex[]
  >([]);
  const [filterOperatorUserInfo, setFilterOperatorUserInfo] = React.useState<
    EmployeeInfoGentex[]
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

  const [filterPanelOpen, setFilterPanelOpen] = React.useState(false);
  const [filterPanelCloseHoverState, setFilterPanelCloseHoverState] =
    React.useState(false);

  const loadStatsAssetOperator = async () => {
    console.log("Loading Data...");
    setLoadingAssetOperator(true);
    let finalOperatorData: ProcessDataOperatorTotals[] = [];
    for (let i = 0; i < selectedAssetsOperator.length; ++i) {
      const asset = selectedAssetsOperator[i];
      const processData = await getProcessOperatorTotalsRange(
        asset,
        startDateAssetOperator,
        checkboxDateAssetOperator
          ? startDateAssetOperator
          : endDateAssetOperator
      );
      if (processData) {
        finalOperatorData = finalOperatorData.concat(processData);
      } else {
        console.log("FAIL");
      }
    }
    finalOperatorData.forEach((x, i) => (x.id = i));
    setRowSelectionModelAssetOperator([]);
    setRowsAssetOperator(finalOperatorData);
    await loadAllEmployeeInfo(finalOperatorData);
    setLoadingAssetOperator(false);
  };

  const loadAllEmployeeInfo = async (
    processData: ProcessDataOperatorTotals[]
  ) => {
    let allInfo: EmployeeInfoGentex[] = [];
    const ids = processData
      .map((x) => x.Operator)
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => a.localeCompare(b));
    for (let i = 0; i < ids.length; ++i) {
      if (
        teamGentexRedux &&
        teamGentexRedux.some((x) => x.employeeNumber === ids[i])
      ) {
        const found = teamGentexRedux.find((x) => x.employeeNumber === ids[i]);
        if (found) {
          allInfo.push(found);
        }
      } else {
        const info = await getEmployeeInfoGentex(ids[i]);
        if (info) {
          allInfo.push(info);
        }
      }
    }
    setOperatorEmployeeInfo(allInfo);
  };

  React.useEffect(() => {
    setRowSelectionModelAssetOperator([]);
    let rows = [...rowsAssetOperator];
    if (filtersAssetOperator.assets.length > 0) {
      rows = rows.filter((x) => filtersAssetOperator.assets.includes(x.Asset));
    }
    if (filtersAssetOperator.operators.length > 0) {
      rows = rows.filter((x) =>
        filtersAssetOperator.operators.includes(x.Operator)
      );
    }
    if (filtersAssetOperator.parts.length > 0) {
      rows = rows.filter((x) =>
        filtersAssetOperator.parts.includes(x.PartNumber)
      );
    }
    if (filtersAssetOperatorRadio === "MyTeam") {
      const myTeam = teamGentexRedux?.map((x) => x.employeeNumber) ?? [];
      rows = rows.filter((x) => myTeam.includes(x.Operator));
    }
    setRowsFilteredAssetOperator(rows);

    if (filtersAssetOperatorRadio === "AllOperators") {
      setFilterOperatorUserInfo(operatorEmployeeInfo);
    } else {
      setFilterOperatorUserInfo(teamGentexRedux ?? []);
    }
  }, [
    rowsAssetOperator,
    filtersAssetOperator,
    filtersAssetOperatorRadio,
    teamGentexRedux,
    operatorEmployeeInfo,
  ]);

  React.useEffect(() => {
    if (typeof rowSelectionModelAssetOperator !== "number") {
      let stats: FooterStatsTotals = {
        Rows: 0,
        Parts: 0,
        Passes: 0,
        Fails: 0,
        RunActual: 0,
        RunTheory: 0,
        Efficiency: 0,
        PartsPerHour: 0,
      };
      for (const gridRowId of rowSelectionModelAssetOperator) {
        const id = gridRowId as number;
        const row = rowsAssetOperator[id];
        stats.Rows += 1;
        stats.Parts += row.Passes + row.Fails;
        stats.Passes += row.Passes;
        stats.Fails += row.Fails;
        stats.RunActual += row.RunActual;
        stats.RunTheory += row.RunTheory;
        const efficiency =
          stats.RunActual > 0 ? (stats.RunTheory / stats.RunActual) * 100 : 100;
        const partsPerHour =
          stats.RunActual > 0
            ? ((stats.Passes + stats.Fails) / stats.RunActual) * 60
            : stats.Passes + stats.Fails;
        stats.Efficiency = efficiency;
        stats.PartsPerHour = partsPerHour;
      }
      setFooterStatsAssetOperator(stats);
    }
  }, [rowSelectionModelAssetOperator, rowsAssetOperator]);

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
          return userInfo.employeeNumber === id;
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
        const label = value.toFixed(2) + "%";
        return (
          <div
            className={classes.cellStyle}
            style={
              value >= 95
                ? { backgroundColor: "rgb(0, 200, 0)" }
                : value >= 85
                ? { backgroundColor: "orange" }
                : { backgroundColor: "red" }
            }
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

  function CustomFooterAssetOperator() {
    return (
      <GridFooterContainer style={{ justifyContent: "right" }}>
        {footerStatsAssetOperator.Rows > 0 && (
          <div style={{ display: "flex" }}>
            <Typography
              style={{
                paddingRight: "20px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {"Parts: " + footerStatsAssetOperator.Parts}
            </Typography>
            <Typography
              style={{
                paddingRight: "20px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {"Passes: " + footerStatsAssetOperator.Passes}
            </Typography>
            <Typography
              style={{
                paddingRight: "20px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {"Fails: " + footerStatsAssetOperator.Fails}
            </Typography>
            <Typography
              style={{
                paddingRight: "20px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {"Actual: " + getHHMMSS(footerStatsAssetOperator.RunActual)}
            </Typography>
            <Typography
              style={{
                paddingRight: "20px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {"Theory: " + getHHMMSS(footerStatsAssetOperator.RunTheory)}
            </Typography>
            <Typography
              style={{
                paddingRight: "20px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {"Efficiency: " +
                (
                  Math.round(footerStatsAssetOperator.Efficiency * 100) / 100
                ).toFixed(2) +
                "%"}
            </Typography>
            <Typography
              style={{
                paddingRight: "20px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {"PPH: " +
                (
                  Math.round(footerStatsAssetOperator.PartsPerHour * 100) / 100
                ).toFixed(2)}
            </Typography>
          </div>
        )}
        <PopupState variant="popover">
          {(popupState: any) => (
            <div>
              <Button
                variant="contained"
                color="primary"
                {...bindTrigger(popupState)}
              >
                Calculate
              </Button>
              <Popover
                {...bindPopover(popupState)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
              >
                <Box p={4}>
                  <div>
                    <Typography
                      style={{ paddingRight: "20px", fontWeight: "bold" }}
                    >
                      {"Parts: " + footerStatsAssetOperator.Parts}
                    </Typography>
                    <Typography
                      style={{ paddingRight: "20px", fontWeight: "bold" }}
                    >
                      {"Passes: " + footerStatsAssetOperator.Passes}
                    </Typography>
                    <Typography
                      style={{ paddingRight: "20px", fontWeight: "bold" }}
                    >
                      {"Fails: " + footerStatsAssetOperator.Fails}
                    </Typography>
                    <Typography
                      style={{ paddingRight: "20px", fontWeight: "bold" }}
                    >
                      {"Actual: " +
                        getHHMMSS(footerStatsAssetOperator.RunActual)}
                    </Typography>
                    <Typography
                      style={{ paddingRight: "20px", fontWeight: "bold" }}
                    >
                      {"Theory: " +
                        getHHMMSS(footerStatsAssetOperator.RunTheory)}
                    </Typography>
                    <Typography
                      style={{ paddingRight: "20px", fontWeight: "bold" }}
                    >
                      {"Efficiency: " +
                        (
                          Math.round(
                            footerStatsAssetOperator.Efficiency * 100
                          ) / 100
                        ).toFixed(2) +
                        "%"}
                    </Typography>
                    <Typography
                      style={{ paddingRight: "20px", fontWeight: "bold" }}
                    >
                      {"PPH: " +
                        (
                          Math.round(
                            footerStatsAssetOperator.PartsPerHour * 100
                          ) / 100
                        ).toFixed(2)}
                    </Typography>
                  </div>
                </Box>
              </Popover>
            </div>
          )}
        </PopupState>
        <GridFooter style={{ border: "none" }} />
      </GridFooterContainer>
    );
  }

  // const CustomToolbarAssetOperator = () => {
  //   return (
  //     <GridToolbarContainer>
  //       <GridToolbarColumnsButton />
  //       <PopupState variant="popover">
  //         {(popupState: any) => (
  //           <div>
  //             <Button
  //               variant="text"
  //               color="primary"
  //               {...bindTrigger(popupState)}
  //               sx={{ padding: "4px" }}
  //             >
  //               <FilterList style={{ marginRight: "8px" }} />
  //               <Typography style={{ fontSize: "14px", marginBottom: "2px" }}>
  //                 {"Filters"}
  //               </Typography>
  //             </Button>
  //             <Popover
  //               {...bindPopover(popupState)}
  //               anchorOrigin={{
  //                 vertical: "bottom",
  //                 horizontal: "left",
  //               }}
  //               transformOrigin={{
  //                 vertical: "top",
  //                 horizontal: "left",
  //               }}
  //               autoFocus={true}
  //               disableEnforceFocus={true}
  //             >
  //               <Box p={4}>
  //                 <div style={{ textAlign: "center" }}>
  //                   <Typography
  //                     style={{
  //                       fontSize: "18px",
  //                       fontWeight: "bold",
  //                       margin: "40px 0 30px 0",
  //                     }}
  //                   >
  //                     {"Filters"}
  //                   </Typography>
  //                   <div>
  //                     <Tooltip
  //                       placement="top"
  //                       title={
  //                         <Typography
  //                           style={{ fontSize: "16px", cursor: "default" }}
  //                         >
  //                           {filtersAssetOperator.operators.length > 0
  //                             ? filtersAssetOperator.operators.join(", ")
  //                             : "Choose some operators"}
  //                         </Typography>
  //                       }
  //                     >
  //                       <FormControl
  //                         sx={{ m: 1, width: 200, position: "sticky" }}
  //                       >
  //                         <InputLabel>Operators</InputLabel>
  //                         <Select
  //                           multiple={true}
  //                           value={filtersAssetOperator.operators}
  //                           onChange={(
  //                             event: SelectChangeEvent<
  //                               typeof filtersAssetOperator.operators
  //                             >
  //                           ) => {
  //                             const {
  //                               target: { value },
  //                             } = event;
  //                             setFiltersAssetOperator({
  //                               ...filtersAssetOperator,
  //                               operators:
  //                                 typeof value === "string"
  //                                   ? value.split(",")
  //                                   : value,
  //                             });
  //                           }}
  //                           input={<OutlinedInput label="Operators" />}
  //                           renderValue={(selected) => selected.join(", ")}
  //                           MenuProps={{
  //                             PaperProps: {
  //                               style: {
  //                                 maxHeight: 240,
  //                                 width: 200,
  //                               },
  //                             },
  //                           }}
  //                         >
  //                           {userInfo.map((user, i) => {
  //                             return (
  //                               <MenuItem key={i} value={user.employeeId}>
  //                                 <Checkbox
  //                                   checked={
  //                                     filtersAssetOperator.operators.indexOf(
  //                                       user.employeeId
  //                                     ) > -1
  //                                   }
  //                                 />
  //                                 <UserDisplayHover userInfo={user} />
  //                               </MenuItem>
  //                             );
  //                           })}
  //                         </Select>
  //                       </FormControl>
  //                     </Tooltip>
  //                   </div>
  //                   <div style={{ marginTop: "40px" }}>
  //                     <Tooltip
  //                       placement="top"
  //                       title={
  //                         <Typography
  //                           style={{ fontSize: "16px", cursor: "default" }}
  //                         >
  //                           {filtersAssetOperator.assets.length > 0
  //                             ? filtersAssetOperator.assets.join(", ")
  //                             : "Choose some assets"}
  //                         </Typography>
  //                       }
  //                     >
  //                       <FormControl
  //                         sx={{ m: 1, width: 200, position: "sticky" }}
  //                       >
  //                         <InputLabel>Assets</InputLabel>
  //                         <Select
  //                           multiple={true}
  //                           value={filtersAssetOperator.assets}
  //                           onChange={(
  //                             event: SelectChangeEvent<
  //                               typeof filtersAssetOperator.assets
  //                             >
  //                           ) => {
  //                             const {
  //                               target: { value },
  //                             } = event;
  //                             setFiltersAssetOperator({
  //                               ...filtersAssetOperator,
  //                               assets:
  //                                 typeof value === "string"
  //                                   ? value.split(",")
  //                                   : value,
  //                             });
  //                           }}
  //                           input={<OutlinedInput label="Assets" />}
  //                           renderValue={(selected) => selected.join(", ")}
  //                           MenuProps={{
  //                             PaperProps: {
  //                               style: {
  //                                 maxHeight: 240,
  //                                 width: 200,
  //                               },
  //                             },
  //                           }}
  //                         >
  //                           {rowsAssetOperator
  //                             .map((x) => x.Asset)
  //                             .filter((v, i, a) => a.indexOf(v) === i)
  //                             .sort((a, b) => a.localeCompare(b))
  //                             .map((name) => (
  //                               <MenuItem key={name} value={name}>
  //                                 <Checkbox
  //                                   checked={
  //                                     filtersAssetOperator.assets.indexOf(
  //                                       name
  //                                     ) > -1
  //                                   }
  //                                 />
  //                                 <ListItemText primary={name} />
  //                               </MenuItem>
  //                             ))}
  //                         </Select>
  //                       </FormControl>
  //                     </Tooltip>
  //                   </div>
  //                   <div style={{ marginTop: "40px" }}>
  //                     <Tooltip
  //                       placement="top"
  //                       title={
  //                         <Typography
  //                           style={{ fontSize: "16px", cursor: "default" }}
  //                         >
  //                           {filtersAssetOperator.parts.length > 0
  //                             ? filtersAssetOperator.parts.join(", ")
  //                             : "Choose some parts"}
  //                         </Typography>
  //                       }
  //                     >
  //                       <FormControl
  //                         sx={{ m: 1, width: 200, position: "sticky" }}
  //                       >
  //                         <InputLabel>Parts</InputLabel>
  //                         <Select
  //                           multiple={true}
  //                           value={filtersAssetOperator.parts}
  //                           onChange={(
  //                             event: SelectChangeEvent<
  //                               typeof filtersAssetOperator.parts
  //                             >
  //                           ) => {
  //                             const {
  //                               target: { value },
  //                             } = event;
  //                             setFiltersAssetOperator({
  //                               ...filtersAssetOperator,
  //                               parts:
  //                                 typeof value === "string"
  //                                   ? value.split(",")
  //                                   : value,
  //                             });
  //                           }}
  //                           input={<OutlinedInput label="Parts" />}
  //                           renderValue={(selected) => selected.join(", ")}
  //                           MenuProps={{
  //                             PaperProps: {
  //                               style: {
  //                                 maxHeight: 240,
  //                                 width: 200,
  //                               },
  //                             },
  //                           }}
  //                         >
  //                           {rowsAssetOperator
  //                             .map((x) => x.PartNumber)
  //                             .filter((v, i, a) => a.indexOf(v) === i)
  //                             .sort((a, b) => a.localeCompare(b))
  //                             .map((name) => (
  //                               <MenuItem key={name} value={name}>
  //                                 <Checkbox
  //                                   checked={
  //                                     filtersAssetOperator.parts.indexOf(name) >
  //                                     -1
  //                                   }
  //                                 />
  //                                 <ListItemText primary={name} />
  //                               </MenuItem>
  //                             ))}
  //                         </Select>
  //                       </FormControl>
  //                     </Tooltip>
  //                   </div>
  //                 </div>
  //               </Box>
  //             </Popover>
  //           </div>
  //         )}
  //       </PopupState>
  //       <GridToolbarDensitySelector />
  //       <GridToolbarExport />
  //     </GridToolbarContainer>
  //   );
  // };

  function CustomToolbarAssetOperator() {
    return (
      <GridToolbarContainer>
        <Button
          variant="text"
          color="primary"
          sx={{ padding: "4px" }}
          onClick={() => {
            setFilterPanelOpen((previousValue) => !previousValue);
          }}
        >
          <FilterList style={{ marginRight: "8px" }} />
          <Typography style={{ fontSize: "14px", marginBottom: "2px" }}>
            {"Filters"}
          </Typography>
        </Button>
        <GridToolbarColumnsButton />

        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  return (
    <div className={classes.root}>
      <Backdrop
        open={false}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "#fff",
          zIndex: 1,
          flexDirection: "column",
          marginTop: "48px",
        }}
      >
        <CircularProgress color="inherit" style={{ marginBottom: "10px" }} />
        <Typography>Loading...</Typography>
      </Backdrop>
      <Paper className={classes.paperStyle}>
        <div className={classes.gridLayout}>
          <Paper className={classes.tabBar}>
            <Tabs
              value={tabValueStats}
              onChange={(event, newValue) => {
                setTabValueStats(newValue);
              }}
              indicatorColor="primary"
              textColor="primary"
              centered={true}
            >
              <Tab
                label={<Box className={classes.tabStyle}>{"Asset Stats"}</Box>}
                {...a11yProps(0)}
              />
              <Tab
                label={
                  <Box className={classes.tabStyle}>{"*Placeholder*"}</Box>
                }
                {...a11yProps(1)}
              />
              <Tab
                label={
                  <Box className={classes.tabStyle}>{"*Placeholder*"}</Box>
                }
                {...a11yProps(2)}
              />
            </Tabs>
          </Paper>
          <SwipeableViews
            className={classes.swipeableView}
            axis={"x"}
            index={tabValueStats}
            onChangeIndex={(index) => {
              setTabValueStats(index);
            }}
            containerStyle={{ width: "100%", height: "100%" }}
            slideStyle={{ width: "100%", height: "100%" }}
          >
            <TabPanel value={tabValueStats} index={0}>
              <div style={{ cursor: "default", padding: "0 20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Tooltip
                    placement="top"
                    title={
                      <Typography
                        style={{ fontSize: "16px", cursor: "default" }}
                      >
                        {selectedAssetsOperator.length > 0
                          ? selectedAssetsOperator.join(", ")
                          : "Choose some assets"}
                      </Typography>
                    }
                  >
                    <FormControl
                      sx={{ m: 1, width: 200, margin: "4px 20px 0 0" }}
                    >
                      <InputLabel>Assets</InputLabel>
                      <Select
                        multiple
                        value={selectedAssetsOperator}
                        onChange={(
                          event: SelectChangeEvent<
                            typeof selectedAssetsOperator
                          >
                        ) => {
                          const {
                            target: { value },
                          } = event;
                          setSelectedAssetsOperator(
                            typeof value === "string" ? value.split(",") : value
                          );
                        }}
                        input={<OutlinedInput label="Assets" />}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 48 * 4.5 + 8,
                              width: 200,
                            },
                          },
                        }}
                      >
                        {(userDataRedux?.assets ?? []).map((name) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox
                              checked={
                                selectedAssetsOperator.indexOf(name) > -1
                              }
                            />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Tooltip>

                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={checkboxDateAssetOperator}
                        onChange={(event) => {
                          setCheckboxDateAssetOperator(event.target.checked);
                        }}
                      />
                    }
                    labelPlacement="start"
                    label={
                      <Typography variant="body1" style={{ fontSize: "14px" }}>
                        {"Single Date"}
                      </Typography>
                    }
                    style={{ padding: "4px 30px 0 0" }}
                  />

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      format="MM/DD/YYYY"
                      label="Start"
                      value={dayjs(startDateAssetOperator)}
                      onChange={(date) => {
                        setStartDateAssetOperator(
                          date ? date.toDate() : new Date()
                        );
                      }}
                      sx={{
                        width: "150px",
                        marginTop: "16px",
                        paddingBottom: "8px",
                      }}
                    />
                    <Typography
                      variant="body1"
                      component={"span"}
                      style={{ padding: "10px 20px 0 20px" }}
                    >
                      {"- to -"}
                    </Typography>
                    <DatePicker
                      format="MM/DD/YYYY"
                      label="End"
                      value={dayjs(endDateAssetOperator)}
                      onChange={(date) => {
                        setEndDateAssetOperator(
                          date ? date.toDate() : new Date()
                        );
                      }}
                      sx={{
                        width: "150px",
                        marginTop: "16px",
                        paddingBottom: "8px",
                      }}
                      disabled={checkboxDateAssetOperator}
                    />
                  </LocalizationProvider>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(event) => {
                      loadStatsAssetOperator();
                    }}
                    style={{ marginLeft: "50px" }}
                  >
                    GET
                  </Button>
                </div>

                <Paper style={{ display: "flex" }}>
                  <Paper
                    style={{
                      display: filterPanelOpen ? "flex" : "none",
                    }}
                  >
                    <div style={{ width: 260, textAlign: "center" }}>
                      <IconButton
                        aria-label="Close"
                        style={{
                          color: filterPanelCloseHoverState
                            ? "rgba(0, 0, 0, 0.8)"
                            : "rgba(0, 0, 0, 0.3)",
                          position: "absolute",
                          left: 240,
                        }}
                        onMouseEnter={() => {
                          setFilterPanelCloseHoverState(true);
                        }}
                        onMouseLeave={() => {
                          setFilterPanelCloseHoverState(false);
                        }}
                        onClick={() => {
                          setFilterPanelOpen((value) => !value);
                        }}
                      >
                        <Close />
                      </IconButton>
                      <Typography
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          margin: "10px 0 30px 0",
                        }}
                      >
                        {"FILTERS"}
                      </Typography>
                      <div>
                        <FormControl>
                          <RadioGroup
                            sx={{ gap: 0 }}
                            defaultValue="AllOperators"
                            name="radio-buttons-group"
                            value={filtersAssetOperatorRadio}
                            onChange={(event) => {
                              const radioValue = (
                                event.target as HTMLInputElement
                              ).value;
                              setFiltersAssetOperatorRadio(radioValue);
                              setFiltersAssetOperator({
                                ...filtersAssetOperator,
                                operators: [],
                              });
                            }}
                          >
                            <FormControlLabel
                              value="AllOperators"
                              control={<Radio />}
                              label="All Operators"
                              style={{ height: "16px" }}
                            />
                            <FormControlLabel
                              value="MyTeam"
                              control={<Radio />}
                              label="My Team"
                            />
                          </RadioGroup>
                        </FormControl>
                        <Tooltip
                          placement="top"
                          title={
                            <Typography
                              style={{ fontSize: "16px", cursor: "default" }}
                            >
                              {filtersAssetOperator.operators.length ===
                              teamGentexRedux?.length
                                ? "My Entire Team"
                                : filtersAssetOperator.operators.length > 0
                                ? filtersAssetOperator.operators.join(", ")
                                : "Choose some operators"}
                            </Typography>
                          }
                        >
                          <FormControl
                            sx={{ m: 1, width: 220, position: "sticky" }}
                          >
                            <InputLabel>Operators</InputLabel>
                            <Select
                              multiple={true}
                              value={filtersAssetOperator.operators}
                              onChange={(
                                event: SelectChangeEvent<
                                  typeof filtersAssetOperator.operators
                                >
                              ) => {
                                const {
                                  target: { value },
                                } = event;
                                setFiltersAssetOperator({
                                  ...filtersAssetOperator,
                                  operators:
                                    typeof value === "string"
                                      ? value.split(",")
                                      : value,
                                });
                              }}
                              input={<OutlinedInput label="Operators" />}
                              renderValue={(selected) => selected.join(", ")}
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 240,
                                    width: 220,
                                  },
                                },
                              }}
                            >
                              {filterOperatorUserInfo.map((user, i) => {
                                return (
                                  <MenuItem
                                    key={i}
                                    value={user.employeeNumber}
                                    disableGutters={true}
                                  >
                                    <Checkbox
                                      checked={
                                        filtersAssetOperator.operators.indexOf(
                                          user.employeeNumber
                                        ) > -1
                                      }
                                    />
                                    <UserDisplayHover userInfo={user} />
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </Tooltip>
                      </div>
                      <div style={{ marginTop: "40px" }}>
                        <Tooltip
                          placement="top"
                          title={
                            <Typography
                              style={{ fontSize: "16px", cursor: "default" }}
                            >
                              {filtersAssetOperator.assets.length > 0
                                ? filtersAssetOperator.assets.join(", ")
                                : "Choose some assets"}
                            </Typography>
                          }
                        >
                          <FormControl
                            sx={{ m: 1, width: 220, position: "sticky" }}
                          >
                            <InputLabel>Assets</InputLabel>
                            <Select
                              multiple={true}
                              value={filtersAssetOperator.assets}
                              onChange={(
                                event: SelectChangeEvent<
                                  typeof filtersAssetOperator.assets
                                >
                              ) => {
                                const {
                                  target: { value },
                                } = event;
                                setFiltersAssetOperator({
                                  ...filtersAssetOperator,
                                  assets:
                                    typeof value === "string"
                                      ? value.split(",")
                                      : value,
                                });
                              }}
                              input={<OutlinedInput label="Assets" />}
                              renderValue={(selected) => selected.join(", ")}
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 240,
                                    width: 220,
                                  },
                                },
                              }}
                            >
                              {rowsAssetOperator
                                .map((x) => x.Asset)
                                .filter((v, i, a) => a.indexOf(v) === i)
                                .sort((a, b) => a.localeCompare(b))
                                .map((name) => (
                                  <MenuItem key={name} value={name}>
                                    <Checkbox
                                      checked={
                                        filtersAssetOperator.assets.indexOf(
                                          name
                                        ) > -1
                                      }
                                    />
                                    <ListItemText primary={name} />
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Tooltip>
                      </div>
                      <div style={{ marginTop: "40px" }}>
                        <Tooltip
                          placement="top"
                          title={
                            <Typography
                              style={{ fontSize: "16px", cursor: "default" }}
                            >
                              {filtersAssetOperator.parts.length > 0
                                ? filtersAssetOperator.parts.join(", ")
                                : "Choose some parts"}
                            </Typography>
                          }
                        >
                          <FormControl
                            sx={{ m: 1, width: 220, position: "sticky" }}
                          >
                            <InputLabel>Parts</InputLabel>
                            <Select
                              multiple={true}
                              value={filtersAssetOperator.parts}
                              onChange={(
                                event: SelectChangeEvent<
                                  typeof filtersAssetOperator.parts
                                >
                              ) => {
                                const {
                                  target: { value },
                                } = event;
                                setFiltersAssetOperator({
                                  ...filtersAssetOperator,
                                  parts:
                                    typeof value === "string"
                                      ? value.split(",")
                                      : value,
                                });
                              }}
                              input={<OutlinedInput label="Parts" />}
                              renderValue={(selected) => selected.join(", ")}
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 240,
                                    width: 220,
                                  },
                                },
                              }}
                            >
                              {rowsAssetOperator
                                .map((x) => x.PartNumber)
                                .filter((v, i, a) => a.indexOf(v) === i)
                                .sort((a, b) => a.localeCompare(b))
                                .map((name) => (
                                  <MenuItem key={name} value={name}>
                                    <Checkbox
                                      checked={
                                        filtersAssetOperator.parts.indexOf(
                                          name
                                        ) > -1
                                      }
                                    />
                                    <ListItemText primary={name} />
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Tooltip>
                      </div>
                    </div>
                  </Paper>

                  <div
                    style={{
                      height: "calc(100vh - 200px)",
                      //width: "calc(100% - 216px)",
                      width: filterPanelOpen ? "calc(100% - 260px)" : "100%",
                    }}
                  >
                    <CustomDataGrid
                      columns={columnsAssetOperator}
                      rows={rowsFilteredAssetOperator}
                      columnBuffer={14}
                      pagination={true}
                      rowHeight={44}
                      loading={loadingAssetOperator}
                      pageSizeOptions={[10, 25, 50, 100]}
                      paginationModel={paginationModelAssetOperator}
                      onPaginationModelChange={(model) => {
                        setPaginationModelAssetOperator(model);
                      }}
                      rowCount={rowsFilteredAssetOperator.length}
                      checkboxSelection={true}
                      disableRowSelectionOnClick={true}
                      slots={{
                        toolbar: CustomToolbarAssetOperator,
                        //toolbar: GridToolbar,
                        footer: CustomFooterAssetOperator,
                      }}
                      slotProps={{
                        toolbar: {
                          printOptions: { disableToolbarButton: true },
                        },
                      }}
                      columnVisibilityModel={columnVisibilityModelAssetOperator}
                      onColumnVisibilityModelChange={(model) => {
                        setColumnVisibilityModelAssetOperator(model);
                      }}
                      rowSelectionModel={rowSelectionModelAssetOperator}
                      onRowSelectionModelChange={(model) => {
                        setRowSelectionModelAssetOperator(model);
                      }}
                      onCellClick={(params) => {
                        if (params.field !== "Operator") {
                          let newSelections = [
                            ...(rowSelectionModelAssetOperator as number[]),
                          ];
                          const rowId = params.id as number;
                          if (newSelections.includes(rowId)) {
                            const index = newSelections.indexOf(rowId);
                            if (index > -1) newSelections.splice(index, 1);
                          } else newSelections.push(rowId);
                          setRowSelectionModelAssetOperator(
                            newSelections as GridInputRowSelectionModel
                          );
                        }
                      }}
                    />
                  </div>
                </Paper>
              </div>
            </TabPanel>
          </SwipeableViews>
        </div>
      </Paper>
    </div>
  );
};
