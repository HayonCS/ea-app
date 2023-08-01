import * as React from "react";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { Box, Fab, Link, Paper, Tab, Tabs, Typography } from "@mui/material";
import {
  Dashboard,
  Equalizer,
  Person,
  PrecisionManufacturing,
} from "@mui/icons-material";
import SwipeableViews from "react-swipeable-views";
import { Resources } from "../modules/Resources";
import { About } from "../modules/About";
import { shallowEqual, useSelector } from "react-redux";
import { AppState } from "../store/type";
import { ASSETLIST } from "../definitions";

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

export const DashboardPage: React.FC<{}> = (props) => {
  document.title = "Dashboard | EA App";

  const classes = useStyles();

  const navigate = useNavigate();

  const [tabValue, setTabValue] = React.useState(0);

  const userDataRedux = useSelector(
    (state: AppState) => state.userData,
    shallowEqual
  );
  const assetListRedux = useSelector(
    (state: AppState) => state.assetList,
    shallowEqual
  );

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
                    <Person style={{ marginRight: "4px" }} />
                    My Assets
                  </div>
                }
                className={classes.tabStyle}
                {...tabProps(1)}
              />
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
                {(assetListRedux ?? ASSETLIST)
                  .sort((a, b) => a.localeCompare(b))
                  .map((asset, i) => {
                    return (
                      <Box key={i} className={classes.linkStyle}>
                        <Link
                          onClick={() => {
                            navigate(`/Dashboard/${asset}`);
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
            <TabPanel value={tabValue} index={1}>
              <div style={{ height: "calc(100vh - 216px)" }}>
                <div style={{ height: "30px" }} />
                {(userDataRedux?.assets ?? [])
                  .sort((a, b) => a.localeCompare(b))
                  .map((asset, i) => {
                    return (
                      <Box key={i} className={classes.linkStyle}>
                        <Link
                          onClick={() => {
                            navigate(`/Dashboard/${asset}`);
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
          </SwipeableViews>
        </div>
      </Paper>
    </div>
  );
};
