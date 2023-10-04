import * as React from "react";
import { Box, Fab, Paper, Tab, Tabs, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SwipeableViews from "react-swipeable-views";
import { GeneralSettingsPanel } from "./General";
import {
  getUserDataFromRedis,
  saveUserDataToRedis,
} from "client/utilities/redis";
import { compareObjectArrays } from "client/utilities/DataUtility";
import { AssetsSettingsPanel } from "./Assets";
import { TeamSettingsPanel } from "./Team";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { enqueueSnackbar } from "notistack";
import { Selectors } from "client/redux/selectors";
import { Actions } from "client/redux/actions";
import { UserInformation } from "core/schemas/user-information.gen";
import { UserAppData } from "core/schemas/user-app-data.gen";

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

export const Settings: React.FC<{}> = () => {
  document.title = "Settings";

  const classes = useStyles();

  const [tabValue, setTabValue] = React.useState(0);

  const [loadedRedux, setLoadedRedux] = React.useState(false);

  const currentUser = useSelector(Selectors.Authentication.currentUserName);

  const teamGentexRedux = useSelector(Selectors.App.currentUserTeamInfo);
  const userDataRedux = useSelector(Selectors.App.currentUserAppData);
  const employeeDirectoryRedux = useSelector(
    Selectors.App.employeeActiveDirectory
  );

  const dispatch = useDispatch<Dispatch<Actions>>();
  const updateReduxTeamGentex = React.useCallback(
    (teamGentex: UserInformation[]) =>
      dispatch(Actions.App.currentUserTeamInfo(teamGentex)),
    [dispatch]
  );
  const updateReduxUserData = React.useCallback(
    (userData: UserAppData) =>
      dispatch(Actions.App.currentUserAppData(userData)),
    [dispatch]
  );

  const [redisUserData, setRedisUserData] = React.useState<UserAppData>({
    orgCode: 0,
    assetList: [],
    teamIds: [],
  });
  const [currentUserData, setCurrentUserData] = React.useState<UserAppData>({
    orgCode: 0,
    assetList: [],
    teamIds: [],
  });
  const [currentTeamGentex, setCurrentTeamGentex] = React.useState<
    UserInformation[]
  >([]);

  const saveUserData = async () => {
    if (currentUser) {
      const result = await saveUserDataToRedis(currentUser, currentUserData);
      if (result) {
        setRedisUserData(currentUserData);
        updateReduxUserData(currentUserData);
        updateReduxTeamGentex(currentTeamGentex);
        enqueueSnackbar("Saved user settings successfully!", {
          variant: "success",
          autoHideDuration: 7000,
        });
      } else {
        enqueueSnackbar("Failed to save user settings!", {
          variant: "error",
          autoHideDuration: 7000,
        });
      }
    }
  };

  React.useEffect(() => {
    if (userDataRedux && !loadedRedux) {
      const data: UserAppData = {
        orgCode: 0,
        assetList: [],
        teamIds: [],
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
          const data: UserAppData = {
            orgCode: 0,
            assetList: [],
            teamIds: [],
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
              {...tabProps(0)}
            />
            <Tab
              label={<Box className={classes.tabStyle}>{"Team"}</Box>}
              {...tabProps(1)}
            />
            <Tab
              label={<Box className={classes.tabStyle}>{"Assets"}</Box>}
              {...tabProps(2)}
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
                void saveUserData();
              }}
            >
              <Typography style={{ fontSize: "18px", fontWeight: "bold" }}>
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
                operators={currentUserData.teamIds}
                teamGentex={teamGentexRedux}
                employeeDirectory={employeeDirectoryRedux}
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
                assets={currentUserData.assetList}
                onChange={(assets) => {
                  setCurrentUserData({ ...currentUserData, assetList: assets });
                }}
              />
            </Paper>
          </TabPanel>
        </SwipeableViews>
      </Paper>
    </div>
  );
};
