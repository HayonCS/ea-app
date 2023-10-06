import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Paper,
  Popover,
  Skeleton,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { formatUserName, formatUserPhone } from "client/utilities/DataUtility";
// import { EmployeeInfoGentex } from "client/utilities/DataTypes";
// import { useSelector } from "react-redux";
import { USER_COOKIE_NAME } from "client/utilities/definitions";
import { enqueueSnackbar } from "notistack";
// import { Selectors } from "client/redux/selectors";
import { useUserInformation } from "../hooks/UserInformation";
import { useUserPicture } from "../hooks/UserPicture";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Actions } from "client/redux/actions";
import { UserInformation } from "core/schemas/user-information.gen";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  title: {
    flexGrow: 1,
    textAlign: "left",
    cursor: "pointer",
    paddingLeft: "10px",
    paddingRight: "12px",
  },
  button: {
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
  },
  userInfoDetails: {
    flexGrow: 1,
    textAlign: "left",
    cursor: "default",
    paddingLeft: "10px",
  },
}));

export const CurrentUserDisplay: React.FC<{
  username: string;
}> = (props) => {
  const classes = useStyles();

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [username, setUsername] = React.useState(props.username);

  const userInfo = useUserInformation(username);
  const pictureUrl = useUserPicture(
    userInfo !== "Loading" && userInfo !== "Error" && userInfo !== "Unknown"
      ? userInfo.employeeId
      : ""
  );

  const currentUser = React.useMemo(() => {
    return props.username.trim().toLowerCase();
  }, [props]);

  const formattedName = React.useMemo(() => {
    return formatUserName(currentUser).replace(/[0-9]/g, "");
  }, [currentUser]);

  const dispatch = useDispatch<Dispatch<Actions>>();
  const clearCurrentUser = React.useCallback(
    () => dispatch(Actions.App.clearCurrentUser()),
    [dispatch]
  );

  // const [pictureUrl, setPictureUrl] = React.useState("");
  // const [userInfo, setUserInfo] = React.useState<EmployeeInfoGentex>();

  // const userGentexRedux = useSelector(Selectors.App.userGentexInfo);

  // React.useEffect(() => {
  //   if (userGentexRedux) {
  //     setPictureUrl(
  //       `https://api.gentex.com/user/image/v1/${userGentexRedux.employeeNumber}`
  //     );
  //     setUserInfo(userGentexRedux);
  //   }
  // }, [userGentexRedux]);

  const handleLogout = () => {
    document.cookie = `${USER_COOKIE_NAME}=;`;
    setUsername("");
    clearCurrentUser();
    enqueueSnackbar("You are now logged out of the app.", {
      variant: "info",
      autoHideDuration: 4000,
    });
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className={classes.root}>
      <div className={classes.button} onClick={handleClick}>
        {userInfo !== "Error" &&
        userInfo !== "Loading" &&
        userInfo !== "Unknown" ? (
          <Avatar
            alt={formattedName}
            src={pictureUrl}
            style={{ cursor: "pointer" }}
          />
        ) : (
          <Skeleton variant="circular" width={40} height={40} />
        )}

        <Typography
          variant="body1"
          className={classes.title}
          component={"span"}
        >
          <Box fontWeight="600" fontSize="14px">
            {formattedName.toUpperCase()}
          </Box>
        </Typography>
      </div>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {userInfo !== "Loading" &&
        userInfo !== "Error" &&
        userInfo !== "Unknown" ? (
          <Paper style={{ padding: "12px 20px 12px 20px" }}>
            <div className={classes.userInfo}>
              <div
                style={{
                  padding: "12px 12px 12px 0",
                  borderRight: "2px solid rgba(0, 0, 0, 0.2)",
                }}
              >
                <Avatar
                  src={pictureUrl}
                  alt={formattedName}
                  style={{ width: "84px", height: "84px" }}
                />
              </div>
              <Typography
                className={classes.userInfoDetails}
                component={"span"}
              >
                <div style={{ display: "flex" }}>
                  <Box fontWeight="600" fontSize="15px">
                    {formattedName}
                  </Box>
                  <Box fontWeight="500" fontSize="15px" marginLeft={1}>
                    {`(${userInfo.employeeId})`}
                  </Box>
                </div>
                <div>
                  <Box fontWeight="600" fontSize="15px">
                    {userInfo.location}
                  </Box>
                  <Box fontWeight="600" fontSize="15px">
                    {userInfo.jobTitle}
                  </Box>
                  <Box fontWeight="600" fontSize="15px">
                    {formatUserPhone(userInfo.cellPhone)}
                  </Box>
                </div>
                <Box fontWeight="600" fontSize="15px">
                  {userInfo.email}
                </Box>
              </Typography>
            </div>
            <div
              style={{
                paddingTop: "10px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="contained"
                style={{ backgroundColor: "#000" }}
                onClick={() => {
                  handleClose();
                  navigate("/settings");
                }}
              >
                <Typography component={"span"}>
                  <Box fontWeight="600" fontSize="10px">
                    {"Settings"}
                  </Box>
                </Typography>
              </Button>
              <Button
                variant="text"
                color="primary"
                style={{ position: "absolute", right: 6 }}
                onClick={() => {
                  handleLogout();
                }}
              >
                <Typography component={"span"}>
                  <Box fontWeight="600" fontSize="10px">
                    {"Logout"}
                  </Box>
                </Typography>
              </Button>
            </div>
          </Paper>
        ) : (
          <Paper style={{ padding: "12px 20px 12px 20px" }}>
            <div className={classes.userInfo}>
              <div
                style={{
                  padding: "12px 12px 12px 0",
                  borderRight: "2px solid rgba(0, 0, 0, 0.2)",
                }}
              >
                <Skeleton variant="circular" width={84} height={84} />
              </div>
              <Typography
                className={classes.userInfoDetails}
                component={"span"}
              >
                <div style={{ display: "flex" }}>
                  <Box fontWeight="600" fontSize="15px">
                    {formattedName}
                  </Box>
                  <Box fontWeight="500" fontSize="15px" marginLeft={1}>
                    {`(00000)`}
                  </Box>
                </div>
                {userInfo && (
                  <div>
                    <Box fontWeight="600" fontSize="15px">
                      {"Unknown"}
                    </Box>
                    <Box fontWeight="600" fontSize="15px">
                      {"Inactive"}
                    </Box>
                    <Box fontWeight="600" fontSize="15px">
                      {formatUserPhone("6167721800")}
                    </Box>
                  </div>
                )}
                <Box fontWeight="600" fontSize="15px">
                  {"combo@gentex.com"}
                </Box>
              </Typography>
            </div>
            <div
              style={{
                paddingTop: "10px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {/* <Button
                  variant="contained"
                  style={{ backgroundColor: "#000" }}
                  onClick={(event) => {
                    handleClose();
                    navigate("/Settings");
                  }}
                >
                  <Typography component={"span"}>
                    <Box fontWeight="600" fontSize="10px">
                      {"Settings"}
                    </Box>
                  </Typography>
                </Button>
                <Button
                  variant="text"
                  color="primary"
                  style={{ position: "absolute", right: 6 }}
                  onClick={(event) => {
                    handleLogout();
                  }}
                >
                  <Typography component={"span"}>
                    <Box fontWeight="600" fontSize="10px">
                      {"Logout"}
                    </Box>
                  </Typography>
                </Button> */}
            </div>
          </Paper>
        )}
      </Popover>
    </div>
  );
};
