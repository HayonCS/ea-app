import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Link,
  Button,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  Build,
  Close,
  Dashboard,
  Equalizer,
  Home,
  Info,
  Menu,
} from "@mui/icons-material";
import { Chevron } from "../icons/Chevron";
import { GentexLogo } from "../icons/GentexLogo";
import { GentexBlue } from "../styles/theme";
import { CurrentUserDisplay } from "./CurrentUserDisplay";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserInfoGentex, getEmployeeInfoGentex } from "../utils/mes";
import { AppState } from "../store/type";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  removeAlert,
  setAssetList,
  setCurrentUser,
  setEmployeeDirectory,
  updateTeamGentex,
  updateUserData,
  updateUserGentex,
} from "../store/actionCreators";
import { Dispatch } from "redux";
import {
  getAssetListRedis,
  getEmployeeDirectoryRedis,
  getUserDataFromRedis,
} from "../utils/redis";
import { USER_COOKIE_NAME } from "../definitions";
import { AlertType, EmployeeInfoGentex, UserData } from "../utils/DataTypes";
import { SnackbarProvider, enqueueSnackbar } from "notistack";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    color: "#FFF",
    backgroundColor: GentexBlue,
    zIndex: 999,
    textAlign: "center",
  },
  appBar: {
    zIndex: 999,
    height: "48px",
    justifyContent: "center",
  },
  appBarLink: {
    fontSize: "16px !important",
    color: "#FFF !important",
    marginRight: "30px !important",
    cursor: "pointer !important",
  },
  menuButton: {
    marginRight: 1,
  },
  logo: {
    fontSize: "150px",
    marginLeft: "16px",
    marginRight: "8px",
    scale: "1.3",
  },
  chevron: {
    fontSize: 20,
    marginLeft: "8px",
    marginRight: "8px",
    scale: "0.8",
  },
  logoDrawer: {
    fontSize: "150px",
    marginLeft: "16px",
    marginRight: "8px",
    scale: "1.5",
  },
  menuPanel: {
    backgroundColor: GentexBlue + " !important",
    color: "#FFF !important",
    height: "100%",
  },
}));

export const MenuBar: React.FC<{}> = (props) => {
  const classes = useStyles();

  const navigate = useNavigate();
  const location = useLocation();

  const alertsRedux = useSelector(
    (state: AppState) => state.alerts,
    shallowEqual
  );
  const assetListRedux = useSelector(
    (state: AppState) => state.assetList,
    shallowEqual
  );
  const userGentexRedux = useSelector(
    (state: AppState) => state.userGentex,
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
  const currentUser = useSelector(
    (state: AppState) => state.currentUser,
    shallowEqual
  );

  const dispatch: Dispatch<any> = useDispatch();
  const removeAlertRedux = React.useCallback(
    (alert: AlertType) => dispatch(removeAlert(alert)),
    [dispatch]
  );
  const setAssetListRedux = React.useCallback(
    (assetList: string[]) => dispatch(setAssetList(assetList)),
    [dispatch]
  );
  const updateReduxUserGentex = React.useCallback(
    (userGentex: EmployeeInfoGentex) => dispatch(updateUserGentex(userGentex)),
    [dispatch]
  );
  const updateReduxTeamGentex = React.useCallback(
    (teamGentex: EmployeeInfoGentex[]) =>
      dispatch(updateTeamGentex(teamGentex)),
    [dispatch]
  );
  const updateReduxUserData = React.useCallback(
    (userData: UserData) => dispatch(updateUserData(userData)),
    [dispatch]
  );
  const setCurrentUserRedux = React.useCallback(
    (user: string) => dispatch(setCurrentUser(user)),
    [dispatch]
  );
  const setEmployeeDirectoryRedux = React.useCallback(
    (employeeDirectory: EmployeeInfoGentex[]) =>
      dispatch(setEmployeeDirectory(employeeDirectory)),
    [dispatch]
  );

  const [drawerState, setDrawerState] = React.useState(false);

  const [closeHoverState, setCloseHoverState] = React.useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      if (
        (event as React.MouseEvent).clientX <= 250 &&
        ((event as React.MouseEvent).clientY > 240 ||
          (event as React.MouseEvent).clientY < 52)
      ) {
        return;
      }

      setDrawerState(open);
    };

  const [alerts, setAlerts] = React.useState<AlertType[]>([]);

  React.useEffect(() => {
    if (alertsRedux && alertsRedux.length > alerts.length) {
      alertsRedux.forEach((alert, i) => {
        if (i >= alerts.length) {
          enqueueSnackbar(alert.message, {
            variant: alert.severity,
            autoHideDuration: alert.timeout ?? 5000,
            onClose: () => {
              let newAlerts = [...alerts];
              newAlerts.splice(newAlerts.indexOf(alert), 1);
              setAlerts(newAlerts);
              removeAlertRedux(alert);
            },
          });
          //setAlerts([...alerts, alert]);
        }
      });
      setAlerts(alertsRedux);
    }
  }, [alerts, alertsRedux, removeAlertRedux]);

  React.useEffect(() => {
    const user = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(`${USER_COOKIE_NAME}=`))
      ?.split("=")[1];
    const route = location.pathname;
    if (user) {
      setCurrentUserRedux(user);
    } else if (!route.includes("Login") && !route.includes("Dashboard")) {
      navigate("/Login");
    }
  }, [navigate, location, setCurrentUserRedux]);

  const [loadedRedux, setLoadedRedux] = React.useState(false);

  React.useEffect(() => {
    if (!loadedRedux) {
      if (userGentexRedux || teamGentexRedux || userDataRedux) {
        setLoadedRedux(true);
      } else {
        const loadInfo = async () => {
          const assetList = await getAssetListRedis();
          if (assetList) {
            setAssetListRedux(assetList);
          }
          if (currentUser) {
            const userGentex = await getUserInfoGentex(currentUser);
            const userData = await getUserDataFromRedis(currentUser);
            const employeeData = await getEmployeeDirectoryRedis();
            if (userGentex) {
              const employeeInfo = await getEmployeeInfoGentex(
                userGentex.employeeId
              );
              if (employeeInfo) {
                updateReduxUserGentex(employeeInfo);
              }
            }
            if (userData) {
              updateReduxUserData(userData);
              let teamGentex: EmployeeInfoGentex[] = [];
              for (let i = 0; i < userData.operators.length; ++i) {
                const info = await getEmployeeInfoGentex(userData.operators[i]);
                if (info) teamGentex.push(info);
              }
              teamGentex = teamGentex.sort((a, b) =>
                a.employeeNumber.localeCompare(b.employeeNumber)
              );
              updateReduxTeamGentex(teamGentex);
            }
            if (employeeData) {
              setEmployeeDirectoryRedux(employeeData);
            }
          }
        };
        void loadInfo();
      }
    }
  }, [
    assetListRedux,
    userGentexRedux,
    teamGentexRedux,
    userDataRedux,
    currentUser,
    loadedRedux,
    updateReduxUserGentex,
    updateReduxUserData,
    updateReduxTeamGentex,
    setAssetListRedux,
    setEmployeeDirectoryRedux,
  ]);

  return (
    <div className={classes.root}>
      <SnackbarProvider
        maxSnack={5}
        preventDuplicate={true}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
      <AppBar position="static" color="transparent" className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => {
              setDrawerState(true);
            }}
          >
            <Menu />
          </IconButton>
          <div
            style={{
              margin: "0 12px",
              cursor: "pointer",
            }}
            onClick={() => {
              navigate("/");
            }}
          >
            <GentexLogo className={classes.logo} data-testid="gentexLogo" />
          </div>
          <Chevron className={classes.chevron} data-testid="logoSeparator" />
          <Typography
            variant="body1"
            component={"span"}
            style={{ flexGrow: 1, textAlign: "left" }}
          >
            <Box
              fontWeight="normal"
              fontSize="18px"
              style={{
                cursor: "default",
                userSelect: "none",
                display: "flex",
              }}
            >
              {"EA APP"}
              {/* <HomeOutlined style={{ color: "#FFF", paddingLeft: "8px" }} /> */}
            </Box>
          </Typography>

          <div style={{ marginTop: "-4px" }}>
            <Link
              className={classes.appBarLink}
              onClick={() => {
                navigate("/");
              }}
            >
              Home
            </Link>
            <Link
              className={classes.appBarLink}
              onClick={() => {
                navigate("/Stats");
              }}
            >
              Statistics
            </Link>
            <Link
              className={classes.appBarLink}
              onClick={() => {
                navigate("/Dashboard");
              }}
            >
              Dashboard
            </Link>
            <Link
              className={classes.appBarLink}
              onClick={() => {
                navigate("/Resources");
              }}
            >
              Resources
            </Link>
            <Link
              className={classes.appBarLink}
              onClick={() => {
                navigate("/About");
              }}
            >
              About
            </Link>
          </div>
          <div style={{}}>
            {currentUser && currentUser !== "unknown" ? (
              <CurrentUserDisplay userName={currentUser} />
            ) : (
              <Button
                variant="text"
                onClick={() => {
                  navigate("/Login");
                }}
              >
                <Typography component={"span"}>
                  <Box fontWeight="600" fontSize="16px" color="white">
                    {"LOGIN"}
                  </Box>
                </Typography>
              </Button>
            )}
          </div>
        </Toolbar>

        <React.Fragment>
          <Drawer
            anchor={"left"}
            open={drawerState}
            onClose={toggleDrawer(false)}
          >
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
              className={classes.menuPanel}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "4px",
                }}
              >
                <div
                  style={{
                    width: "159px",
                    margin: "8px 8px 8px 30px",
                  }}
                >
                  <GentexLogo
                    className={classes.logoDrawer}
                    data-testid="gentexLogoDrawer"
                  />
                </div>
                <IconButton
                  aria-label="Close"
                  style={
                    closeHoverState
                      ? { color: "rgba(255, 255, 255, 0.8)" }
                      : { color: "rgba(255, 255, 255, 0.3)" }
                  }
                  onMouseEnter={() => {
                    setCloseHoverState(true);
                  }}
                  onMouseLeave={() => {
                    setCloseHoverState(false);
                  }}
                  onClick={() => {
                    setDrawerState(false);
                  }}
                >
                  <Close />
                </IconButton>
              </div>

              <List>
                <ListItem disablePadding={true}>
                  <ListItemButton
                    style={{ display: "flex", alignItems: "center" }}
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    <ListItemIcon style={{ color: "#FFF" }}>
                      <Home />
                    </ListItemIcon>
                    <Typography
                      style={{ fontSize: "18px", fontWeight: "bold" }}
                    >
                      Home Page
                    </Typography>
                  </ListItemButton>
                </ListItem>
              </List>
              <Divider style={{ backgroundColor: "#FFF" }} />
              <List>
                <ListItem disablePadding={true}>
                  <ListItemButton
                    style={{ display: "flex", alignItems: "center" }}
                    onClick={() => {
                      navigate("/Stats");
                    }}
                  >
                    <ListItemIcon style={{ color: "#FFF" }}>
                      <Equalizer />
                    </ListItemIcon>
                    <Typography
                      style={{ fontSize: "18px", fontWeight: "bold" }}
                    >
                      Statistics
                    </Typography>
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding={true}>
                  <ListItemButton
                    style={{ display: "flex", alignItems: "center" }}
                    onClick={() => {
                      navigate("/Dashboard");
                    }}
                  >
                    <ListItemIcon style={{ color: "#FFF" }}>
                      <Dashboard />
                    </ListItemIcon>
                    <Typography
                      style={{ fontSize: "18px", fontWeight: "bold" }}
                    >
                      Dashboard
                    </Typography>
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding={true}>
                  <ListItemButton
                    style={{ display: "flex", alignItems: "center" }}
                    onClick={() => {
                      navigate("/Resources");
                    }}
                  >
                    <ListItemIcon style={{ color: "#FFF" }}>
                      <Build />
                    </ListItemIcon>
                    <Typography
                      style={{ fontSize: "18px", fontWeight: "bold" }}
                    >
                      Resources
                    </Typography>
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding={true}>
                  <ListItemButton
                    style={{ display: "flex", alignItems: "center" }}
                    onClick={() => {
                      navigate("/About");
                    }}
                  >
                    <ListItemIcon style={{ color: "#FFF" }}>
                      <Info />
                    </ListItemIcon>
                    <Typography
                      style={{ fontSize: "18px", fontWeight: "bold" }}
                    >
                      About
                    </Typography>
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </Drawer>
        </React.Fragment>
      </AppBar>
    </div>
  );
};
