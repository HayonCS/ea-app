import * as React from "react";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { Box, Link, Paper, Tab, Tabs, Typography } from "@mui/material";
import { Person, PrecisionManufacturing } from "@mui/icons-material";
import SwipeableViews from "react-swipeable-views";
import { useSelector } from "react-redux";
import { ASSETLIST } from "client/utilities/definitions";
import { Selectors } from "client/redux/selectors";
import { useGetAssetsRunningNowQuery } from "client/graphql/types.gen";
import { RunningNowItem } from "rest-endpoints/mes-process-data/mes-process-data";

const useStyles = makeStyles(() => ({
  app: {
    textAlign: "center",
  },
  appHeader: {
    backgroundColor: "#282c34",
    height: "100px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: "calc(10px + 2vmin)",
    color: "white",
  },
  linkStyle: {
    fontSize: "18px",
  },
  paperStyle: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    height: "calc(100vh - 148px)",
  },
  gridLayout: {
    display: "grid",
    rowGap: "20px",
    marginBottom: "30px",
  },
  tabBar: {
    flexGrow: 1,
    backgroundColor: "primary",
  },
  tabStyle: {
    fontWeight: "bolder",
    fontSize: "1rem",
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

export const DashboardPage: React.FC<{}> = () => {
  document.title = "Dashboard | EA App";

  const classes = useStyles();

  const navigate = useNavigate();

  const [tabValue, setTabValue] = React.useState(0);

  const currentUser = useSelector(Selectors.App.currentUserInfo);
  const userDataRedux = useSelector(Selectors.App.currentUserAppData);
  const assetListRedux = useSelector(Selectors.App.assetList);

  const [assetsRunningNow, setAssetsRunningNow] = React.useState<
    RunningNowItem[]
  >([]);

  const runningNowQuery = useGetAssetsRunningNowQuery({
    fetchPolicy: "cache-and-network",
  });

  React.useEffect(() => {
    if (
      runningNowQuery.called &&
      !runningNowQuery.loading &&
      !runningNowQuery.error &&
      runningNowQuery.data &&
      runningNowQuery.data.getAssetsRunningNow
    ) {
      let assets = runningNowQuery.data.getAssetsRunningNow;
      const date = new Date();
      assets = assets.filter(
        (x) => date.getTime() - new Date(x.LastRunTime).getTime() <= 600000
      );
      assets = assets.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.Asset === value.Asset)
      );
      setAssetsRunningNow(assets);
    }
  }, [runningNowQuery]);

  return (
    <div className={classes.app}>
      <header className={classes.appHeader}>
        <div style={{ cursor: "default", userSelect: "none" }}>
          <Typography style={{ fontSize: "36px", fontWeight: "bold" }}>
            {"DASHBOARDS"}
          </Typography>
        </div>
      </header>
      <Paper className={classes.paperStyle}>
        <div className={classes.gridLayout}>
          <Paper className={classes.tabBar}>
            <Tabs
              value={tabValue}
              onChange={(event, newValue) => {
                setTabValue(newValue);
              }}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab
                label={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    <PrecisionManufacturing style={{ marginRight: "4px" }} />
                    All Assets
                  </div>
                }
                className={classes.tabStyle}
                {...tabProps(0)}
              />
              <Tab
                label={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    <PrecisionManufacturing style={{ marginRight: "4px" }} />
                    Running Now
                  </div>
                }
                className={classes.tabStyle}
                {...tabProps(1)}
              />
              {currentUser.employeeId !== "" &&
                currentUser.employeeId !== "undefined" &&
                currentUser.employeeId !== "00000" && (
                  <Tab
                    label={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        <Person style={{ marginRight: "4px" }} />
                        My Assets
                      </div>
                    }
                    className={classes.tabStyle}
                    {...tabProps(2)}
                  />
                )}
            </Tabs>
          </Paper>
          <SwipeableViews
            axis={"x"}
            index={tabValue}
            onChangeIndex={(index) => {
              setTabValue(index);
            }}
          >
            <TabPanel value={tabValue} index={0}>
              <div style={{ height: "calc(100vh - 216px)" }}>
                <div style={{ height: "30px" }} />
                {assetListRedux
                  .sort((a, b) => a.assetName.localeCompare(b.assetName))
                  .map((asset, i) => {
                    return (
                      <Box key={i} className={classes.linkStyle}>
                        <Link
                          onClick={() => {
                            navigate(`/dashboard/${asset}`);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {asset.assetName}
                        </Link>
                      </Box>
                    );
                  })}
                <div style={{ height: "30px" }} />
              </div>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <div style={{ height: "calc(100vh - 216px)" }}>
                <div style={{ height: "30px" }} />
                {[...assetsRunningNow]
                  .sort((a, b) => a.Asset.localeCompare(b.Asset))
                  .map((item, i) => {
                    return (
                      <Box key={i} className={classes.linkStyle}>
                        <Link
                          onClick={() => {
                            navigate(`/dashboard/${item.Asset}`);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {item.Asset}
                        </Link>
                      </Box>
                    );
                  })}
                <div style={{ height: "30px" }} />
              </div>
            </TabPanel>
            {currentUser.employeeId !== "" &&
              currentUser.employeeId !== "undefined" &&
              currentUser.employeeId !== "00000" && (
                <TabPanel value={tabValue} index={2}>
                  <div style={{ height: "calc(100vh - 216px)" }}>
                    <div style={{ height: "30px" }} />
                    {[...(userDataRedux?.assetList ?? [])]
                      .sort((a, b) => a.localeCompare(b))
                      .map((asset, i) => {
                        return (
                          <Box key={i} className={classes.linkStyle}>
                            <Link
                              onClick={() => {
                                navigate(`/dashboard/${asset}`);
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              {asset}
                            </Link>
                          </Box>
                        );
                      })}
                    <div style={{ height: "30px" }} />
                  </div>
                </TabPanel>
              )}
          </SwipeableViews>
        </div>
      </Paper>
    </div>
  );
};
