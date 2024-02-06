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
  Construction,
  Dashboard,
  Equalizer,
  Home,
  Info,
  Menu,
} from "@mui/icons-material";
import { Chevron } from "client/icons/Chevron";
import { GentexLogo } from "client/icons/GentexLogo";
import { GentexBlue } from "client/styles/app-theme";
import { CurrentUserDisplay } from "client/components/info-display/CurrentUserDisplay";
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
  useGetComboAssetDataQuery,
  useGetAssetListBiQuery,
  useGetEmployeeDirectoryQuery,
  useGetComboPartDataQuery,
  useGetUserAppDataQuery,
  useGetProcessPartDataQuery,
  useGetProcessAssetDataQuery,
  useGetCycleTimesLineOperationPartQuery,
  useGetBomRoutingsLazyQuery,
  useGetAllBomRoutingsQuery,
  useGetLineConfigurationsAllQuery,
} from "client/graphql/types.gen";
import { AssetRow, PnRow } from "records/combodata";
import {
  AssetInfo,
  LineConfiguration,
  LineOperationPart,
} from "rest-endpoints/mes-bi/mes-bi";
import { BomRouting } from "rest-endpoints/mes-bom/mes-bom";

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
    userSelect: "none",
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
  // const currentUserRedux = useSelector(Selectors.App.currentUserInfo);
  // const currentUserTeamRedux = useSelector(Selectors.App.currentUserTeamInfo);
  // const currentUserAppDataRedux = useSelector(Selectors.App.currentUserAppData);
  // const comboPartDataRedux = useSelector(Selectors.ComboData.partData);
  // const processPartDataRedux = useSelector(Selectors.ProcessData.partData);
  const comboAssetDataRedux = useSelector(Selectors.ComboData.assetData);
  const processAssetDataRedux = useSelector(Selectors.ProcessData.assetData);
  const authenticatedUser = useSelector(
    Selectors.Authentication.currentUserName
  );

  const dispatch = useDispatch<Dispatch<Actions>>();
  const setComboPartDataRedux = React.useCallback(
    (partData: PnRow[]) => dispatch(Actions.ComboData.partData(partData)),
    [dispatch]
  );
  const setComboAssetDataRedux = React.useCallback(
    (assetData: AssetRow[]) => dispatch(Actions.ComboData.assetData(assetData)),
    [dispatch]
  );
  const setProcessPartDataRedux = React.useCallback(
    (partData: PnRow[]) => dispatch(Actions.ProcessData.partData(partData)),
    [dispatch]
  );
  const setProcessAssetDataRedux = React.useCallback(
    (assetData: AssetRow[]) =>
      dispatch(Actions.ProcessData.assetData(assetData)),
    [dispatch]
  );

  const setAssetListRedux = React.useCallback(
    (assetList: AssetInfo[]) => dispatch(Actions.App.assetList(assetList)),
    [dispatch]
  );
  const setCycleTimeRedux = React.useCallback(
    (cycleTimeInfo: LineOperationPart[]) =>
      dispatch(Actions.App.cycleTimeInfo(cycleTimeInfo)),
    [dispatch]
  );
  const setBomRoutingsRedux = React.useCallback(
    (bomRoutings: BomRouting[]) =>
      dispatch(Actions.App.bomRoutings(bomRoutings)),
    [dispatch]
  );
  const setLineConfigurationsRedux = React.useCallback(
    (lineConfigurations: LineConfiguration[]) =>
      dispatch(Actions.App.lineConfigurations(lineConfigurations)),
    [dispatch]
  );
  const setCurrentUserRedux = React.useCallback(
    (userInfo: UserInformation) =>
      dispatch(Actions.App.currentUserInfo(userInfo)),
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

  const userInfo = useUserInformation(authenticatedUser);

  const comboPartQuery = useGetComboPartDataQuery({
    fetchPolicy: "cache-and-network",
  });
  const comboAssetQuery = useGetComboAssetDataQuery({
    fetchPolicy: "cache-and-network",
  });
  const processPartQuery = useGetProcessPartDataQuery({
    fetchPolicy: "cache-and-network",
  });
  const processAssetQuery = useGetProcessAssetDataQuery({
    fetchPolicy: "cache-and-network",
  });

  const assetListQuery = useGetAssetListBiQuery({
    fetchPolicy: "cache-and-network",
  });
  const cycleTimeQuery = useGetCycleTimesLineOperationPartQuery({
    fetchPolicy: "cache-and-network",
  });
  const bomRoutingsQuery = useGetAllBomRoutingsQuery({
    fetchPolicy: "cache-and-network",
  });
  const lineConfigurationsQuery = useGetLineConfigurationsAllQuery({
    fetchPolicy: "cache-and-network",
  });

  const employeeDirectoryQuery = useGetEmployeeDirectoryQuery({
    fetchPolicy: "cache-and-network",
  });
  const userAppDataQuery = useGetUserAppDataQuery({
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
    if (
      comboPartQuery &&
      comboPartQuery.called &&
      !comboPartQuery.error &&
      !comboPartQuery.loading &&
      comboPartQuery.data &&
      comboPartQuery.data.comboPartData &&
      comboPartQuery.data.comboPartData.length > 0
    ) {
      let partData = comboPartQuery.data.comboPartData;
      partData = partData.filter(
        (x) =>
          !x.PartNumber.includes("I") &&
          !x.PartNumber.includes("E") &&
          !x.PartNumber.includes("U") &&
          !x.PartNumber.includes("A") &&
          !x.PartNumber.includes("L") &&
          !x.PartNumber.includes("0000")
      );
      setComboPartDataRedux(partData);
    }
  }, [comboPartQuery]);

  React.useEffect(() => {
    if (
      comboAssetQuery &&
      comboAssetQuery.called &&
      !comboAssetQuery.error &&
      !comboAssetQuery.loading &&
      comboAssetQuery.data &&
      comboAssetQuery.data.comboAssetData &&
      comboAssetQuery.data.comboAssetData.length > 0
    ) {
      // setComboAssetDataRedux(comboAssetData.data.comboAssetData);
      let assetData = comboAssetQuery.data.comboAssetData;
      assetData = assetData.filter(
        (x) =>
          x.Asset.startsWith("C") ||
          x.Asset.startsWith("I") ||
          x.Asset.startsWith("M")
      );
      setComboAssetDataRedux(assetData);
    }
  }, [comboAssetQuery]);

  React.useEffect(() => {
    if (
      processPartQuery &&
      processPartQuery.called &&
      !processPartQuery.error &&
      !processPartQuery.loading &&
      processPartQuery.data &&
      processPartQuery.data.processPartData &&
      processPartQuery.data.processPartData.length > 0
    ) {
      let partData = processPartQuery.data.processPartData;
      partData = partData.filter(
        (x) =>
          !x.PartNumber.includes("I") &&
          !x.PartNumber.includes("E") &&
          !x.PartNumber.includes("U") &&
          !x.PartNumber.includes("A") &&
          !x.PartNumber.includes("L") &&
          !x.PartNumber.includes("0000")
      );
      setProcessPartDataRedux(partData);
    }
  }, [processPartQuery]);

  React.useEffect(() => {
    if (
      processAssetQuery &&
      processAssetQuery.called &&
      !processAssetQuery.error &&
      !processAssetQuery.loading &&
      processAssetQuery.data &&
      processAssetQuery.data.processAssetData &&
      processAssetQuery.data.processAssetData.length > 0
    ) {
      // setProcessAssetDataRedux(processAssetData.data.processAssetData);
      let assetData = processAssetQuery.data.processAssetData;
      assetData = assetData.filter((x) => x.Asset.startsWith("PCB"));
      setProcessAssetDataRedux(assetData);
    }
  }, [processAssetQuery]);

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
      assetListQuery &&
      assetListQuery.called &&
      !assetListQuery.loading &&
      assetListQuery.data &&
      assetListQuery.data.assetListBi &&
      assetListQuery.data.assetListBi.length > 0
    ) {
      let assetsMap: AssetInfo[] = assetListQuery.data.assetListBi.map((x) => {
        const asset: AssetInfo = {
          assetName: x?.assetName ?? "",
          serial: x?.serial ?? "",
          model: x?.model ?? "",
          orgCode: x?.orgCode ?? "0",
          line: x?.line ?? "",
          dateCreated: x?.dateCreated ?? "",
          notes: x?.notes ?? "",
          reportGroupName: x?.reportGroupName ?? "",
          reportGroupID: x?.reportGroupID ?? "",
          excludeFromHealth: x?.excludeFromHealth ?? false,
          legacyLocation: x?.legacyLocation ?? "",
          autoUpdate: x?.autoUpdate ?? false,
          recordLastUpdated: x?.recordLastUpdated ?? "",
          updatedBy: x?.updatedBy ?? "",
        };
        return asset;
      });
      // let assetsBi = assetsMap.filter(
      //   (x) =>
      //     (x &&
      //       x.assetName !== "" &&
      //       (x.assetName.startsWith("C") ||
      //         x.assetName.startsWith("MR") ||
      //         x.assetName.startsWith("PCB"))) ||
      //     x.assetName.startsWith("I")
      // );
      let assetsBi = assetsMap.filter(
        (x) =>
          comboAssetDataRedux.some((a) => a.Asset === x.assetName) ||
          processAssetDataRedux.some((a) => a.Asset === x.assetName)
      );
      assetsBi = assetsBi.sort(
        (a, b) => a?.assetName.localeCompare(b?.assetName ?? "") ?? 0
      );
      setAssetListRedux(assetsBi);
    }
  }, [assetListQuery, comboAssetDataRedux, processAssetDataRedux]);

  React.useEffect(() => {
    if (
      cycleTimeQuery &&
      cycleTimeQuery.called &&
      !cycleTimeQuery.loading &&
      !cycleTimeQuery.error &&
      cycleTimeQuery.data &&
      cycleTimeQuery.data.cycleTimesLineOperationPart &&
      cycleTimeQuery.data.cycleTimesLineOperationPart.length > 0
    ) {
      let cyclesMap: LineOperationPart[] =
        cycleTimeQuery.data.cycleTimesLineOperationPart.map((x) => {
          const cycle: LineOperationPart = {
            orgCode: x.orgCode,
            line: x.line,
            partNumber: x.partNumber,
            partNumberAsset: x.partNumberAsset ?? null,
            ebsOperation: x.ebsOperation,
            averageCycleTime: x.averageCycleTime,
            minimumRepeatable: x.minimumRepeatable,
            historicalReferenceUsageRate:
              x.historicalReferenceUsageRate ?? null,
            autoUpdate: x.autoUpdate,
            recordLastUpdated: x.recordLastUpdated,
            updatedBy: x.updatedBy,
            comments: x.comments ?? null,
          };
          return cycle;
        });
      cyclesMap = cyclesMap.sort((a, b) =>
        a.partNumber.localeCompare(b.partNumber)
      );
      setCycleTimeRedux(cyclesMap);
    }
  }, [cycleTimeQuery, setCycleTimeRedux]);

  React.useEffect(() => {
    if (
      userInfo !== "Error" &&
      userInfo !== "Loading" &&
      userInfo !== "Unknown"
    ) {
      if (
        userAppDataQuery &&
        userAppDataQuery.called &&
        !userAppDataQuery.loading &&
        userAppDataQuery.data &&
        userAppDataQuery.data.getUserAppData
      ) {
        setCurrentUserAppDataRedux(userAppDataQuery.data.getUserAppData);
      }
    }
  }, [setCurrentUserAppDataRedux, userAppDataQuery, userInfo]);

  React.useEffect(() => {
    if (
      employeeDirectoryQuery &&
      employeeDirectoryQuery.called &&
      !employeeDirectoryQuery.loading &&
      employeeDirectoryQuery.data &&
      employeeDirectoryQuery.data.employeeDirectory &&
      employeeDirectoryQuery.data.employeeDirectory.length > 0
    ) {
      let employees: UserInformation[] = [];
      for (
        let i = 0;
        i < employeeDirectoryQuery.data.employeeDirectory.length;
        ++i
      ) {
        const emp = employeeDirectoryQuery.data.employeeDirectory[i];
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
  }, [employeeDirectoryQuery, setEmployeeDirectoryRedux]);

  React.useEffect(() => {
    if (
      bomRoutingsQuery.called &&
      !bomRoutingsQuery.loading &&
      !bomRoutingsQuery.error &&
      bomRoutingsQuery.data
    ) {
      setBomRoutingsRedux(bomRoutingsQuery.data.getAllBomRoutings);
    }
  }, [bomRoutingsQuery]);

  React.useEffect(() => {
    if (
      lineConfigurationsQuery.called &&
      !lineConfigurationsQuery.loading &&
      !lineConfigurationsQuery.error &&
      lineConfigurationsQuery.data
    ) {
      setLineConfigurationsRedux(
        lineConfigurationsQuery.data.getLineConfigurationsAll
      );
    }
  }, [lineConfigurationsQuery]);

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
              {"EA PERFORMANCE (BETA)"}
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
              <CurrentUserDisplay username={authenticatedUser} />
            ) : (
              <Button
                variant="text"
                onClick={() => {
                  navigate("/login");
                }}
              >
                <Typography component={"span"}>
                  <Box fontWeight="500" fontSize="16px" color="white">
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
                    <Typography style={{ fontSize: "18px", fontWeight: "500" }}>
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
                    <Typography style={{ fontSize: "18px", fontWeight: "500" }}>
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
                    <Typography style={{ fontSize: "18px", fontWeight: "500" }}>
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
                      <Construction />
                    </ListItemIcon>
                    <Typography style={{ fontSize: "18px", fontWeight: "500" }}>
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
                    <Typography style={{ fontSize: "18px", fontWeight: "500" }}>
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
