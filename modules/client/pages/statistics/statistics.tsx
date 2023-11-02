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
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
  TextField,
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
import * as dayjs from "dayjs";
import { dateTimeToString, getHHMMSS } from "client/utilities/date-util";
import { UserDisplayHover } from "client/components/user-display/UserDisplayHover";
import { getProcessDataExportRange } from "client/utilities/redis";
import { useSelector } from "react-redux";
import { UserDisplayClick } from "client/components/user-display/UserDisplayClick";
import { Close, FilterList } from "@mui/icons-material";
import { ProcessDataExport, ProcessDataRawData } from "client/utilities/types";
import {
  getFinalProcessDataPart,
  getFinalProcessDataPartTotals,
} from "client/utilities/process-data";
import { getEmployeeInfoGentex } from "client/utilities/mes";
import { enqueueSnackbar } from "notistack";
import { DateTimeHover } from "./DateTimeHover";
import { Selectors } from "client/redux/selectors";
import { UserInformation } from "core/schemas/user-information.gen";
import { getUserInformation } from "client/user-utils";
import {
  useGetComboRowsDateRangeLazyQuery,
  useGetProcessRowsDateRangeLazyQuery,
} from "client/graphql/types.gen";
import {
  StatsDataOperatorRow,
  getFinalDataOperator,
  getFinalProcessDataOperatorTotals,
  getStatsDataOperatorRows,
} from "client/utilities/webdc-data";
import { SnRow } from "records/combodata";
import { AssetInfoHover } from "./AssetInfoHover";
import { AssetInfo } from "rest-endpoints/mes-bi/mes-bi";
import { groupBy } from "client/utilities/array-util";

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

let cancelLoadingAssetOperator = false;
let cancelLoadingAssetPart = false;

export const Statistics: React.FC<{}> = () => {
  document.title = "Stats | EA App";

  const classes = useStyles();

  const comboPartData = useSelector(Selectors.ComboData.partData);
  const comboAssetData = useSelector(Selectors.ComboData.assetData);
  const processPartData = useSelector(Selectors.ProcessData.partData);
  const processAssetData = useSelector(Selectors.ProcessData.assetData);

  const assetBiData = useSelector(Selectors.App.assetList);
  const cycleTimeInfo = useSelector(Selectors.App.cycleTimeInfo);
  const employeeDirectory = useSelector(Selectors.App.employeeActiveDirectory);
  const userAppData = useSelector(Selectors.App.currentUserAppData);

  const [comboDataQuery, comboDataResult] = useGetComboRowsDateRangeLazyQuery();
  const [processDataQuery, processDataResult] =
    useGetProcessRowsDateRangeLazyQuery();

  const [userTeamInfo, setUserTeamInfo] = React.useState<UserInformation[]>([]);

  React.useEffect(() => {
    let teamInfo = employeeDirectory.filter((x) =>
      userAppData.operators.includes(x.employeeId)
    );
    teamInfo = teamInfo.sort((a, b) => a.username.localeCompare(b.username));
    setUserTeamInfo(teamInfo);
  }, [userAppData, employeeDirectory]);

  const [tabValueStats, setTabValueStats] = React.useState(0);

  const [selectionAssetsRadio, setSelectionAssetsRadio] =
    React.useState("AllAssets");

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
  const [selectedAssetsOperator, setSelectedAssetsOperator] =
    React.useState<string>("");
  const [checkboxDateAssetOperator, setCheckboxDateAssetOperator] =
    React.useState(false);
  const [startDateAssetOperator, setStartDateAssetOperator] = React.useState(
    new Date()
  );
  const [endDateAssetOperator, setEndDateAssetOperator] = React.useState(
    new Date()
  );

  const [rowsDataOperator, setRowsDataOperator] = React.useState<
    StatsDataOperatorRow[]
  >([]);
  const [rowsFilteredDataOperator, setRowsFilteredDataOperator] =
    React.useState<StatsDataOperatorRow[]>([]);
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
  const [filterPanelOpenAssetOperator, setFilterPanelOpenAssetOperator] =
    React.useState(false);
  const [
    filterPanelCloseHoverStateAssetOperator,
    setFilterPanelCloseHoverStateAssetOperator,
  ] = React.useState(false);

  const loadDataAllAssets = async () => {
    let startDate = new Date(startDateAssetOperator);
    let endDate = new Date(endDateAssetOperator);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);
    if (checkboxDateAssetOperator) endDate = new Date(startDate);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(999);
    const start = dateTimeToString(startDate);
    const end = dateTimeToString(endDate);
    const comboAssets = comboAssetData.map((x) => x.AssetID);
    const processAssets = processAssetData.map((x) => x.AssetID);
    void comboDataQuery({
      variables: {
        start: start,
        end: end,
        assetIds: comboAssets,
      },
    });
    void processDataQuery({
      variables: {
        start: start,
        end: end,
        assetIds: processAssets,
      },
    });
  };

  const loadDataUserAssets = async () => {
    let startDate = new Date(startDateAssetOperator);
    let endDate = new Date(endDateAssetOperator);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);
    if (checkboxDateAssetOperator) endDate = new Date(startDate);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(999);
    const start = dateTimeToString(startDate);
    const end = dateTimeToString(endDate);
    const comboAssets = comboAssetData
      .filter((x) => userAppData.assetList.includes(x.Asset))
      .map((x) => x.AssetID);
    const processAssets = processAssetData
      .filter((x) => userAppData.assetList.includes(x.Asset))
      .map((x) => x.AssetID);
    void comboDataQuery({
      variables: {
        start: start,
        end: end,
        assetIds: comboAssets,
      },
    });
    void processDataQuery({
      variables: {
        start: start,
        end: end,
        assetIds: processAssets,
      },
    });
  };

  const loadDataUserTeam = async () => {
    let startDate = new Date(startDateAssetOperator);
    let endDate = new Date(endDateAssetOperator);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);
    if (checkboxDateAssetOperator) endDate = new Date(startDate);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(999);
    const start = dateTimeToString(startDate);
    const end = dateTimeToString(endDate);
    const operatorIds = userAppData.operators.map((x) => +x);
    void comboDataQuery({
      variables: {
        start: start,
        end: end,
        operatorIds: operatorIds,
      },
    });
    void processDataQuery({
      variables: {
        start: start,
        end: end,
        operatorIds: operatorIds,
      },
    });
  };

  React.useEffect(() => {
    void (async () => {
      if (comboDataResult.called && processDataResult.called) {
        if (comboDataResult.loading && processDataResult.loading) {
          setLoadingAssetOperator(true);
          setLoadingProgressAssetOperator(10);
          enqueueSnackbar("Loading data...", {
            variant: "info",
            autoHideDuration: 3000,
          });
        } else if (comboDataResult.error || processDataResult.error) {
          setLoadingAssetOperator(false);
          setLoadingProgressAssetOperator(0);
          enqueueSnackbar("Error querying data!", {
            variant: "error",
            autoHideDuration: 3000,
          });
        } else if (
          comboDataResult.data &&
          comboDataResult.data.comboRowsDateRange &&
          processDataResult.data &&
          processDataResult.data.processRowsDateRange
        ) {
          setLoadingProgressAssetOperator(20);
          let progress = 20;

          const comboRows = comboDataResult.data.comboRowsDateRange;
          const processRows = processDataResult.data.processRowsDateRange;

          const comboTotals = getStatsDataOperatorRows(
            comboRows,
            comboPartData,
            comboAssetData,
            cycleTimeInfo,
            assetBiData
          );
          const processTotals = getStatsDataOperatorRows(
            processRows,
            processPartData,
            processAssetData,
            cycleTimeInfo,
            assetBiData
          );

          let totals = [...comboTotals, ...processTotals];

          // const totals = [...comboTotals, ...processTotals];
          // let totals = comboTotals.concat(processTotals);
          totals.forEach((x, i) => (x.id = i));
          setRowSelectionModelAssetOperator([]);
          setRowsDataOperator(totals);
          loadAllEmployeeInfo(totals);
          setLoadingProgressAssetOperator(100);
          setLoadingAssetOperator(false);
          cancelLoadingAssetOperator = false;
          setCancelingLoadingAssetOperator(false);
          let opList = [...totals]
            .map((x) => x.Operator)
            .filter((v, i, a) => a.indexOf(v) === i);
          let partList = [...totals]
            .map((x) => x.PartNumber)
            .filter((v, i, a) => a.indexOf(v) === i);
          let assetList = [...totals]
            .map((x) => x.Asset)
            .filter((v, i, a) => a.indexOf(v) === i);
          const opFilter = opList.filter((op) =>
            filtersAssetOperator.operators.includes(op)
          );
          const partFilter = partList.filter((part) =>
            filtersAssetOperator.parts.includes(part)
          );
          const assetFilter = assetList.filter((asset) =>
            filtersAssetOperator.assets.includes(asset)
          );
          setFiltersAssetOperator({
            operators: opFilter,
            parts: partFilter,
            assets: assetFilter,
          });

          setLoadingAssetOperator(false);
          setLoadingProgressAssetOperator(0);
          enqueueSnackbar("Loaded data successfully!", {
            variant: "success",
            autoHideDuration: 3000,
          });
        }
      }
    })();
  }, [comboDataResult, processDataResult]);

  // React.useEffect(() => {
  //   void (async () => {
  //     if (comboDataResult.called || processDataResult.called) {
  //       if (comboDataResult.loading || processDataResult.loading) {
  //         setLoadingAssetOperator(true);
  //         setLoadingProgressAssetOperator(10);
  //         enqueueSnackbar("Loading data...", {
  //           variant: "info",
  //           autoHideDuration: 3000,
  //         });
  //       } else if (comboDataResult.error || processDataResult.error) {
  //         setLoadingAssetOperator(false);
  //         setLoadingProgressAssetOperator(0);
  //         enqueueSnackbar("Error querying data!", {
  //           variant: "error",
  //           autoHideDuration: 3000,
  //         });
  //       } else if (
  //         comboDataResult.data &&
  //         comboDataResult.data.comboRowsDateRange
  //       ) {
  //         setLoadingProgressAssetOperator(20);
  //         let progress = 20;

  //         const comboRows = comboDataResult.data.comboRowsDateRange;
  //         const processRows =
  //           processDataResult.data?.processRowsDateRange ?? [];
  //         let totals: ProcessDataOperatorTotals[] = [];
  //         let groupComboRows = groupBy(comboRows, "AssetID");
  //         const step = 80 / Object.keys(groupComboRows).length;
  //         let cycleTimeList: { part: string; asset: string; cycle: number }[] =
  //           [];
  //         for (const key of Object.keys(groupComboRows)) {
  //           const rows: SnRow[] = groupComboRows[key];
  //           if (rows) {
  //             const comboOp = getFinalDataOperator(
  //               comboRows,
  //               comboPartData,
  //               comboAssetData
  //             );
  //             // const processOp = getFinalDataOperator(
  //             //   processRows,
  //             //   processPartData,
  //             //   processAssetData
  //             // );
  //             const comboTotals = await getFinalProcessDataOperatorTotals(
  //               comboOp,
  //               userDataRedux.orgCode,
  //               cycleTimeList,
  //               cycleTimeInfo
  //             );
  //             // const processTotals = await getFinalProcessDataOperatorTotals(
  //             //   processOp,
  //             //   userDataRedux.orgCode
  //             // );
  //             totals = totals.concat(comboTotals);
  //             progress += step;
  //             setLoadingProgressAssetOperator(progress);
  //           }
  //         }

  //         // const totals = [...comboTotals, ...processTotals];
  //         // let totals = comboTotals.concat(processTotals);
  //         totals.forEach((x, i) => (x.id = i));
  //         setRowSelectionModelAssetOperator([]);
  //         setRowsAssetOperator(totals);
  //         loadAllEmployeeInfo(totals);
  //         setLoadingProgressAssetOperator(100);
  //         setLoadingAssetOperator(false);
  //         cancelLoadingAssetOperator = false;
  //         setCancelingLoadingAssetOperator(false);
  //         let opList = [...totals]
  //           .map((x) => x.Operator)
  //           .filter((v, i, a) => a.indexOf(v) === i);
  //         let partList = [...totals]
  //           .map((x) => x.PartNumber)
  //           .filter((v, i, a) => a.indexOf(v) === i);
  //         let assetList = [...totals]
  //           .map((x) => x.Asset)
  //           .filter((v, i, a) => a.indexOf(v) === i);
  //         const opFilter = opList.filter((op) =>
  //           filtersAssetOperator.operators.includes(op)
  //         );
  //         const partFilter = partList.filter((part) =>
  //           filtersAssetOperator.parts.includes(part)
  //         );
  //         const assetFilter = assetList.filter((asset) =>
  //           filtersAssetOperator.assets.includes(asset)
  //         );
  //         setFiltersAssetOperator({
  //           operators: opFilter,
  //           parts: partFilter,
  //           assets: assetFilter,
  //         });

  //         setLoadingAssetOperator(false);
  //         setLoadingProgressAssetOperator(0);
  //         enqueueSnackbar("Loaded data successfully!", {
  //           variant: "success",
  //           autoHideDuration: 3000,
  //         });
  //       }
  //     }
  //   })();
  // }, [comboDataResult, processDataResult]);

  const loadAllEmployeeInfo = (processData: StatsDataOperatorRow[]) => {
    let allInfo: UserInformation[] = [];
    const ids = processData
      .map((x) => x.Operator)
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => a.localeCompare(b));
    allInfo = employeeDirectory.filter((x) => ids.includes(x.employeeId));
    setOperatorEmployeeInfo(allInfo);
  };

  React.useEffect(() => {
    setRowSelectionModelAssetOperator([]);
    let rows = [...rowsDataOperator];
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
      const myTeam = [...userTeamInfo].map((x) => x.employeeId);
      rows = rows.filter((x) => myTeam.includes(x.Operator));
    }

    // if (selectionAssetsRadio === "MyAssets") {
    //   rows = rows.filter((x) => userDataRedux.assetList.includes(x.Asset));
    // }

    if (filtersAssetOperatorRadio === "AllOperators") {
      setFilterOperatorUserInfo(operatorEmployeeInfo);
    } else {
      setFilterOperatorUserInfo(userTeamInfo);
    }

    setRowsFilteredDataOperator(rows);
    // setNewRows(rows);
  }, [
    rowsDataOperator,
    filtersAssetOperator,
    filtersAssetOperatorRadio,
    userTeamInfo,
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
        const row = rowsDataOperator[id];
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
  }, [rowSelectionModelAssetOperator, rowsDataOperator]);

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
            <DateTimeHover dateTime={cellValue.value as Date} />
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
            <DateTimeHover dateTime={cellValue.value as Date} />
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
        // return <div className={classes.cellStyle}>{cellValue.value}</div>;
        const foundAsset: AssetInfo = assetBiData.find(
          (x) => x.assetName === cellValue.value
        ) ?? {
          assetName: "",
          serial: "",
          model: "",
          orgCode: "0",
          line: "-",
          dateCreated: "",
          notes: "",
          reportGroupID: "",
          excludeFromHealth: false,
          autoUpdate: false,
          recordLastUpdated: "",
          updatedBy: "",
        };
        return (
          <div className={classes.cellStyle}>
            <AssetInfoHover assetInfo={foundAsset} />
          </div>
        );
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
        // return <UserDisplayClick userId={id} />;
        const foundIndex = operatorEmployeeInfo.findIndex((userInfo) => {
          return userInfo.employeeId === id;
        });

        return foundIndex > -1 ? (
          <UserDisplayClick userInfo={operatorEmployeeInfo[foundIndex]} />
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
                value >= 95
                  ? "rgb(0, 200, 0)"
                  : value >= 85
                  ? "orange"
                  : value > 0
                  ? "red"
                  : "#DFDFDF",
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

  const CustomFooterAssetOperator = () => {
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setShowRawDataAssetOperator(!showRawDataAssetOperator);
          }}
        >
          {showRawDataAssetOperator ? "Close Raw Data" : "View Raw Data"}
        </Button>

        <GridFooter style={{ border: "none" }} />
      </GridFooterContainer>
    );
  };

  const CustomToolbarAssetOperator = () => {
    return (
      <GridToolbarContainer>
        <Button
          variant="text"
          color="primary"
          sx={{ padding: "4px" }}
          onClick={() => {
            setFilterPanelOpenAssetOperator((previousValue) => !previousValue);
          }}
        >
          <FilterList style={{ marginRight: "8px" }} />
          <Typography
            style={{ fontSize: "14px", marginBottom: "2px", fontWeight: "500" }}
          >
            {"Filters"}
          </Typography>
        </Button>
        <GridToolbarColumnsButton />

        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  };

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
                label={
                  <Box className={classes.tabStyle}>{"Operator Stats"}</Box>
                }
                {...tabProps(0)}
              />
              <Tab
                label={<Box className={classes.tabStyle}>{"Part Stats"}</Box>}
                {...tabProps(1)}
              />
              <Tab
                label={
                  <Box className={classes.tabStyle}>{"*Placeholder*"}</Box>
                }
                {...tabProps(2)}
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
                        {selectedAssetsOperator
                          ? selectedAssetsOperator
                          : "Choose where to pull data from"}
                      </Typography>
                    }
                  >
                    <FormControl
                      sx={{ m: 1, width: 200, margin: "4px 20px 0 0" }}
                    >
                      <InputLabel>Choose...</InputLabel>
                      <Select
                        value={selectedAssetsOperator}
                        onChange={(event: SelectChangeEvent) => {
                          setSelectedAssetsOperator(
                            event.target.value as string
                          );
                        }}
                        input={<OutlinedInput label="Choose..." />}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 48 * 4.5 + 8,
                              width: 200,
                            },
                          },
                        }}
                      >
                        <MenuItem value={"All Assets"}>All Assets</MenuItem>
                        <MenuItem value={"My Assets"}>My Assets</MenuItem>
                        <MenuItem value={"My Team"}>My Team</MenuItem>
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

                  {!loadingAssetOperator ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        if (selectedAssetsOperator === "All Assets") {
                          void loadDataAllAssets();
                        } else if (selectedAssetsOperator === "My Assets") {
                          void loadDataUserAssets();
                        } else if (selectedAssetsOperator === "My Team") {
                          void loadDataUserTeam();
                        }

                        // setLoadingAssetOperator(true);
                      }}
                      style={{ marginLeft: "50px" }}
                    >
                      GET
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color={!cancelLoadingAssetOperator ? "error" : "warning"}
                      onClick={() => {
                        cancelLoadingAssetOperator = true;
                        setCancelingLoadingAssetOperator(true);
                      }}
                      style={{ marginLeft: "50px" }}
                    >
                      {!cancelingLoadingAssetOperator
                        ? "CANCEL"
                        : "CANCELING..."}
                    </Button>
                  )}
                </div>

                {loadingAssetOperator && (
                  <Box sx={{ width: "100%" }}>
                    <LinearProgress
                      variant="determinate"
                      value={loadingProgressAssetOperator}
                    />
                  </Box>
                )}

                <Paper style={{ display: "flex" }}>
                  <Collapse
                    orientation="horizontal"
                    in={filterPanelOpenAssetOperator}
                  >
                    <Paper
                      style={{
                        // display: filterPanelOpen ? "flex" : "none",
                        display: "flex",
                        height: "100%",
                      }}
                    >
                      <div style={{ width: 260, textAlign: "center" }}>
                        <IconButton
                          aria-label="Close"
                          style={{
                            color: filterPanelCloseHoverStateAssetOperator
                              ? "rgba(0, 0, 0, 0.8)"
                              : "rgba(0, 0, 0, 0.3)",
                            position: "sticky",
                            left: 240,
                          }}
                          onMouseEnter={() => {
                            setFilterPanelCloseHoverStateAssetOperator(true);
                          }}
                          onMouseLeave={() => {
                            setFilterPanelCloseHoverStateAssetOperator(false);
                          }}
                          onClick={() => {
                            setFilterPanelOpenAssetOperator((value) => !value);
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
                                control={<Radio size="small" />}
                                label="All Operators"
                                style={{ height: "24px" }}
                              />
                              <FormControlLabel
                                value="MyTeam"
                                control={<Radio size="small" />}
                                label="My Team"
                                style={{ height: "24px" }}
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
                                userTeamInfo.length
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
                                {filterOperatorUserInfo
                                  .sort(
                                    (a, b) =>
                                      a.firstName.localeCompare(b.firstName) ||
                                      a.lastName.localeCompare(b.lastName)
                                  )
                                  .map((user, i) => {
                                    return (
                                      <MenuItem
                                        key={i}
                                        value={user.employeeId}
                                        disableGutters={true}
                                      >
                                        <Checkbox
                                          checked={
                                            filtersAssetOperator.operators.indexOf(
                                              user.employeeId
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
                        <div style={{ marginTop: "20px" }}>
                          <FormControl>
                            <RadioGroup
                              sx={{ gap: 0 }}
                              defaultValue="AllOperators"
                              name="radio-buttons-group"
                              value={selectionAssetsRadio}
                              onChange={(event) => {
                                const radioValue = (
                                  event.target as HTMLInputElement
                                ).value;
                                setSelectionAssetsRadio(radioValue);
                                // setSelectedAssetsOperator([]);
                                // setSelectionAssets({
                                //   ...selectionAssets,
                                //   assets: [],
                                // });
                              }}
                            >
                              <FormControlLabel
                                value="AllAssets"
                                control={<Radio size="small" />}
                                label="All Assets"
                                style={{ height: "24px" }}
                              />
                              <FormControlLabel
                                value="MyAssets"
                                control={<Radio size="small" />}
                                label="My Assets"
                                style={{ height: "24px" }}
                              />
                            </RadioGroup>
                          </FormControl>
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
                                {rowsDataOperator
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
                        <div style={{ marginTop: "60px" }}>
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
                                {rowsDataOperator
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
                  </Collapse>

                  <Collapse
                    orientation="horizontal"
                    in={!filterPanelOpenAssetOperator}
                    collapsedSize={"calc(100% - 260px)"}
                  >
                    <div
                      style={{
                        height: "calc(100vh - 200px)",
                        width: !filterPanelOpenAssetOperator
                          ? !showRawDataAssetOperator
                            ? "calc(100vw - 38px)"
                            : "calc(100vw - 56px)"
                          : !showRawDataAssetOperator
                          ? "calc(100vw - 298px)"
                          : "calc(100vw - 314px)",
                      }}
                    >
                      <CustomDataGrid
                        columns={columnsAssetOperator}
                        rows={rowsFilteredDataOperator}
                        columnBuffer={14}
                        pagination={true}
                        rowHeight={44}
                        loading={loadingAssetOperator}
                        pageSizeOptions={[10, 25, 50, 100]}
                        paginationModel={paginationModelAssetOperator}
                        onPaginationModelChange={(model) => {
                          setPaginationModelAssetOperator(model);
                        }}
                        // rowCount={rowsFilteredAssetOperator.length}
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
                        columnVisibilityModel={
                          columnVisibilityModelAssetOperator
                        }
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
                  </Collapse>
                </Paper>
                <Collapse orientation="vertical" in={showRawDataAssetOperator}>
                  <Paper style={{ marginTop: "8px" }}>
                    {/* <DataGridInfinite rows={processDataAssetOperator} /> */}
                  </Paper>
                </Collapse>
              </div>
            </TabPanel>
            <TabPanel value={tabValueStats} index={1}>
              <div style={{ cursor: "default", padding: "0 20px" }}></div>
            </TabPanel>
          </SwipeableViews>
        </div>
      </Paper>
    </div>
  );
};
