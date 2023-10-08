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
import { Chevron } from "client/icons/Chevron";
import { GentexLogo } from "client/icons/GentexLogo";
import { GentexBlue } from "client/styles/app-theme";
import { CurrentUserDisplay } from "client/components/user-display/CurrentUserDisplay";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { USER_COOKIE_NAME } from "client/utilities/definitions";
import { SnackbarProvider } from "notistack";
import { Selectors } from "client/redux/selectors";
import { Actions } from "client/redux/actions";
import { useUserInformation } from "../hooks/UserInformation";
import { UserInformation } from "core/schemas/user-information.gen";
import { UserAppData } from "core/schemas/user-app-data.gen";
import { getAssetList } from "domain-services/assets-bi/assets-bi";
import { getUserAppData } from "domain-services/user-app-data/user-app-data";
import { getUserInformation } from "client/user-utils";
import {
  useGetAssetListBiQuery,
  useGetEmployeeDirectoryQuery,
  useGetUserAppDataQuery,
} from "client/graphql/types.gen";

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

export const AppBarMenu: React.FC<{}> = () => {
  const classes = useStyles();

  const navigate = useNavigate();
  const location = useLocation();

  // const assetListRedux = useSelector(Selectors.App.assetList);
  const currentUserRedux = useSelector(Selectors.App.currentUserInfo);
  // const currentUserTeamRedux = useSelector(Selectors.App.currentUserTeamInfo);
  // const currentUserAppDataRedux = useSelector(Selectors.App.currentUserAppData);

  const dispatch = useDispatch<Dispatch<Actions>>();
  const setAssetListRedux = React.useCallback(
    (assetList: string[]) => dispatch(Actions.App.assetList(assetList)),
    [dispatch]
  );
  const setCurrentUserRedux = React.useCallback(
    (userInfo: UserInformation) =>
      dispatch(Actions.App.currentUserInfo(userInfo)),
    [dispatch]
  );
  const setCurrentUserTeamRedux = React.useCallback(
    (teamInfo: UserInformation[]) =>
      dispatch(Actions.App.currentUserTeamInfo(teamInfo)),
    [dispatch]
  );
  const setCurrentUserAppDataRedux = React.useCallback(
    (userData: UserAppData) =>
      dispatch(Actions.App.currentUserAppData(userData)),
    [dispatch]
  );
  const setEmployeeDirectoryRedux = React.useCallback(
    (employeeDirectory: UserInformation[]) =>
      dispatch(Actions.App.employeeActiveDirectory(employeeDirectory)),
    [dispatch]
  );

  const [username, setUsername] = React.useState<string>();

  const userInfo = useUserInformation(username ?? "");

  const assetList = useGetAssetListBiQuery({
    // skip:
    //   userInfo === "Error" || userInfo === "Loading" || userInfo === "Unknown",
    // skip: location.pathname.includes("login"),
    fetchPolicy: "cache-and-network",
  });

  const employeeDirectory = useGetEmployeeDirectoryQuery({
    fetchPolicy: "cache-and-network",
  });

  const userAppData = useGetUserAppDataQuery({
    variables: {
      userId:
        userInfo !== "Error" && userInfo !== "Loading" && userInfo !== "Unknown"
          ? userInfo.employeeId
          : "",
    },
    skip:
      userInfo === "Error" || userInfo === "Loading" || userInfo === "Unknown",
    fetchPolicy: "cache-and-network",
  });

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
          (event as React.MouseEvent).clientY < 56)
      ) {
        return;
      }

      setDrawerState(open);
    };

  React.useEffect(() => {
    const user = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(`${USER_COOKIE_NAME}=`))
      ?.split("=")[1];
    if (user && user !== "undefined") {
      setUsername(user);
    } else {
      setUsername("");
    }
  });

  React.useEffect(() => {
    if (
      userInfo !== "Loading" &&
      userInfo !== "Error" &&
      userInfo !== "Unknown"
    ) {
      setCurrentUserRedux(userInfo);
    }
  }, [setCurrentUserRedux, userInfo]);

  React.useEffect(() => {
    if (
      assetList &&
      assetList.called &&
      !assetList.loading &&
      assetList.data &&
      assetList.data.assetListBi &&
      assetList.data.assetListBi.length > 0
    ) {
      const assetsFilter = assetList.data.assetListBi.map(
        (x) => x?.assetName ?? ""
      );
      const assets: string[] = assetsFilter.filter((x) => x);
      setAssetListRedux(assets);
    }
  }, [assetList, setAssetListRedux]);

  React.useEffect(() => {
    if (
      userInfo !== "Error" &&
      userInfo !== "Loading" &&
      userInfo !== "Unknown"
    ) {
      if (
        userAppData &&
        userAppData.called &&
        !userAppData.loading &&
        userAppData.data &&
        userAppData.data.getUserAppData
      ) {
        if (userAppData.data.getUserAppData.orgCode !== 0) {
          setCurrentUserAppDataRedux(userAppData.data.getUserAppData);
          // void (async () => {
          //   let teamInfo: UserInformation[] = [];
          //   for (let member of userAppData.data?.getUserAppData.operators ??
          //     []) {
          //     const info = await getUserInformation(member);
          //     if (info) teamInfo.push(info);
          //     console.log(`Got Info: ${JSON.stringify(info)}`);
          //   }
          //   teamInfo = teamInfo.sort((a, b) =>
          //     a.employeeId.localeCompare(b.employeeId)
          //   );
          //   setCurrentUserTeamRedux(teamInfo);
          // })();
        }
      }
    }
  }, [
    setCurrentUserAppDataRedux,
    setCurrentUserTeamRedux,
    userAppData,
    userInfo,
  ]);

  React.useEffect(() => {
    if (
      employeeDirectory &&
      employeeDirectory.called &&
      !employeeDirectory.loading &&
      employeeDirectory.data &&
      employeeDirectory.data.employeeDirectory &&
      employeeDirectory.data.employeeDirectory.length > 0
    ) {
      let employees: UserInformation[] = [];
      for (
        let i = 0;
        i < employeeDirectory.data.employeeDirectory.length;
        ++i
      ) {
        const emp = employeeDirectory.data.employeeDirectory[i];
        employees.push({
          employeeId: emp.employeeNumber,
          firstName: emp.firstName,
          lastName: emp.lastName,
          username: emp.username ?? "",
          email: emp.email,
          cellPhone: emp.cellPhone,
          workPhone: emp.workPhone,
          location: emp.location,
          locationId: emp.locationId,
          shift: emp.shift,
          jobTitle: emp.jobTitle,
          managerEmployeeId: emp.managerEmployeeNumber,
          level: emp.level,
          erphrLocation: {
            locationId: emp.erphrLocation.locationId ?? 0,
            locationCode: emp.erphrLocation.locationCode ?? "",
            description: emp.erphrLocation.description ?? "",
            inventoryOrgCode: emp.erphrLocation.inventoryOrgCode ?? 0,
            inventoryOrgId: emp.erphrLocation.inventoryOrgId ?? 0,
          },
          isManager: emp.isManager,
          status: emp.status,
          salaryType: emp.salaryType,
          employeeType: emp.employeeType,
          personType: emp.personType,
          payGroup: emp.payGroup,
          preferredLocale: emp.preferredLocale,
          preferredDisplayLang: emp.preferredDisplayLang,
          preferredCurrency: emp.preferredCurrency,
          primaryTimezone: emp.primaryTimezone,
          fullTime: emp.fullTime,
          partTime: emp.partTime,
          roles: [],
          distributionLists: [],
          isServiceAccount: false,
          pager: "",
        });
      }
      setEmployeeDirectoryRedux(employees);
    }
  }, [employeeDirectory, setEmployeeDirectoryRedux]);

  return (
    <div className={classes.root}>
      <SnackbarProvider
        maxSnack={6}
        // preventDuplicate={true}
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
              margin: "4px 12px 0",
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

          <div>
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
                navigate("/statistics");
              }}
            >
              Statistics
            </Link>
            <Link
              className={classes.appBarLink}
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Dashboard
            </Link>
            <Link
              className={classes.appBarLink}
              onClick={() => {
                navigate("/resources");
              }}
            >
              Resources
            </Link>
            <Link
              className={classes.appBarLink}
              onClick={() => {
                navigate("/about");
              }}
            >
              About
            </Link>
          </div>
          <div style={{}}>
            {userInfo !== "Error" &&
            userInfo !== "Loading" &&
            userInfo !== "Unknown" ? (
              <CurrentUserDisplay username={username ?? ""} />
            ) : (
              <Button
                variant="text"
                onClick={() => {
                  navigate("/login");
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
                    margin: "12px 8px 8px 30px",
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
                      navigate("/statistics");
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
                      navigate("/dashboard");
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
                      navigate("/resources");
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
                      navigate("/about");
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
