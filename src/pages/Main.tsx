import * as React from "react";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { Fab, Paper, Tab, Tabs, Typography } from "@mui/material";
import { Build, Dashboard, Equalizer, Home, Info } from "@mui/icons-material";
import SwipeableViews from "react-swipeable-views";
import { Resources } from "../modules/Resources";
import { About } from "../modules/About";

const useStyles = makeStyles(() => ({
  app: {
    textAlign: "center",
  },
  appHeader: {
    backgroundColor: "#282c34",
    height: "144px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: "calc(10px + 2vmin)",
    color: "white",
  },
  paperStyle: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    height: "calc(100vh - 192px)",
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

export const Main: React.FC<{
  tabIndex?: number;
}> = (props) => {
  document.title = "EA App";

  const classes = useStyles();

  const navigate = useNavigate();

  const [tabValue, setTabValue] = React.useState(props.tabIndex ?? 0);

  return (
    <div className={classes.app}>
      <header className={classes.appHeader}>
        <div style={{ cursor: "default", userSelect: "none" }}>
          <Typography style={{ fontSize: "48px", fontWeight: "bold" }}>
            {"EA APP"}
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
                    <Home style={{ marginRight: "4px" }} />
                    Home
                  </div>
                }
                className={classes.tabStyle}
                {...a11yProps(0)}
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
                    <Build style={{ marginRight: "4px" }} />
                    Resources
                  </div>
                }
                className={classes.tabStyle}
                {...a11yProps(1)}
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
                    <Info style={{ marginRight: "4px" }} />
                    About
                  </div>
                }
                className={classes.tabStyle}
                {...a11yProps(2)}
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
              <div style={{ height: "calc(100vh - 260px)" }}>
                <div style={{ height: "30px" }} />
                <Typography
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    cursor: "default",
                    userSelect: "none",
                  }}
                >
                  {"Welcome to EA!"}
                </Typography>
                <div style={{ height: "60px" }} />
                <Fab
                  variant="extended"
                  color="primary"
                  style={{ transform: "scale(1.25)" }}
                  onClick={() => {
                    navigate("/Stats");
                  }}
                >
                  <Equalizer style={{ paddingRight: "8px" }} />
                  {"STATISTICS"}
                </Fab>
                <div style={{ height: "70px" }} />
                <Fab
                  variant="extended"
                  color="primary"
                  style={{ transform: "scale(1.25)" }}
                  onClick={() => {
                    navigate("/Dashboard");
                  }}
                >
                  <Dashboard style={{ paddingRight: "8px" }} />
                  {"DASHBOARD"}
                </Fab>
              </div>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Resources />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <About />
            </TabPanel>
          </SwipeableViews>
        </div>
      </Paper>
    </div>
  );
};
