import * as React from "react";
import { Box, Fab, Paper, Tab, Tabs, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SwipeableViews from "react-swipeable-views";
import { GeneralSettingsPanel } from "./General";
import { compareObjectArrays } from "client/utilities/process-data";
import { AssetsSettingsPanel } from "./Assets";
import { TeamSettingsPanel } from "./Team";
import { useSelector, useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { enqueueSnackbar } from "notistack";
import { Selectors } from "client/redux/selectors";
import { Actions } from "client/redux/actions";
import { UserInformation } from "core/schemas/user-information.gen";
import { UserAppData } from "core/schemas/user-app-data.gen";
import { useSetUserAppDataMutation } from "client/graphql/types.gen";

const useStyles = makeStyles(() => ({
  app: {
    textAlign: "center",
  },
  paperStyle: {
    height: "calc(100vh - 48px)",
    display: "flex",
  },
  tabPaperStyle: {
    height: "calc(100vh - 48px)",
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

  const comboAssetData = useSelector(Selectors.ComboData.assetData);
  const processAssetData = useSelector(Selectors.ProcessData.assetData);

  const currentUser = useSelector(Selectors.App.currentUserInfo);
  const userAppDataRedux = useSelector(Selectors.App.currentUserAppData);
  const employeeDirectoryRedux = useSelector(
    Selectors.App.employeeActiveDirectory
  );

  const dispatch = useDispatch<Dispatch<Actions>>();
  const updateReduxUserData = React.useCallback(
    (userData: UserAppData) =>
      dispatch(Actions.App.currentUserAppData(userData)),
    [dispatch]
  );

  const [redisUserData, setRedisUserData] = React.useState<UserAppData>({
    orgCode: 0,
    assetList: [],
    operators: [],
  });
  const [currentUserData, setCurrentUserData] = React.useState<UserAppData>({
    orgCode: 0,
    assetList: [],
    operators: [],
  });
  const [assetsTotal, setAssetsTotal] = React.useState<string[]>([]);

  const [setUserAppData] = useSetUserAppDataMutation();

  const saveUserData = async () => {
    if (
      currentUser &&
      currentUser.employeeId !== "" &&
      currentUser.employeeId !== "00000"
    ) {
      try {
        const saveResponse = await setUserAppData({
          variables: {
            userId: currentUser.employeeId,
            appData: currentUserData,
          },
        });
        if (
          saveResponse &&
          saveResponse.data &&
          saveResponse.data.setUserAppData
        ) {
          setRedisUserData(currentUserData);
          updateReduxUserData(currentUserData);
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
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  React.useEffect(() => {
    const comboAssets = comboAssetData.map((x) => x.Asset);
    const processAssets = processAssetData.map((x) => x.Asset);
    let totalAssets = [...comboAssets, ...processAssets];
    totalAssets = totalAssets.sort((a, b) => a.localeCompare(b));
    setAssetsTotal(totalAssets);
  }, [comboAssetData, processAssetData]);

  React.useEffect(() => {
    if (userAppDataRedux && !loadedRedux) {
      setRedisUserData(userAppDataRedux);
      setCurrentUserData(userAppDataRedux);
      setLoadedRedux(true);
    }
  }, [userAppDataRedux, loadedRedux]);

  // React.useEffect(() => {
  //   if (userAppDataRedux && !loadedRedux) {
  //     const data: UserAppData = {
  //       orgCode: 0,
  //       assetList: [],
  //       teamIds: [],
  //     };
  //     setRedisUserData(userAppDataRedux ?? data);
  //     setCurrentUserData(userAppDataRedux ?? data);
  //     setLoadedRedux(true);
  //   } else if (currentUser) {
  //     const getUserData = async () => {
  //       const userData = await getUserDataFromRedis(currentUser);
  //       if (userData) {
  //         setRedisUserData(userData);
  //         setCurrentUserData(userData);
  //       } else {
  //         const data: UserAppData = {
  //           orgCode: 0,
  //           assetList: [],
  //           teamIds: [],
  //         };
  //         setRedisUserData(data);
  //         setCurrentUserData(data);
  //       }
  //     };
  //     void getUserData();
  //   }
  // }, [currentUser, userAppDataRedux, loadedRedux]);

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
          <TabPanel value={tabValue} index={0} style={{ height: "100%" }}>
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
                // employeeDirectory={employeeDirectoryRedux}
                onChange={(operators) => {
                  const userData = { ...currentUserData, operators: operators };
                  setCurrentUserData(userData);
                }}
              />
            </Paper>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Paper className={classes.tabPaperStyle}>
              <AssetsSettingsPanel
                totalAssets={assetsTotal}
                userAssets={currentUserData.assetList}
                onChange={(assets) => {
                  const sortedAssets = assets.sort((a, b) =>
                    a.localeCompare(b)
                  );
                  setCurrentUserData({
                    ...currentUserData,
                    assetList: sortedAssets,
                  });
                }}
              />
            </Paper>
          </TabPanel>
        </SwipeableViews>
      </Paper>
    </div>
  );
};
