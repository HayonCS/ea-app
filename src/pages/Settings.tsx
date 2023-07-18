import * as React from "react";
import { Box, Fab, Paper, Tab, Tabs, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SwipeableViews from "react-swipeable-views";
import { GeneralSettingsPanel } from "../modules/settings/General";
import { getUserDataFromRedis, saveUserDataToRedis } from "../utils/redis";
import { compareObjectArrays } from "../utils/DataUtility";
import { AssetsSettingsPanel } from "../modules/settings/Assets";
import { TeamSettingsPanel } from "../modules/settings/Team";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { AppState } from "../store/type";
import { Dispatch } from "redux";
import { updateTeamGentex, updateUserData } from "../store/actionCreators";
import { EmployeeInfoGentex, UserData } from "../utils/DataTypes";

const useStyles = makeStyles(() => ({
  app: {
    textAlign: "center",
  },
  paperStyle: {
    height: "calc(100vh - 48px)",
    display: "flex",
  },
  tabPaperStyle: {
    height: "calc(100vh - 112px)",
    width: "calc(100vw - 254px)",
    marginLeft: "4px",
    paddingTop: "64px",
  },
  tabBar: {
    flexGrow: 1,
    backgroundColor: "primary",
  },
  tabStyle: {
    fontWeight: "bolder",
    fontSize: "1rem",
  },
  tabIndicator: {
    height: "20px",
  },
}));

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
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
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export const Settings: React.FC<{}> = (props) => {
  document.title = "Settings";

  const classes = useStyles();

  const [tabValue, setTabValue] = React.useState(0);

  const [loadedRedux, setLoadedRedux] = React.useState(false);

  const currentUser = useSelector(
    (state: AppState) => state.currentUser,
    shallowEqual
  );

  const teamGentexRedux = useSelector(
    (state: AppState) => state.userTeamGentex,
    shallowEqual
  );
  const userDataRedux = useSelector(
    (state: AppState) => state.userData,
    shallowEqual
  );
  const dispatch: Dispatch<any> = useDispatch();
  const updateReduxTeamGentex = React.useCallback(
    (teamGentex: EmployeeInfoGentex[]) =>
      dispatch(updateTeamGentex(teamGentex)),
    [dispatch]
  );
  const updateReduxUserData = React.useCallback(
    (userData: UserData) => dispatch(updateUserData(userData)),
    [dispatch]
  );

  const [redisUserData, setRedisUserData] = React.useState<UserData>({
    orgCode: "0",
    assets: [],
    operators: [],
  });
  const [currentUserData, setCurrentUserData] = React.useState<UserData>({
    orgCode: "0",
    assets: [],
    operators: [],
  });
  const [currentTeamGentex, setCurrentTeamGentex] = React.useState<
    EmployeeInfoGentex[]
  >([]);

  const saveUserData = async () => {
    if (currentUser) {
      const result = await saveUserDataToRedis(currentUser, currentUserData);
      if (result) {
        setRedisUserData(currentUserData);
        updateReduxUserData(currentUserData);
        updateReduxTeamGentex(currentTeamGentex);
      }
    }
  };

  React.useEffect(() => {
    if (userDataRedux && !loadedRedux) {
      const data: UserData = {
        orgCode: "0",
        assets: [],
        operators: [],
      };
      setRedisUserData(userDataRedux ?? data);
      setCurrentUserData(userDataRedux ?? data);
      setLoadedRedux(true);
    } else if (currentUser) {
      const getUserData = async () => {
        const userData = await getUserDataFromRedis(currentUser);
        if (userData) {
          setRedisUserData(userData);
          setCurrentUserData(userData);
        } else {
          const data: UserData = {
            orgCode: "0",
            assets: [],
            operators: [],
          };
          setRedisUserData(data);
          setCurrentUserData(data);
        }
      };
      void getUserData();
    }
  }, [currentUser, userDataRedux, loadedRedux]);

  return (
    <div className={classes.app}>
      <Paper className={classes.paperStyle}>
        <Paper>
          <Paper
            style={{
              height: "60px",
              width: "250px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "default",
            }}
          >
            <Typography style={{ fontSize: "20px", fontWeight: "bolder" }}>
              {"SETTINGS PANEL"}
            </Typography>
          </Paper>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={tabValue}
            onChange={(event, value) => {
              setTabValue(value);
            }}
            sx={{ borderRight: 1, borderColor: "divider" }}
            classes={{ indicator: classes.tabIndicator }}
          >
            <Tab
              label={<Box className={classes.tabStyle}>{"General"}</Box>}
              {...a11yProps(0)}
            />
            <Tab
              label={<Box className={classes.tabStyle}>{"Team"}</Box>}
              {...a11yProps(1)}
            />
            <Tab
              label={<Box className={classes.tabStyle}>{"Assets"}</Box>}
              {...a11yProps(2)}
            />
          </Tabs>
          <div
            style={{
              height: "60px",
              width: "250px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "50px",
            }}
          >
            <Fab
              variant="extended"
              color="primary"
              disabled={compareObjectArrays(redisUserData, currentUserData)}
              onClick={() => {
                saveUserData();
              }}
            >
              <Typography style={{ fontSize: "18px", fontWeight: "500" }}>
                {"Save"}
              </Typography>
            </Fab>
          </div>
        </Paper>
        <SwipeableViews
          axis={"y"}
          index={tabValue}
          onChangeIndex={(index) => {
            setTabValue(index);
          }}
          containerStyle={{ width: "100%", height: "100%" }}
          slideStyle={{ width: "100%", height: "100%" }}
        >
          <TabPanel value={tabValue} index={0}>
            <Paper className={classes.tabPaperStyle}>
              <GeneralSettingsPanel
                orgCode={currentUserData.orgCode}
                onChange={(code) => {
                  setCurrentUserData({ ...currentUserData, orgCode: code });
                }}
              />
            </Paper>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Paper className={classes.tabPaperStyle}>
              <TeamSettingsPanel
                operators={currentUserData.operators}
                teamGentex={teamGentexRedux ?? []}
                onChange={(operators, teamGentex) => {
                  const userData = { ...currentUserData, operators: operators };
                  setCurrentUserData(userData);
                  setCurrentTeamGentex(teamGentex);
                }}
              />
            </Paper>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Paper className={classes.tabPaperStyle}>
              <AssetsSettingsPanel
                assets={currentUserData.assets}
                onChange={(assets) => {
                  setCurrentUserData({ ...currentUserData, assets: assets });
                }}
              />
            </Paper>
          </TabPanel>
        </SwipeableViews>
      </Paper>
    </div>
  );
};
