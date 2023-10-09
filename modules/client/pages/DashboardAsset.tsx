import * as React from "react";
import {
  Backdrop,
  Box,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
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
import { getBiAssetInfo, getProcessDataExport } from "../utils/mes";
import {
  getFinalProcessDataOperator,
  getFinalProcessDataOperatorTotals,
} from "../utils/DataUtility";
import {
  BiAssetInfo,
  ProcessDataExport,
  ProcessDataOperatorTotals,
} from "../utils/DataTypes";
import { getHHMMSS } from "../utils/DateUtility";
import { useParams } from "react-router";
import { useGetAssetByNameQuery } from "client/graphql/types.gen";
import { useSelector } from "react-redux";
import { Selectors } from "client/redux/selectors";
import { UserInformation } from "core/schemas/user-information.gen";
import { UserDisplayHover } from "client/components/user-display/UserDisplayHover";
import { OperatorDisplayDashboard } from "client/components/user-display/OperatorDisplayDashboard";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    height: "100%",
    cursor: "default",
  },
  title: {
    alignSelf: "center",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#000",
    paddingRight: "10px",
  },
  labelData1: {
    alignSelf: "center",
    fontSize: "64px",
    fontWeight: "bold",
    color: "#003BFF",
  },
  labelPart: {
    alignSelf: "center",
    fontSize: "112px",
    fontWeight: "bold",
    color: "#000",
    paddingLeft: "calc(100vw / 2 - 530px)",
    marginTop: "-30px",
    marginLeft: "60px",
  },
  divTotals: {
    display: "flex",
  },
}));

interface DashboardData {
  Operator: string;
  LastRun: Date;
  PartNumber: string;
  Passes: number;
  Fails: number;
  CycleTime: number;
  CycleGoal: number;
  PartsPerHour: number;
  RunActual: number;
  RunTheory: number;
  Efficiency: number;
}

interface GraphData {
  time: Date;
  timeString: string;
  efficiency: number;
  Efficiency: string;
}

export const DashboardAsset: React.FC<{ asset?: string }> = (props) => {
  const { asset } = useParams();

  document.title = `Dashboard | ${props.asset ?? asset}`;

  const classes = useStyles();

  const [assetName, setAssetName] = React.useState("");
  const [assetInformation, setAssetInformation] = React.useState<BiAssetInfo>();

  const [operatorInfo, setOperatorInfo] = React.useState<UserInformation>();

  const assetInfo = useGetAssetByNameQuery({
    variables: {
      assetName: assetName,
    },
    skip: !assetName,
    fetchPolicy: "cache-and-network",
  });

  const employeeDirectoryRedux = useSelector(
    Selectors.App.employeeActiveDirectory
  );

  React.useEffect(() => {
    if (props.asset) setAssetName(props.asset);
    else if (asset) setAssetName(asset);
  }, [props, asset]);

  React.useEffect(() => {
    if (
      assetInfo.called &&
      !assetInfo.loading &&
      !assetInfo.error &&
      assetInfo.data &&
      assetInfo.data.getAssetByName
    ) {
      const info: BiAssetInfo = {
        ...assetInfo.data.getAssetByName,
      };
      setAssetInformation((i) => info);
    }
  }, [assetInfo]);

  // React.useEffect(() => {
  //   console.log("INFO: " + JSON.stringify(assetInformation));
  // }, [assetInformation]);

  const [assetProcessData, setAssetProcessData] = React.useState<
    ProcessDataExport[]
  >([]);
  const [assetDataTotal, setAssetDataTotal] = React.useState<
    ProcessDataOperatorTotals[]
  >([]);
  const [assetLastData, setAssetLastData] =
    React.useState<ProcessDataOperatorTotals>({
      id: 0,
      Asset: props.asset ?? asset ?? "",
      PartNumber: "000-0000",
      Date: new Date(),
      StartTime: new Date(),
      EndTime: new Date(),
      Passes: 1234,
      Fails: 123,
      OperationId: "0",
      Line: "",
      Label: "",
      Operator: "",
      Revision: "",
      Sender: "",
      TestPlan: "",
      CycleTime: 0,
      RunActual: 0,
      RunTheory: 0,
      Efficiency: 0,
      PartsPerHour: 0,
    });

  const [dashboardData, setDashboardData] = React.useState<DashboardData>({
    Operator: "00000",
    LastRun: new Date(),
    PartNumber: "000-0000",
    Passes: 0,
    Fails: 0,
    CycleTime: 0,
    CycleGoal: 0,
    PartsPerHour: 0,
    RunActual: 0,
    RunTheory: 0,
    Efficiency: 100,
  });

  React.useEffect(() => {
    if (
      employeeDirectoryRedux.length > 0 &&
      dashboardData.Operator &&
      dashboardData.Operator !== "00000"
    ) {
      const foundIndex = employeeDirectoryRedux.findIndex((userInfo) => {
        return userInfo.employeeId === dashboardData.Operator;
      });

      if (foundIndex > -1) setOperatorInfo(employeeDirectoryRedux[foundIndex]);
    }
  }, [employeeDirectoryRedux, dashboardData]);

  const [graphData, setGraphData] = React.useState<GraphData[]>([]);

  const [loading, setLoading] = React.useState(true);

  const retrieveAssetData = async () => {
    const dateNow = new Date();
    let dateEnd = new Date(dateNow);
    dateEnd.setHours(dateEnd.getHours() - 4);
    // console.log(
    //   `DateNow: ${dateNow.toLocaleString()}, DateEnd: ${dateEnd.toLocaleString()}`
    // );
    let processData = await getProcessDataExport(
      props.asset ?? asset ?? "",
      dateEnd,
      dateNow
    );
    if (processData) {
      processData = processData.sort(
        (a, b) => a.OpEndTime.getTime() - b.OpEndTime.getTime()
      );
      setAssetProcessData(processData);
      const processOps = getFinalProcessDataOperator(processData);
      // console.log(assetInformation);
      const processTotal = await getFinalProcessDataOperatorTotals(
        processOps,
        assetInformation?.orgCode ?? "14"
      );
      // console.log(processData);
      if (processTotal) {
        setAssetDataTotal(processTotal);
        if (processTotal.length > 0) {
          setAssetLastData(processTotal[processTotal.length - 1]);
          loadDashboardData(processData, processTotal[processTotal.length - 1]);
        }
      }
      setLoading(false);
    }
  };

  const loadDashboardData = (
    processData: ProcessDataExport[],
    lastTotal: ProcessDataOperatorTotals
  ) => {
    let data: DashboardData = {
      Operator: lastTotal.Operator,
      LastRun: lastTotal.EndTime,
      PartNumber: lastTotal.PartNumber,
      Passes: lastTotal.Passes,
      Fails: lastTotal.Fails,
      CycleTime: 0,
      CycleGoal: lastTotal.CycleTime,
      PartsPerHour: lastTotal.PartsPerHour,
      RunActual: lastTotal.RunActual,
      RunTheory: lastTotal.RunTheory,
      Efficiency: lastTotal.Efficiency,
    };
    if (processData.length > 1) {
      processData = processData.sort(
        (a, b) => a.OpEndTime.getTime() - b.OpEndTime.getTime()
      );

      let lastTest = processData[processData.length - 1].OpEndTime;
      let prevTest = new Date(lastTest);
      for (let i = processData.length - 2; i >= 0; --i) {
        const test = processData[i];
        if (test.OpEndTime.getTime() !== lastTest.getTime()) {
          prevTest = test.OpEndTime;
          break;
        }
      }
      // console.log(lastTest);
      // console.log(prevTest);
      const cycle = (lastTest.getTime() - prevTest.getTime()) / 1000;
      data.CycleTime = cycle;
    }
    setDashboardData(data);
  };

  // React.useEffect(() => {
  //   (async () => {
  //     const assetInfo = await getBiAssetInfo(props.asset ?? asset ?? "");
  //     if (assetInfo) {
  //       setAssetInformation(assetInfo);
  //     }
  //   })();
  // }, [props]);

  React.useEffect(() => {
    if (assetInformation) void retrieveAssetData();
  }, [assetInformation]);

  React.useEffect(() => {
    const intervalId = setInterval(async () => {
      if (assetInformation) await retrieveAssetData();
    }, 3000);
    // const intervalId = setInterval(async () => {
    //   await retrieveAssetData();
    // }, 3000);

    return () => clearInterval(intervalId);
  }, [assetInformation]);

  React.useEffect(() => {
    let gData: GraphData[] = [];
    let allData: ProcessDataExport[][] = [];
    for (let i = 0; i < 96; ++i) {
      allData.push([]);
    }
    assetProcessData.forEach((procData) => {
      const hr = procData.OpEndTime.getHours();
      const mins = procData.OpEndTime.getMinutes();
      for (let i = 0; i < 24; ++i) {
        if (hr === i) {
          if (mins <= 15) {
            allData[i * 4].push(procData);
          } else if (mins <= 30) {
            allData[i * 4 + 1].push(procData);
          } else if (mins <= 45) {
            allData[i * 4 + 2].push(procData);
          } else {
            allData[i * 4 + 3].push(procData);
          }
        }
      }
    });
    allData.forEach((procData) => {
      if (procData.length > 1) {
        let work =
          (procData[procData.length - 1].OpEndTime.getTime() -
            procData[0].OpEndTime.getTime()) /
          60000;
        let goal = (assetLastData.CycleTime * procData.length) / 60;
        let efficiency = (goal / work) * 100;
        let date = procData[procData.length - 1].OpEndTime;
        const mins = date.getMinutes();
        const hours = date.getHours();
        date.setMinutes(((((mins + 7.5) / 15) | 0) * 15) % 60);
        date.setHours((((mins / 105 + 0.5) | 0) + hours) % 24);
        date.setSeconds(0);
        let data: GraphData = {
          time: date,
          timeString: date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          efficiency: Math.round(efficiency * 100) / 100,
          Efficiency: (Math.round(efficiency * 100) / 100).toFixed(2) + "%",
        };
        gData.push(data);
      }
    });
    let count = 0;
    for (let i = gData.length - 1; i >= 0; --i) {
      if (gData[i]) {
        if (gData[i].efficiency) {
          ++count;
        }
        if (count > 40) {
          gData.splice(i, 1);
          //++i;
        }
      }
    }
    setGraphData(gData);
  }, [assetLastData, assetProcessData]);

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

      <div className={classes.divTotals}>
        <Typography
          style={{
            alignSelf: "center",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#000",
            paddingRight: "10px",
            marginLeft: "8px",
          }}
        >
          {"Passes:"}
        </Typography>
        <Typography
          style={{
            alignSelf: "center",
            fontSize: "64px",
            fontWeight: "bold",
            color: "#003BFF",
          }}
        >
          {dashboardData.Passes}
        </Typography>
        <Typography
          style={{
            alignSelf: "center",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#000",
            paddingRight: "10px",
            paddingLeft: "48px",
          }}
        >
          {"Fails:"}
        </Typography>
        <Typography
          style={{
            alignSelf: "center",
            fontSize: "64px",
            fontWeight: "bold",
            color: "#003BFF",
          }}
        >
          {dashboardData.Fails}
        </Typography>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
          }}
        >
          <Typography style={{ fontSize: "24px", marginRight: "8px" }}>
            {"Asset:"}
          </Typography>
          <Typography style={{ fontSize: "24px", fontWeight: "bold" }}>
            {assetName}
          </Typography>
        </div>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
          }}
        >
          <Typography style={{ fontSize: "16px", marginRight: "8px" }}>
            {"Last Run:"}
          </Typography>
          <Typography style={{ fontSize: "16px", fontWeight: "bold" }}>
            {dashboardData.LastRun.toLocaleTimeString()}
          </Typography>
        </div>
      </div>
      <div style={{ display: "flex", marginTop: "-20px" }}>
        <Typography
          style={{
            alignSelf: "center",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#000",
            paddingRight: "10px",
          }}
        >
          {"Operator:"}
        </Typography>
        {operatorInfo ? (
          <div style={{ display: "flex" }}>
            <OperatorDisplayDashboard userInfo={operatorInfo} />
          </div>
        ) : (
          <Typography
            style={{
              alignSelf: "center",
              fontSize: "64px",
              fontWeight: "bold",
              color: "#003BFF",
            }}
          >
            {dashboardData.Operator}
          </Typography>
        )}

        <Typography
          style={{
            alignSelf: "center",
            fontSize: "112px",
            fontWeight: "bold",
            color: "#000",
            paddingLeft: "calc(100vw / 2 - 630px)",
            marginTop: "-30px",
            marginLeft: "60px",
          }}
        >
          {dashboardData.PartNumber}
        </Typography>
      </div>
      {/* <div style={{ display: "flex", marginTop: "-40px" }}>
        <Typography
          style={{
            alignSelf: "center",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#000",
            paddingRight: "10px",
          }}
        >
          {"Parts:"}
        </Typography>
        <Typography
          style={{
            alignSelf: "center",
            fontSize: "64px",
            fontWeight: "bold",
            color: "#003BFF",
          }}
        >
          {"1234"}
        </Typography>
      </div> */}
      <div
        style={{ display: "flex", position: "absolute", top: 240, right: 50 }}
      >
        <div style={{ paddingRight: "80px" }}>
          <div style={{ display: "Flex" }}>
            <Typography
              style={{
                alignSelf: "center",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#000",
                paddingRight: "10px",
              }}
            >
              {dashboardData.Efficiency >= 95 ? "Ahead: " : "Behind: "}
            </Typography>
            <Typography
              style={{
                alignSelf: "center",
                verticalAlign: "center",
                fontSize: "64px",
                fontWeight: "bold",
                color:
                  dashboardData.Efficiency >= 95
                    ? "rgb(0, 200, 0)"
                    : dashboardData.Efficiency >= 85
                    ? "orange"
                    : "red",
              }}
            >
              {getHHMMSS(dashboardData.RunTheory - dashboardData.RunActual)}
            </Typography>
          </div>
          {/* <div style={{ display: "Flex", marginTop: "-20px" }}>
            <Typography
              style={{
                alignSelf: "center",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#000",
                paddingRight: "10px",
              }}
            >
              {waveData.efficiencyTotal >= 100
                ? "Ahead (Total):"
                : " Behind (Total):"}
              {"Ahead: "}
            </Typography>
            <Typography
              style={{
                alignSelf: "center",
                fontSize: "64px",
                fontWeight: "bold",
                color: "#003BFF",
              }}
              style={
                waveData.efficiencyTotal >= 95
                  ? { color: "rgb(0, 200, 0)" }
                  : waveData.efficiencyTotal >= 85
                  ? { color: "orange" }
                  : { color: "red" }
              }
            >
              {"hh:mm:ss"}
            </Typography>
          </div> */}
        </div>
        <div style={{ paddingRight: "80px" }}>
          <div style={{ display: "flex" }}>
            <Typography
              style={{
                alignSelf: "center",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#000",
                paddingRight: "10px",
              }}
            >
              {"Last Cycle:"}
            </Typography>
            <Typography
              style={{
                alignSelf: "center",
                fontSize: "64px",
                fontWeight: "bold",
                color:
                  dashboardData.CycleTime <= dashboardData.CycleGoal
                    ? "rgb(0, 200, 0)"
                    : "red",
              }}
            >
              {(Math.round(dashboardData.CycleTime * 100) / 100).toFixed(1)}
            </Typography>
          </div>
          <div style={{ display: "flex", marginTop: "-20px" }}>
            <Typography
              style={{
                alignSelf: "center",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#000",
                paddingRight: "10px",
              }}
            >
              {"Cycle Goal:"}
            </Typography>
            <Typography
              style={{
                alignSelf: "center",
                fontSize: "64px",
                fontWeight: "bold",
                color: "#000",
              }}
            >
              {(Math.round(dashboardData.CycleGoal * 100) / 100).toFixed(1)}
            </Typography>
          </div>
        </div>
        <div>
          <div style={{ display: "flex" }}>
            <Typography
              style={{
                alignSelf: "center",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#000",
                paddingRight: "10px",
              }}
            >
              {"Efficiency:"}
            </Typography>
            <Typography
              style={{
                alignSelf: "center",
                fontSize: "64px",
                fontWeight: "bold",
                color:
                  dashboardData.Efficiency >= 95
                    ? "rgb(0, 200, 0)"
                    : dashboardData.Efficiency >= 85
                    ? "orange"
                    : "red",
              }}
            >
              {(Math.round(dashboardData.Efficiency * 100) / 100).toFixed(2) +
                "%"}
            </Typography>
          </div>
          {/* <div style={{ display: "flex", marginTop: "-20px" }}>
            <Typography
              style={{
                alignSelf: "center",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#000",
                paddingRight: "10px",
              }}
            >
              {"Efficiency (Total):"}
            </Typography>
            <Typography
              style={{
                alignSelf: "center",
                fontSize: "64px",
                fontWeight: "bold",
                color: "#003BFF",
              }}
              style={
                waveData.efficiencyTotal >= 95
                  ? { color: "rgb(0, 200, 0)" }
                  : waveData.efficiencyTotal >= 85
                  ? { color: "orange" }
                  : { color: "red" }
              }
            >
              {"100%"}
            </Typography>
          </div> */}
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0 }}>
        <div style={{ display: "flex", marginBottom: "-20px" }}>
          <Typography
            style={{
              alignSelf: "center",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#000",
              paddingRight: "10px",
            }}
          >
            {"Work (Actual):"}
          </Typography>
          <Typography
            style={{
              alignSelf: "center",
              fontSize: "64px",
              fontWeight: "bold",
              color:
                dashboardData.Efficiency >= 95
                  ? "rgb(0, 200, 0)"
                  : dashboardData.Efficiency >= 85
                  ? "orange"
                  : "red",
            }}
            // style={
            //   waveData.efficiency >= 95
            //     ? { color: "rgb(0, 200, 0)" }
            //     : waveData.efficiency >= 85
            //     ? { color: "orange" }
            //     : { color: "red" }
            // }
          >
            {getHHMMSS(dashboardData.RunActual)}
          </Typography>
        </div>
        <div style={{ display: "flex", marginBottom: "-20px" }}>
          <Typography
            style={{
              alignSelf: "center",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#000",
              paddingRight: "10px",
            }}
          >
            {"Work (Goal):"}
          </Typography>
          <Typography
            style={{
              alignSelf: "center",
              fontSize: "64px",
              fontWeight: "bold",
              color: "#000",
            }}
          >
            {getHHMMSS(dashboardData.RunTheory)}
          </Typography>
        </div>
        <div style={{ display: "flex", marginBottom: "-20px" }}>
          <Typography
            style={{
              alignSelf: "center",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#000",
              paddingRight: "10px",
            }}
          >
            {"Total (Actual):"}
          </Typography>
          <Typography
            style={{
              alignSelf: "center",
              fontSize: "64px",
              fontWeight: "bold",
              color: "#003BFF",
            }}
            // style={
            //   waveData.efficiencyTotal >= 95
            //     ? { color: "rgb(0, 200, 0)" }
            //     : waveData.efficiencyTotal >= 85
            //     ? { color: "orange" }
            //     : { color: "red" }
            // }
          >
            {"hh:mm:ss"}
          </Typography>
        </div>
        <div style={{ display: "flex", marginBottom: "-20px" }}>
          <Typography
            style={{
              alignSelf: "center",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#000",
              paddingRight: "10px",
            }}
          >
            {"Total (Goal):"}
          </Typography>
          <Typography
            style={{
              alignSelf: "center",
              fontSize: "64px",
              fontWeight: "bold",
              color: "#000",
            }}
          >
            {"hh:mm:ss"}
          </Typography>
        </div>
        <div style={{ display: "flex", marginBottom: "-20px" }}>
          <Typography
            style={{
              alignSelf: "center",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#000",
              paddingRight: "10px",
            }}
          >
            {"Changeover:"}
          </Typography>
          <Typography
            style={{
              alignSelf: "center",
              fontSize: "64px",
              fontWeight: "bold",
              color: "#000",
            }}
          >
            {"hh:mm:ss"}
          </Typography>
        </div>
        <div style={{ display: "flex" }}>
          <Typography
            style={{
              alignSelf: "center",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#000",
              paddingRight: "10px",
            }}
          >
            {"Starve Time:"}
          </Typography>
          <Typography
            style={{
              alignSelf: "center",
              fontSize: "64px",
              fontWeight: "bold",
              color: "#000",
            }}
          >
            {"hh:mm:ss"}
          </Typography>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 10,
          right: 0,
          width: "calc(100vw - 500px)",
          height: "calc(100vh - 500px)",
        }}
      >
        <ResponsiveContainer width="100%">
          <LineChart data={[...graphData]} margin={{ right: 100 }}>
            <CartesianGrid stroke="#000" strokeDasharray="5 5" />
            <XAxis
              dataKey="timeString"
              //interval={"preserveStartEnd"}
              interval={2}
              stroke="#000"
              style={{ fontSize: "1rem" }}
            >
              <Label value="Time" offset={0} position="insideBottom" />
            </XAxis>
            <YAxis
              stroke="#000"
              style={{ fontSize: "1rem" }}
              interval={2}
              domain={[
                0,
                Math.round(
                  Math.max(...graphData.map((o) => o.efficiency)) + 10
                ),
              ]}
              // domain={[0, 150]}
              allowDataOverflow={true}
            >
              <Label
                value="Efficiency"
                offset={20}
                angle={-90}
                position="insideLeft"
              />
            </YAxis>

            <Tooltip wrapperStyle={{ fontSize: "1rem" }} itemStyle={{}} />
            <ReferenceLine
              y={100}
              label={{
                value: "100%",
                fontSize: "1rem",
                position: "right",
              }}
              stroke="red"
              strokeDasharray="5 5"
              strokeWidth={2}
            />
            <Line
              dataKey="efficiency"
              stroke="green"
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
        {/* <ResponsiveContainer width="100%">
          <LineChart data={graphData} margin={{ right: 100 }}>
            <CartesianGrid stroke="#000" strokeDasharray="5 5" />
            <XAxis
              dataKey="timeString"
              //interval={"preserveStartEnd"}
              interval={2}
              stroke="#000"
              style={{ fontSize: "1rem" }}
            >
              <Label value="Time" offset={0} position="insideBottom" />
            </XAxis>
            <YAxis
              stroke="#000"
              style={{ fontSize: "1rem" }}
              domain={[
                0,
                Math.round(
                  Math.max(...graphData.map((o) => o.efficiency)) + 10
                ),
              ]}
              // domain={[0, 150]}
              allowDataOverflow={true}
            >
              <Label
                value="Efficiency"
                offset={20}
                angle={-90}
                position="insideLeft"
              />
            </YAxis>

            <Tooltip wrapperStyle={{ fontSize: "1rem" }} itemStyle={{}} />
            <ReferenceLine
              y={100}
              label={{
                value: "100%",
                fontSize: "1rem",
                position: "right",
              }}
              stroke="red"
              strokeDasharray="5 5"
              strokeWidth={2}
            />
            <Line
              dataKey="efficiency"
              stroke="green"
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer> */}
      </div>
    </div>
  );
};
