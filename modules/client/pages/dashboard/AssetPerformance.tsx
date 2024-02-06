import * as React from "react";
import {
  Box,
  Card,
  Divider,
  FormControlLabel,
  Grid,
  lighten,
  Paper,
  Popover,
  Switch,
  Typography,
} from "@mui/material";
import { makeStyles, styled, withStyles } from "@mui/styles";
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dateTimeToString, getHHMMSS } from "../../utilities/date-util";
import { UserInformation } from "core/schemas/user-information.gen";
import { OperatorDisplayDashboard } from "client/components/info-display/OperatorDisplayDashboard";
import { StatsDataOperatorRow } from "client/utilities/webdc-data";
import { GentexBlue } from "client/styles/app-theme";
import { InformationCard } from "client/components/dashboard/InformationCard";
import { LeaderboardOperatorDisplay } from "client/components/dashboard/LeaderboardOperatorDisplay";
import { AssetInfo } from "rest-endpoints/mes-bi/mes-bi";
import { DashboardDataOperator } from "core/schemas/dashboard-data-operator.gen";
import { DashboardGraphOperator } from "core/schemas/dashboard-graph-operator.gen";
import { SnRow } from "records/combodata";
import { AssetInfoHover } from "client/components/info-display/AssetInfoHover";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import SwipeableViews from "react-swipeable-views";
import { useSelector } from "react-redux";
import { Selectors } from "client/redux/selectors";
import { UserDisplayClick } from "client/components/info-display/UserDisplayClick";
import { ViewTestResult } from "client/components/dashboard/ViewTestResult";

const useStyles = makeStyles(() => ({
  dashboardPage: {
    position: "absolute",
    width: "100vw",
    height: "100%",
  },
  swipeableView: {
    height: "calc(100vh - 568px)",
    // height: "100%",
    width: "100%",
  },
  cellStyle: {
    marginRight: "4px",
    width: "100%",
    height: "100%",
    alignItems: "center",
    color: "black",
    fontSize: "12px",
    fontFamily: "inherit",
    fontWeight: "500",
    display: "flex",
  },
  assetTitle: {
    width: "100%",
    height: "100%",
    flexGrow: 1,
    textAlign: "center",
  },
  totalPartNumbers: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  totalPartNumbersInfo: {
    display: "flex",
    alignItems: "center",
  },
  totalPartNumbersDetails: {
    flexGrow: 1,
    textAlign: "left",
    cursor: "default",
    paddingLeft: "10px",
  },
  cycleTimer: {
    backgroundColor: "transparent",
    transition: "background-color 0.5s",
  },
  cycleGoal: {
    backgroundColor: "transparent",
    transition: "background-color 1s",
  },
  cycleAverage: {
    backgroundColor: "transparent",
    transition: "background-color 1s",
  },
  cycleLast: {
    backgroundColor: "transparent",
    transition: "background-color 1s",
  },
  runTheory: {
    backgroundColor: "transparent",
    transition: "background-color 1s",
  },
  runActual: {
    backgroundColor: "transparent",
    transition: "background-color 1s",
  },
  runVariance: {
    backgroundColor: "transparent",
    transition: "background-color 1s",
  },
  pphTarget: {
    backgroundColor: "transparent",
    transition: "background-color 1s",
  },
  pphAverage: {
    backgroundColor: "transparent",
    transition: "background-color 1s",
  },
  efficiencyTotal: {
    backgroundColor: "transparent",
    transition: "background-color 1s",
  },
  efficiencyPart: {
    backgroundColor: "transparent",
    transition: "background-color 1s",
  },
  testCountPart: {
    backgroundColor: "transparent",
    transition: "background-color 1s",
  },
  testCountTotal: {
    backgroundColor: "transparent",
    transition: "background-color 1s",
  },
}));

const TooltipGraphCustom = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value =
      payload[0].value && !Number.isNaN(payload[0].value)
        ? Number(payload[0].value)
        : undefined;
    const stringValue = value
      ? (Math.round(value * 100) / 100).toFixed(2) + "%"
      : "-";
    return (
      <Card
        sx={{ width: "100%", textAlign: "center" }}
        style={{
          border: `1px solid #FFF`,
          backgroundColor: "#FFF",
        }}
      >
        <Box
          sx={{
            p: 2,
          }}
        >
          <Typography
            style={{
              alignSelf: "center",
              fontSize: "18px",
              fontWeight: "500",
              color: "#000",
            }}
          >
            {`${label}`}
          </Typography>
          <Typography
            style={{
              alignSelf: "center",
              fontSize: "18px",
              fontWeight: "600",
              color:
                value && value >= 95
                  ? "rgb(0, 200, 0)"
                  : value && value >= 85
                  ? "orange"
                  : value
                  ? "red"
                  : "#000",
            }}
          >
            {`${stringValue}`}
          </Typography>
        </Box>
      </Card>
    );
  }
  return null;
};

const CustomDataGrid = withStyles({
  root: {
    border: "none",
    "&.MuiDataGrid-root .MuiDataGrid-main": {
      overflow: "visible",
    },
    "&.MuiDataGrid-root .MuiDataGrid-columnHeaders": {
      top: "0px",
      position: "sticky",
      backgroundColor: "white",
      zIndex: 1,
    },
    "&.MuiDataGrid-root .MuiDataGrid-columnHeadersInner": {
      top: "0px",
      position: "sticky",
      backgroundColor: "white",
      zIndex: 1,
    },
    "&.MuiDataGrid-root .MuiDataGrid-columnHeaderTitleContainer": {
      // padding: 0,
      flex: "none",
    },
    "&.MuiDataGrid-root .MuiDataGrid-windowContainer": {
      display: "table-cell",
    },
    "&.MuiDataGrid-root .MuiDataGrid-cell": {
      // padding: 0,
    },
    "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
      outline: "none !important",
    },
    "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within": {
      outline: "none !important",
    },
  },
})(DataGrid);

const getBackgroundColor = (color: string) =>
  lighten(color, 0.5) + " !important";
const getHoverBackgroundColor = (color: string) =>
  lighten(color, 0.4) + " !important";
// const getHoverBackgroundColor = (color: string) => color;
const getSelectedBackgroundColor = (color: string) =>
  lighten(color, 0.3) + " !important";
const getSelectedHoverBackgroundColor = (color: string) =>
  lighten(color, 0.2) + " !important";

const DataGridStyled = styled(CustomDataGrid)(() => ({
  "& .test-rows--Good": {
    backgroundColor: getBackgroundColor("rgba(0, 200, 0, 1)"),
    "&:hover": {
      backgroundColor: getHoverBackgroundColor("rgba(0, 200, 0, 1)"),
    },
    "&.Mui-selected": {
      backgroundColor: getSelectedBackgroundColor("rgba(0, 200, 0, 1)"),
      "&:hover": {
        backgroundColor: getSelectedHoverBackgroundColor("rgba(0, 200, 0, 1)"),
      },
    },
  },
  "& .test-rows--Okay": {
    backgroundColor: getBackgroundColor("rgba(255, 165, 0, 1)"),
    "&:hover": {
      backgroundColor: getHoverBackgroundColor("rgba(255, 165, 0, 1)"),
    },
    "&.Mui-selected": {
      backgroundColor: getSelectedBackgroundColor("rgba(255, 165, 0, 1)"),
      "&:hover": {
        backgroundColor: getSelectedHoverBackgroundColor(
          "rgba(255, 165, 0, 1)"
        ),
      },
    },
  },
  "& .test-rows--Bad": {
    backgroundColor: getBackgroundColor("rgba(255, 0, 0, 1)"),
    "&:hover": {
      backgroundColor: getHoverBackgroundColor("rgba(255, 0, 0, 1)"),
    },
    "&.Mui-selected": {
      backgroundColor: getSelectedBackgroundColor("rgba(255, 0, 0, 1)"),
      "&:hover": {
        backgroundColor: getSelectedHoverBackgroundColor("rgba(255, 0, 0, 1)"),
      },
    },
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

export const AssetPerformance: React.FC<{
  assetName: string;
  assetInfo: AssetInfo;
  operator: UserInformation;
  rawTestData: SnRow[];
  operatorRows: StatsDataOperatorRow[];
  assetRows: StatsDataOperatorRow[];
  dashboardData: DashboardDataOperator;
  graphData: DashboardGraphOperator[];
}> = (props) => {
  const classes = useStyles();

  const employeeDirectory = useSelector(Selectors.App.employeeActiveDirectory);
  const comboPartData = useSelector(Selectors.ComboData.partData);
  const processPartData = useSelector(Selectors.ProcessData.partData);

  const [assetName, setAssetName] = React.useState(props.assetName);
  const [assetInformation, setAssetInformation] = React.useState(
    props.assetInfo
  );
  const [operator, setOperator] = React.useState(props.operator);
  const [rawTestData, setRawTestData] = React.useState(props.rawTestData);
  const [operatorRows, setOperatorRows] = React.useState(props.operatorRows);
  const [performanceRows, setPerformanceRows] = React.useState(props.assetRows);
  const [dashboardData, setDashboardData] = React.useState(props.dashboardData);
  const [graphData, setGraphData] = React.useState(props.graphData);

  const [anchorElParts, setAnchorElParts] = React.useState(null);
  const handleOpenParts = (event: any) => {
    setAnchorElParts(event.currentTarget);
  };
  const handleCloseParts = () => {
    setAnchorElParts(null);
  };
  const openParts = Boolean(anchorElParts);
  const idParts = openParts ? "simple-popover" : undefined;

  const [checkedGraph, setCheckedGraph] = React.useState(true);
  const handleCheckGraphChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCheckedGraph(event.target.checked);
  };

  React.useEffect(() => {
    setAssetName(props.assetName);
  }, [props.assetName]);
  React.useEffect(() => {
    setAssetInformation(props.assetInfo);
  }, [props.assetInfo]);
  React.useEffect(() => {
    setOperator(props.operator);
  }, [props.operator]);
  React.useEffect(() => {
    setRawTestData(props.rawTestData);
  }, [props.rawTestData]);
  React.useEffect(() => {
    setOperatorRows(props.operatorRows);
  }, [props.operatorRows]);
  React.useEffect(() => {
    setPerformanceRows(props.assetRows);
  }, [props.assetRows]);
  React.useEffect(() => {
    setDashboardData(props.dashboardData);
  }, [props.dashboardData]);
  React.useEffect(() => {
    setGraphData(props.graphData);
  }, [props.graphData]);

  const fastestCycleTime = () => {
    const testTimes = rawTestData.map((x) => x.TestDateTime.getTime());
    let totalCycles: number[] = [];
    for (let i = 0; i < testTimes.length - 1; i++) {
      const diff = Math.abs(testTimes[i] - testTimes[i + 1]);
      if (diff >= 3000) {
        totalCycles.push(diff / 1000);
      }
    }
    const cycle = Math.min(...totalCycles);
    return Number.isFinite(cycle) && !Number.isNaN(cycle) ? cycle : 0;
  };

  const totalRunTheory = () => {
    return performanceRows
      .map((x) => x.RunTheory)
      .reduce((acc, val) => acc + val, 0);
  };

  const totalRunActual = () => {
    return performanceRows
      .map((x) => x.RunActual)
      .reduce((acc, val) => acc + val, 0);
  };

  const totalEfficiency = () => {
    const totalActual = totalRunActual();
    return totalActual > 0 ? (totalRunTheory() / totalActual) * 100 : 0;
  };

  const totalPasses = () => {
    return performanceRows
      .map((x) => x.Passes)
      .reduce((acc, val) => acc + val, 0);
  };

  const totalFails = () => {
    return performanceRows
      .map((x) => x.Fails)
      .reduce((acc, val) => acc + val, 0);
  };

  const totalCycleAvg = () => {
    let totals: { cycle: number; parts: number }[] = [];
    let totalParts = 0;
    operatorRows.forEach((row) => {
      const parts = row.Passes + row.Fails;
      const cycle =
        ((row.RunActual * 60) /
          (parts -
            row.PartNumber.split(",").filter((v, i, s) => s.indexOf(v) === i)
              .length)) *
        row.PartsPerPallet;
      if (!Number.isNaN(cycle)) {
        totals.push({
          cycle: cycle,
          parts: parts,
        });
        totalParts += parts;
      }
    });
    let finalCycle = 0;
    totals.forEach((total) => {
      finalCycle += (total.parts / totalParts) * total.cycle;
    });
    return !Number.isNaN(finalCycle) ? finalCycle : 0;
  };

  // const totalCycleAvg = () => {
  //   let total = 0;
  //   let count = 0;
  //   operatorRows.forEach((row) => {
  //     const parts = row.Passes + row.Fails;
  //     const cycle =
  //       ((row.RunActual * 60) /
  //         (parts -
  //           row.PartNumber.split(",").filter((v, i, s) => s.indexOf(v) === i)
  //             .length)) *
  //       row.PartsPerPallet;
  //     if (!Number.isNaN(cycle)) {
  //       total += cycle;
  //       count++;
  //     }
  //   });
  //   return count > 0 ? total / count : 0;
  // };

  const totalCycleTarget = () => {
    let totals: { cycle: number; parts: number }[] = [];
    let totalParts = 0;
    operatorRows.forEach((row) => {
      const parts = row.Passes + row.Fails;
      const cycle = row.CycleTime * row.PartsPerPallet;
      if (!Number.isNaN(cycle)) {
        totals.push({
          cycle: cycle,
          parts: parts,
        });
        totalParts += parts;
      }
    });
    let finalCycle = 0;
    totals.forEach((total) => {
      finalCycle += (total.parts / totalParts) * total.cycle;
    });
    return !Number.isNaN(finalCycle) ? finalCycle : 0;
  };

  const totalPPHAvg = () => {
    let totalRun = 0;
    let totalParts = 0;
    operatorRows.forEach((row) => {
      const parts = row.Passes + row.Fails;
      totalRun += row.RunActual;
      totalParts += parts;
    });
    return totalRun > 0 ? totalParts / (totalRun / 60) : 0;
  };

  const totalPPHTarget = () => {
    let totalRun = 0;
    let totalParts = 0;
    operatorRows.forEach((row) => {
      const parts = row.Passes + row.Fails;
      totalRun += row.RunTheory;
      totalParts += parts;
    });
    return totalRun > 0 ? totalParts / (totalRun / 60) : 0;
  };

  const totalPartNumbers = () => {
    let allParts: string[] = [];
    operatorRows.forEach((row) => {
      allParts = allParts.concat(row.PartNumber.split(","));
    });
    return allParts
      .filter((v, i, s) => s.indexOf(v) === i)
      .sort((a, b) => a.localeCompare(b));
  };

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

  const columnsTestLogs: GridColDef[] = [
    {
      field: "TestDateTime",
      headerName: "DateTime",
      description: "Date and Time",
      width: 160,
      renderCell: (cellValue) => {
        const value = dateTimeToString(cellValue.value as Date);

        return (
          <div className={classes.cellStyle}>
            {value.substring(0, value.length - 4)}
          </div>
        );
      },
    },
    {
      field: "PNID",
      headerName: "Part",
      description: "Part Number",
      width: 125,
      renderCell: (cellValue) => {
        const value = Number(cellValue.value);
        const isPress = assetInformation.assetName.startsWith("PCB");
        const foundPart = !isPress
          ? comboPartData.find((x) => x.PNID === value)
          : processPartData.find((x) => x.PNID === value);
        return (
          <div className={classes.cellStyle}>
            {foundPart ? foundPart.PartNumber : "-"}
          </div>
        );
      },
    },
    {
      field: "OperationID",
      headerName: "OpID",
      description: "Operation ID",
      width: 70,
      renderCell: (cellValue) => {
        return (
          <div className={classes.cellStyle}>
            {cellValue.value ? cellValue.value : "-"}
          </div>
        );
      },
    },
    {
      field: "SN",
      headerName: "Serial",
      description: "Serial (Identifier Code)",
      width: 130,
      renderCell: (cellValue) => {
        return (
          <div className={classes.cellStyle}>
            {cellValue.value ? cellValue.value : "-"}
          </div>
        );
      },
    },
    {
      field: "OperatorID",
      headerName: "Operator",
      description: "Operator",
      minWidth: 100,
      flex: 1,
      renderCell: (cellValue) => {
        const id = String(cellValue.value);
        const foundIndex = employeeDirectory.findIndex(
          (userInfo) => userInfo.employeeId === id
        );
        return foundIndex > -1 ? (
          <UserDisplayClick
            userInfo={employeeDirectory[foundIndex]}
            nameFont={{ fontWeight: "500", fontSize: "12px" }}
            picSize={"24px"}
          />
        ) : (
          <div className={classes.cellStyle}>{id}</div>
        );
      },
    },
    {
      field: "Failed",
      headerName: "PassFail",
      description: "Pass or Fail",
      width: 110,
      renderCell: (cellValue) => {
        const value = Boolean(cellValue.value);
        return (
          <div className={classes.cellStyle}>{!value ? "Pass" : "Fail"}</div>
        );
      },
    },
    {
      field: "FailedTags",
      headerName: "Failed Tags",
      description: "Failed Tags",
      minWidth: 200,
      flex: 1,
      renderCell: (cellValue) => {
        return (
          <div
            className={classes.cellStyle}
            style={{
              display: "block",
              whiteSpace: "normal",
              wordWrap: "break-word",
            }}
          >
            {cellValue.value ? cellValue.value.split(",").join(", ") : ""}
          </div>
        );
      },
    },
    {
      field: "MetaDataID",
      headerName: "",
      description: "",
      width: 80,
      renderCell: (cellValue) => {
        const metaDataId = String(cellValue.value);
        return metaDataId ? (
          <ViewTestResult metaDataId={metaDataId} />
        ) : (
          <div className={classes.cellStyle}>{metaDataId}</div>
        );
      },
    },
  ];

  return (
    <div className={classes.dashboardPage} style={{ paddingTop: "16px" }}>
      <Grid container spacing={4} columns={16} padding={2}>
        <Grid item xs={7}>
          <Card
            variant="outlined"
            sx={{ width: "100%", textAlign: "center", marginBottom: 2 }}
            style={{
              border: `1px solid #003D6E`,
              backgroundColor: "#003D6E",
            }}
          >
            <Box
              sx={{
                p: 0,
                backgroundColor: "#003D6E",
              }}
            >
              <Typography
                style={{
                  alignSelf: "center",
                  fontSize: "24px",
                  fontWeight: "500",
                  color: "#FFF",
                }}
              >
                {`Asset Earned Hours (Total)`}
              </Typography>
            </Box>
            <Divider />

            <Grid container columns={12}>
              <Grid item xs={4}>
                <InformationCard
                  title="Expected Hours"
                  titleColor="#FFF"
                  borderColor="#00508F"
                  tooltip="Expected total production hours based on parts tested and their cycle times. (hh:mm:ss)"
                >
                  <Typography
                    id="run-theory-asset"
                    className={classes.runTheory}
                    style={{
                      alignSelf: "center",
                      fontSize: "36px",
                      fontWeight: "bold",
                      color: "#00508F",
                    }}
                  >
                    {getHHMMSS(totalRunTheory())}
                  </Typography>
                </InformationCard>
              </Grid>
              <Grid item xs={4}>
                <InformationCard
                  title="Actual Hours"
                  titleColor="#FFF"
                  borderColor={
                    totalEfficiency() >= 95
                      ? "rgb(0, 200, 0)"
                      : totalEfficiency() >= 85
                      ? "orange"
                      : "red"
                  }
                  tooltip="Actual total production hours spent testing parts. (hh:mm:ss)"
                >
                  <Typography
                    id="run-actual-asset"
                    className={classes.runActual}
                    style={{
                      alignSelf: "center",
                      fontSize: "36px",
                      fontWeight: "bold",
                      color:
                        totalEfficiency() >= 95
                          ? "rgb(0, 200, 0)"
                          : totalEfficiency() >= 85
                          ? "orange"
                          : "red",
                    }}
                  >
                    {getHHMMSS(totalRunActual())}
                  </Typography>
                </InformationCard>
              </Grid>
              <Grid item xs={4}>
                <InformationCard
                  title="Ahead/Behind"
                  titleColor="#FFF"
                  borderColor={
                    totalEfficiency() >= 95
                      ? "rgb(0, 200, 0)"
                      : totalEfficiency() >= 85
                      ? "orange"
                      : "red"
                  }
                  tooltip="Difference between total expected production hours and total actual production hours. (hh:mm:ss)"
                >
                  <Typography
                    id="run-variance-asset"
                    className={classes.runVariance}
                    style={{
                      alignSelf: "center",
                      fontSize: "36px",
                      fontWeight: "bold",
                      color:
                        totalEfficiency() >= 95
                          ? "rgb(0, 200, 0)"
                          : totalEfficiency() >= 85
                          ? "orange"
                          : "red",
                    }}
                  >
                    {getHHMMSS(totalRunTheory() - totalRunActual())}
                  </Typography>
                </InformationCard>
              </Grid>
            </Grid>
          </Card>
          <Card
            variant="outlined"
            sx={{ width: "100%", textAlign: "center", marginBottom: 2 }}
            style={{
              border: `1px solid #003D6E`,
              backgroundColor: "#003D6E",
            }}
          >
            <Box
              sx={{
                p: 0,
                backgroundColor: "#003D6E",
              }}
            >
              <Typography
                style={{
                  alignSelf: "center",
                  fontSize: "24px",
                  fontWeight: "500",
                  color: "#FFF",
                }}
              >
                {`Asset Earned Hours (${dashboardData.partNumber
                  .split(",")
                  .at(-1)})`}
              </Typography>
            </Box>
            <Divider />

            <Grid container columns={12}>
              <Grid item xs={4}>
                <InformationCard
                  title="Expected Hours"
                  titleColor="#FFF"
                  borderColor="#00508F"
                  tooltip="Expected production hours based on parts tested and their cycle times for the current part number. (hh:mm:ss)"
                >
                  <Typography
                    id="run-theory-asset"
                    className={classes.runTheory}
                    style={{
                      alignSelf: "center",
                      fontSize: "36px",
                      fontWeight: "bold",
                      color: "#00508F",
                    }}
                  >
                    {getHHMMSS(dashboardData.runTheory)}
                  </Typography>
                </InformationCard>
              </Grid>
              <Grid item xs={4}>
                <InformationCard
                  title="Actual Hours"
                  titleColor="#FFF"
                  borderColor={
                    dashboardData.efficiency >= 95
                      ? "rgb(0, 200, 0)"
                      : dashboardData.efficiency >= 85
                      ? "orange"
                      : "red"
                  }
                  tooltip="Actual production hours spent testing the current part number. (hh:mm:ss)"
                >
                  <Typography
                    id="run-actual-asset"
                    className={classes.runActual}
                    style={{
                      alignSelf: "center",
                      fontSize: "36px",
                      fontWeight: "bold",
                      color:
                        dashboardData.efficiency >= 95
                          ? "rgb(0, 200, 0)"
                          : dashboardData.efficiency >= 85
                          ? "orange"
                          : "red",
                    }}
                  >
                    {getHHMMSS(dashboardData.runActual)}
                  </Typography>
                </InformationCard>
              </Grid>
              <Grid item xs={4}>
                <InformationCard
                  title="Ahead/Behind"
                  titleColor="#FFF"
                  borderColor={
                    dashboardData.efficiency >= 95
                      ? "rgb(0, 200, 0)"
                      : dashboardData.efficiency >= 85
                      ? "orange"
                      : "red"
                  }
                  tooltip="Difference between expected production hours and actual production hours for the current part number. (hh:mm:ss)"
                >
                  <Typography
                    id="run-variance-asset"
                    className={classes.runVariance}
                    style={{
                      alignSelf: "center",
                      fontSize: "36px",
                      fontWeight: "bold",
                      color:
                        dashboardData.efficiency >= 95
                          ? "rgb(0, 200, 0)"
                          : dashboardData.efficiency >= 85
                          ? "orange"
                          : "red",
                    }}
                  >
                    {getHHMMSS(dashboardData.runVariance)}
                  </Typography>
                </InformationCard>
              </Grid>
            </Grid>
          </Card>
          <Card
            variant="outlined"
            sx={{ width: "100%", textAlign: "center", marginBottom: 2 }}
            style={{
              border: `1px solid #003D6E`,
              // backgroundColor: "#003D6E",
            }}
          >
            <Box
              sx={{
                p: 0,
                backgroundColor: "#003D6E",
              }}
            >
              <Typography
                style={{
                  alignSelf: "center",
                  fontSize: "24px",
                  fontWeight: "500",
                  color: "#FFF",
                }}
              >
                {` `}
              </Typography>
            </Box>
            <Divider />

            <Grid container columns={12}>
              <Grid item xs={4}>
                <Typography className={classes.assetTitle} component={"span"}>
                  <Card
                    variant="outlined"
                    sx={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: "600",
                      fontSize: "36px",
                    }}
                  >
                    {/* {assetName} */}
                    <AssetInfoHover assetInfo={assetInformation} />
                  </Card>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <InformationCard
                  title="Efficiency (Total)"
                  titleColor="#FFF"
                  borderColor={
                    totalEfficiency() >= 95
                      ? "rgb(0, 200, 0)"
                      : totalEfficiency() >= 85
                      ? "orange"
                      : "red"
                  }
                  tooltip="Total performance efficiency for the entire asset."
                >
                  <Typography
                    id="efficiency-total-asset"
                    className={classes.efficiencyTotal}
                    style={{
                      alignSelf: "center",
                      fontSize: "36px",
                      fontWeight: "bold",
                      color:
                        totalEfficiency() >= 95
                          ? "rgb(0, 200, 0)"
                          : totalEfficiency() >= 85
                          ? "orange"
                          : "red",
                    }}
                  >
                    {(Math.round(totalEfficiency() * 100) / 100).toFixed(2) +
                      "%"}
                  </Typography>
                </InformationCard>
              </Grid>
              <Grid item xs={4}>
                <InformationCard
                  title={`Efficiency (${dashboardData.partNumber
                    .split(",")
                    .at(-1)})`}
                  titleColor="#FFF"
                  borderColor={
                    dashboardData.efficiency >= 95
                      ? "rgb(0, 200, 0)"
                      : dashboardData.efficiency >= 85
                      ? "orange"
                      : "red"
                  }
                  tooltip="Performance efficiency for the current part number."
                >
                  <Typography
                    id="efficiency-part-asset"
                    className={classes.efficiencyPart}
                    style={{
                      alignSelf: "center",
                      fontSize: "36px",
                      fontWeight: "bold",
                      color:
                        dashboardData.efficiency >= 95
                          ? "rgb(0, 200, 0)"
                          : dashboardData.efficiency >= 85
                          ? "orange"
                          : "red",
                    }}
                  >
                    {(Math.round(dashboardData.efficiency * 100) / 100).toFixed(
                      2
                    ) + "%"}
                  </Typography>
                </InformationCard>
              </Grid>
            </Grid>
          </Card>
          <div style={{ padding: "10px 0 0 20px" }}>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={checkedGraph}
                  onChange={handleCheckGraphChange}
                />
              }
              label={
                <Typography style={{ fontWeight: "500", fontSize: "12px" }}>
                  Graph
                </Typography>
              }
            />
          </div>
        </Grid>
        <Grid item xs={6}>
          <Card
            variant="outlined"
            sx={{ width: "100%", textAlign: "center", marginBottom: "0px" }}
            style={{
              border: `1px solid #003D6E`,
              backgroundColor: "#003D6E",
            }}
          >
            <Box
              sx={{
                p: 0,
                backgroundColor: "#003D6E",
              }}
            >
              <Typography
                style={{
                  alignSelf: "center",
                  fontSize: "24px",
                  fontWeight: "500",
                  color: "#FFF",
                }}
              >
                {`Asset Cycle Times (Total)`}
              </Typography>
            </Box>
            <Divider />

            <Grid container columns={12}>
              <Grid item xs={4}>
                <InformationCard
                  title="Target Cycle Time"
                  titleColor="#FFF"
                  borderColor="#00508F"
                  tooltip="Target cycle time goal per part/array for the asset. (seconds)"
                >
                  <Typography
                    id="cycle-goal-total-asset"
                    className={classes.cycleGoal}
                    style={{
                      alignSelf: "center",
                      fontSize: "36px",
                      fontWeight: "bold",
                      color: "#00508F",
                    }}
                  >
                    {(Math.round(totalCycleTarget() * 100) / 100).toFixed(1)}
                  </Typography>
                </InformationCard>
              </Grid>
              <Grid item xs={4}>
                <InformationCard
                  title="Average Cycle Time"
                  titleColor="#FFF"
                  borderColor={
                    dashboardData.cycleGoal / dashboardData.cycleAvg >= 0.95
                      ? "rgb(0, 200, 0)"
                      : dashboardData.cycleGoal / dashboardData.cycleAvg >= 0.85
                      ? "orange"
                      : "red"
                  }
                  tooltip="Current rolling average cycle time per part/array for the asset. (seconds)"
                >
                  <Typography
                    id="cycle-average-total-asset"
                    className={classes.cycleAverage}
                    style={{
                      alignSelf: "cen+-ter",
                      fontSize: "36px",
                      fontWeight: "bold",
                      color:
                        dashboardData.cycleGoal / dashboardData.cycleAvg >= 0.95
                          ? "rgb(0, 200, 0)"
                          : dashboardData.cycleGoal / dashboardData.cycleAvg >=
                            0.85
                          ? "orange"
                          : "red",
                    }}
                  >
                    {(Math.round(totalCycleAvg() * 100) / 100).toFixed(1)}
                  </Typography>
                </InformationCard>
              </Grid>
              <Grid item xs={4}>
                <InformationCard
                  title="Fastest Cycle Hit"
                  titleColor="#FFF"
                  borderColor={
                    totalCycleTarget() / fastestCycleTime() >= 0.95
                      ? "rgb(0, 200, 0)"
                      : totalCycleTarget() / fastestCycleTime() >= 0.85
                      ? "orange"
                      : "red"
                  }
                  tooltip="Fastest cycle time achieved on the asset. (seconds)"
                >
                  <Typography
                    id="cycle-fastest-asset"
                    className={classes.cycleLast}
                    style={{
                      alignSelf: "center",
                      fontSize: "36px",
                      fontWeight: "bold",
                      color:
                        totalCycleTarget() / fastestCycleTime() >= 0.95
                          ? "rgb(0, 200, 0)"
                          : totalCycleTarget() / fastestCycleTime() >= 0.85
                          ? "orange"
                          : "red",
                    }}
                  >
                    {(Math.round(fastestCycleTime() * 100) / 100).toFixed(1)}
                  </Typography>
                </InformationCard>
              </Grid>
            </Grid>
          </Card>
          <Card
            variant="outlined"
            sx={{ width: "100%", textAlign: "center", marginBottom: 2 }}
            style={{
              border: `1px solid #003D6E`,
              backgroundColor: "#003D6E",
            }}
          >
            <Box
              sx={{
                p: 0,
                backgroundColor: "#003D6E",
              }}
            >
              <Typography
                style={{
                  alignSelf: "center",
                  fontSize: "24px",
                  fontWeight: "500",
                  color: "#FFF",
                }}
              >
                {` `}
              </Typography>
            </Box>
            <Divider />

            <Grid container columns={12}>
              <Grid item xs={4}>
                <InformationCard
                  title="Target PPH"
                  titleColor="#FFF"
                  borderColor="#00508F"
                  tooltip="Target parts per hour goal based on the expected production hours for the asset."
                >
                  <Typography
                    id="pph-total-target-asset"
                    className={classes.pphTarget}
                    style={{
                      alignSelf: "center",
                      fontSize: "36px",
                      fontWeight: "bold",
                      color: "#00508F",
                    }}
                  >
                    {(Math.round(totalPPHTarget() * 100) / 100).toFixed(1)}
                  </Typography>
                </InformationCard>
              </Grid>
              <Grid item xs={4}>
                <InformationCard
                  title="Average PPH"
                  titleColor="#FFF"
                  borderColor={
                    totalPPHAvg() / totalPPHTarget() >= 0.95
                      ? "rgb(0, 200, 0)"
                      : totalPPHAvg() / totalPPHTarget() >= 0.85
                      ? "orange"
                      : "red"
                  }
                  tooltip="Current rolling average parts per hour for the asset."
                >
                  <Typography
                    id="pph-total-average-asset"
                    className={classes.pphAverage}
                    style={{
                      alignSelf: "center",
                      fontSize: "36px",
                      fontWeight: "bold",
                      color:
                        totalPPHAvg() / totalPPHTarget() >= 0.95
                          ? "rgb(0, 200, 0)"
                          : totalPPHAvg() / totalPPHTarget() >= 0.85
                          ? "orange"
                          : "red",
                    }}
                  >
                    {(Math.round(totalPPHAvg() * 100) / 100).toFixed(1)}
                  </Typography>
                </InformationCard>
              </Grid>
              <Grid item xs={4}>
                <InformationCard
                  title="Total Parts"
                  titleColor="#FFF"
                  borderColor={"#00508F"}
                  tooltip="Total part types tested on the asset."
                >
                  <div
                    className={classes.totalPartNumbers}
                    onMouseEnter={handleOpenParts}
                    onMouseLeave={handleCloseParts}
                  >
                    <Typography
                      id="total-part-types-asset"
                      className={classes.cycleTimer}
                      style={{
                        alignSelf: "center",
                        fontSize: "36px",
                        fontWeight: "bold",
                        color: "#00508F",
                      }}
                    >
                      {totalPartNumbers().length}
                    </Typography>
                  </div>
                  <Popover
                    id={idParts}
                    open={openParts}
                    anchorEl={anchorElParts}
                    onClose={handleCloseParts}
                    anchorOrigin={{
                      vertical: "center",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "center",
                      horizontal: "right",
                    }}
                    disableRestoreFocus={true}
                    sx={{ pointerEvents: "none" }}
                  >
                    <Paper style={{ padding: "12px 20px 12px 20px" }}>
                      <div className={classes.totalPartNumbersInfo}>
                        <Typography
                          className={classes.totalPartNumbersDetails}
                          component={"span"}
                        >
                          {totalPartNumbers().map((part) => {
                            return (
                              <div style={{ display: "flex" }}>
                                <Box fontWeight="600" fontSize="18px">
                                  {part}
                                </Box>
                              </div>
                            );
                          })}
                        </Typography>
                      </div>
                    </Paper>
                  </Popover>
                </InformationCard>
              </Grid>
            </Grid>
          </Card>
          <Card
            variant="outlined"
            sx={{ width: "100%", textAlign: "center", marginBottom: "0px" }}
            style={{
              border: `1px solid #003D6E`,
              backgroundColor: "#003D6E",
            }}
          >
            <Box
              sx={{
                p: 0,
                backgroundColor: "#003D6E",
              }}
            >
              <Typography
                style={{
                  alignSelf: "center",
                  fontSize: "24px",
                  fontWeight: "500",
                  color: "#FFF",
                }}
              >
                {`Asset Cycle Times (${dashboardData.partNumber
                  .split(",")
                  .at(-1)})`}
              </Typography>
            </Box>
            <Divider />

            <Grid container columns={12}>
              <Grid item xs={4}>
                <InformationCard
                  title="Target Cycle Time"
                  titleColor="#FFF"
                  borderColor="#00508F"
                  tooltip="Target cycle time goal per part/array. (seconds)"
                >
                  <Typography
                    id="cycle-goal-asset"
                    className={classes.cycleGoal}
                    style={{
                      alignSelf: "center",
                      fontSize: "36px",
                      fontWeight: "bold",
                      color: "#00508F",
                    }}
                  >
                    {(Math.round(dashboardData.cycleGoal * 100) / 100).toFixed(
                      1
                    )}
                  </Typography>
                </InformationCard>
              </Grid>
              <Grid item xs={4}>
                <InformationCard
                  title="Average Cycle Time"
                  titleColor="#FFF"
                  borderColor={
                    dashboardData.cycleGoal / dashboardData.cycleAvg >= 0.95
                      ? "rgb(0, 200, 0)"
                      : dashboardData.cycleGoal / dashboardData.cycleAvg >= 0.85
                      ? "orange"
                      : "red"
                  }
                  tooltip="Current rolling average cycle time per part/array. (seconds)"
                >
                  <Typography
                    id="cycle-average-asset"
                    className={classes.cycleAverage}
                    style={{
                      alignSelf: "center",
                      fontSize: "36px",
                      fontWeight: "bold",
                      color:
                        dashboardData.cycleGoal / dashboardData.cycleAvg >= 0.95
                          ? "rgb(0, 200, 0)"
                          : dashboardData.cycleGoal / dashboardData.cycleAvg >=
                            0.85
                          ? "orange"
                          : "red",
                    }}
                  >
                    {(Math.round(dashboardData.cycleAvg * 100) / 100).toFixed(
                      1
                    )}
                  </Typography>
                </InformationCard>
              </Grid>
              <Grid item xs={4}>
                <InformationCard
                  title="Last Cycle Time"
                  titleColor="#FFF"
                  borderColor={
                    dashboardData.cycleGoal / dashboardData.cycleLast >= 0.95
                      ? "rgb(0, 200, 0)"
                      : dashboardData.cycleGoal / dashboardData.cycleLast >=
                        0.85
                      ? "orange"
                      : "red"
                  }
                  tooltip="Last cycle time achieved. (seconds)"
                >
                  <Typography
                    id="cycle-last-asset"
                    className={classes.cycleLast}
                    style={{
                      alignSelf: "center",
                      fontSize: "36px",
                      fontWeight: "bold",
                      color:
                        dashboardData.cycleGoal / dashboardData.cycleLast >=
                        0.95
                          ? "rgb(0, 200, 0)"
                          : dashboardData.cycleGoal / dashboardData.cycleLast >=
                            0.85
                          ? "orange"
                          : "red",
                    }}
                  >
                    {(Math.round(dashboardData.cycleLast * 100) / 100).toFixed(
                      1
                    )}
                  </Typography>
                </InformationCard>
              </Grid>
            </Grid>
          </Card>
          <Card
            variant="outlined"
            sx={{ width: "100%", textAlign: "center", marginBottom: 2 }}
            style={{
              border: `1px solid #003D6E`,
              backgroundColor: "#003D6E",
            }}
          >
            <Box
              sx={{
                p: 0,
                backgroundColor: "#003D6E",
              }}
            >
              <Typography
                style={{
                  alignSelf: "center",
                  fontSize: "24px",
                  fontWeight: "500",
                  color: "#FFF",
                }}
              >
                {` `}
              </Typography>
            </Box>
            <Divider />

            <Grid container columns={12}>
              <Grid item xs={4}>
                <InformationCard
                  title="Target PPH"
                  titleColor="#FFF"
                  borderColor="#00508F"
                  tooltip="Target parts per hour goal based on the expected production hours."
                >
                  <Typography
                    id="pph-target-asset"
                    className={classes.pphTarget}
                    style={{
                      alignSelf: "center",
                      fontSize: "36px",
                      fontWeight: "bold",
                      color: "#00508F",
                    }}
                  >
                    {(
                      Math.round(dashboardData.partsPerHourGoal * 100) / 100
                    ).toFixed(1)}
                  </Typography>
                </InformationCard>
              </Grid>
              <Grid item xs={4}>
                <InformationCard
                  title="Average PPH"
                  titleColor="#FFF"
                  borderColor={
                    dashboardData.partsPerHour /
                      dashboardData.partsPerHourGoal >=
                    0.95
                      ? "rgb(0, 200, 0)"
                      : dashboardData.partsPerHour /
                          dashboardData.partsPerHourGoal >=
                        0.85
                      ? "orange"
                      : "red"
                  }
                  tooltip="Current rolling average parts per hour."
                >
                  <Typography
                    id="pph-average-asset"
                    className={classes.pphAverage}
                    style={{
                      alignSelf: "center",
                      fontSize: "36px",
                      fontWeight: "bold",
                      color:
                        dashboardData.partsPerHour /
                          dashboardData.partsPerHourGoal >=
                        0.95
                          ? "rgb(0, 200, 0)"
                          : dashboardData.partsPerHour /
                              dashboardData.partsPerHourGoal >=
                            0.85
                          ? "orange"
                          : "red",
                    }}
                  >
                    {(
                      Math.round(dashboardData.partsPerHour * 100) / 100
                    ).toFixed(1)}
                  </Typography>
                </InformationCard>
              </Grid>
              <Grid item xs={4}>
                <InformationCard
                  title="Current Cycle"
                  titleColor="#FFF"
                  borderColor={
                    dashboardData.cycleGoal / dashboardData.cycleTimer >= 0.95
                      ? "rgb(0, 200, 0)"
                      : dashboardData.cycleGoal / dashboardData.cycleTimer >=
                        0.85
                      ? "orange"
                      : "red"
                  }
                  tooltip="Current cycle time live counter. (seconds)"
                >
                  <Typography
                    id="cycle-timer-asset"
                    className={classes.cycleTimer}
                    style={{
                      alignSelf: "center",
                      fontSize: "36px",
                      fontWeight: "bold",
                      color:
                        dashboardData.cycleGoal / dashboardData.cycleTimer >=
                        0.95
                          ? "rgb(0, 200, 0)"
                          : dashboardData.cycleGoal /
                              dashboardData.cycleTimer >=
                            0.85
                          ? "orange"
                          : "red",
                    }}
                  >
                    {(Math.round(dashboardData.cycleTimer * 100) / 100).toFixed(
                      1
                    )}
                  </Typography>
                </InformationCard>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid
          item
          xs={3}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <InformationCard
            title={`Test Count (Total)`}
            titleColor="#FFF"
            borderColor="#008DFF"
            tooltip="Total parts tested for the entire asset."
            sx={{ marginBottom: 2 }}
          >
            <Box id="test-count-total-asset" className={classes.testCountTotal}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Typography
                  style={{
                    alignSelf: "center",
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#000",
                    paddingRight: "10px",
                  }}
                >
                  {"Passes:"}
                </Typography>
                <Typography
                  style={{
                    alignSelf: "center",
                    fontSize: "36px",
                    fontWeight: "bold",
                    color: "#003BFF",
                  }}
                >
                  {totalPasses()}
                </Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Typography
                  style={{
                    alignSelf: "center",
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#000",
                    paddingRight: "10px",
                  }}
                >
                  {"Fails:"}
                </Typography>
                <Typography
                  style={{
                    alignSelf: "center",
                    fontSize: "36px",
                    fontWeight: "bold",
                    color: "#003BFF",
                  }}
                >
                  {totalFails()}
                </Typography>
              </div>
            </Box>
          </InformationCard>
          <InformationCard
            title={`Test Count (${dashboardData.partNumber.split(",").at(-1)})`}
            titleColor="#FFF"
            borderColor="#008DFF"
            tooltip="Total parts tested for the current part number."
            sx={{ marginBottom: 2 }}
          >
            <Box id="test-count-part-asset" className={classes.testCountPart}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Typography
                  style={{
                    alignSelf: "center",
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#000",
                    paddingRight: "10px",
                  }}
                >
                  {"Passes:"}
                </Typography>
                <Typography
                  style={{
                    alignSelf: "center",
                    fontSize: "36px",
                    fontWeight: "bold",
                    color: "#003BFF",
                  }}
                >
                  {dashboardData.passes}
                </Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Typography
                  style={{
                    alignSelf: "center",
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#000",
                    paddingRight: "10px",
                  }}
                >
                  {"Fails:"}
                </Typography>
                <Typography
                  style={{
                    alignSelf: "center",
                    fontSize: "36px",
                    fontWeight: "bold",
                    color: "#003BFF",
                  }}
                >
                  {dashboardData.fails}
                </Typography>
              </div>
            </Box>
          </InformationCard>
        </Grid>
      </Grid>
      <div
        style={{
          position: "absolute",
          bottom: "8px",
          right: 0,
          width: "100%",
          height: "calc(100% - 480px)",
        }}
      >
        <SwipeableViews
          className={classes.swipeableView}
          axis={"y"}
          index={checkedGraph ? 0 : 1}
          containerStyle={{
            width: "100%",
            height: "100%",
            overflow: "visible",
          }}
          slideStyle={{
            width: "100%",
            height: "100%",
            overflow: checkedGraph ? "hidden" : "auto",
            borderColor: checkedGraph ? "none" : "rgba(224, 224, 224, 1)",
            borderTop: checkedGraph ? "none" : "outset",
            borderWidth: "1px",
          }}
        >
          <TabPanel
            value={checkedGraph ? 0 : 1}
            index={0}
            style={{ width: "100%", height: "100%" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[...graphData]} margin={{ top: 12, right: 64 }}>
                <CartesianGrid stroke="#000" strokeDasharray="5 5" />
                <XAxis
                  dataKey="timeString"
                  //interval={"preserveStartEnd"}
                  interval={3}
                  stroke="#000"
                  style={{ fontSize: "1rem" }}
                  orientation="bottom"
                />
                <YAxis
                  stroke="#000"
                  style={{ fontSize: "1rem", position: "absolute", top: 8 }}
                  interval={2}
                  domain={[0, Math.round(graphMaximum() + 10)]}
                  // domain={[0, 150]}
                  // allowDataOverflow={true}
                >
                  <Label
                    value="Efficiency"
                    offset={30}
                    angle={-90}
                    position="insideLeft"
                  />
                </YAxis>

                {/* <Tooltip wrapperStyle={{ fontSize: "1rem" }} itemStyle={{}} /> */}
                <Tooltip content={<TooltipGraphCustom />} />
                <ReferenceLine
                  y={100}
                  label={{
                    value: "100%",
                    fontSize: "18px",
                    position: "right",
                    fontWeight: "600",
                    fill: GentexBlue,
                  }}
                  stroke={GentexBlue}
                  strokeDasharray="10 10"
                  strokeWidth={2}
                />
                <ReferenceLine
                  stroke="rgba(165, 55, 253, 0.7)"
                  strokeWidth={2}
                  // label={{
                  //   value: `${
                  //     graphAverageRight() > -1
                  //       ? (Math.round(graphAverageRight() * 100) / 100).toFixed(2)
                  //       : (Math.round(graphAverageAll() * 100) / 100).toFixed(2)
                  //   }%`,
                  //   fontSize: "12px",
                  //   position: "right",
                  //   fontWeight: "500",
                  // }}
                  segment={[
                    {
                      x: graphData[0]?.timeString,
                      y:
                        graphAverageLeft() > -1
                          ? graphAverageLeft()
                          : graphAverageAll(),
                    },
                    {
                      x: graphData[graphData.length - 1]?.timeString,
                      y:
                        graphAverageRight() > -1
                          ? graphAverageRight()
                          : graphAverageAll(),
                    },
                  ]}
                />
                <defs>
                  <linearGradient
                    id="efficiencyLine"
                    x1="0"
                    y1="0%"
                    x2="0"
                    y2="100%"
                  >
                    {graphMinimum() >= 95 ? (
                      <stop offset="100%" stopColor="rgb(0, 200, 0)" />
                    ) : graphMinimum() >= 85 && graphMaximum() >= 95 ? (
                      <>
                        <stop
                          offset={`${
                            ((graphMaximum() - 95) /
                              (graphMaximum() - graphMinimum())) *
                            100
                          }%`}
                          stopColor="rgb(0, 200, 0)"
                        />
                        <stop offset="100%" stopColor="orange" />
                      </>
                    ) : graphMinimum() < 85 && graphMaximum() >= 95 ? (
                      <>
                        <stop
                          offset={`${
                            ((graphMaximum() - 95) /
                              (graphMaximum() - graphMinimum())) *
                            100
                          }%`}
                          stopColor="rgb(0, 200, 0)"
                        />
                        <stop
                          offset={`${
                            ((graphMaximum() - 85) /
                              (graphMaximum() - graphMinimum())) *
                            100
                          }%`}
                          stopColor="orange"
                        />
                        <stop offset="100%" stopColor="red" />
                      </>
                    ) : graphMinimum() < 85 && graphMaximum() < 95 ? (
                      <>
                        <stop
                          offset={`${
                            ((graphMaximum() - 85) /
                              (graphMaximum() - graphMinimum())) *
                            100
                          }%`}
                          stopColor="orange"
                        />
                        <stop offset="100%" stopColor="red" />
                      </>
                    ) : graphMinimum() >= 85 && graphMaximum() < 95 ? (
                      <stop offset="100%" stopColor="orange" />
                    ) : graphMaximum() < 85 ? (
                      <stop offset="100%" stopColor="red" />
                    ) : (
                      <stop offset="100%" stopColor="black" />
                    )}
                  </linearGradient>
                </defs>
                <Line
                  dataKey="efficiency"
                  unit={0}
                  // stroke="green"
                  type="monotone"
                  stroke="url(#efficiencyLine)"
                  strokeWidth={4}
                  // dot={(x: any) => {
                  //   return {
                  //     stroke: "green",
                  //   } as any;
                  // }}
                  dot={{ stroke: "rgba(0, 0, 0, 0.5)", strokeWidth: 2, r: 2 }}
                  activeDot={{
                    stroke: "rgba(0, 0, 0, 0.5)",
                    fill: "none",
                    r: 8,
                  }}
                  name="Efficiency"
                />
              </LineChart>
            </ResponsiveContainer>
          </TabPanel>
          <TabPanel value={checkedGraph ? 0 : 1} index={1}>
            <DataGridStyled
              columns={columnsTestLogs}
              rows={rawTestData
                .slice(rawTestData.length - 101, rawTestData.length)
                .sort(
                  (a, b) => b.TestDateTime.getTime() - a.TestDateTime.getTime()
                )
                .map((x, i) => {
                  return {
                    ...x,
                    id: i,
                  };
                })}
              hideFooter={true}
              autoHeight={true}
              rowSelection={false}
              columnBuffer={10}
              columnHeaderHeight={30}
              rowHeight={28}
              getRowHeight={() => "auto"}
              getRowClassName={(params) => {
                const row = params.row as SnRow;
                if (row.Failed) {
                  return `test-rows--Bad`;
                } else {
                  return `test-rows--Good`;
                }
              }}
            />
            {/* <DataGridInfinite
              rows={rawTestData.map((x, i) => {
                return {
                  ...x,
                  id: i,
                };
              })}
            /> */}
          </TabPanel>
        </SwipeableViews>
      </div>
    </div>
  );
};
