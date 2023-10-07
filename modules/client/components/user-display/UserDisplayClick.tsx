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
import { formatUserName, formatUserPhone } from "client/utils/DataUtility";
import { getEmployeeInfoGentex } from "client/utils/mes";
import { openInNewTab } from "client/utils/WebUtility";
import { EmployeeInfoGentex } from "client/utils/DataTypes";
import { useUserPicture } from "../hooks/UserPicture";
import { useUserInformation } from "../hooks/UserInformation";

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

export const UserDisplayClick: React.FC<{
  userId: string;
}> = (props) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // const [pictureUrl, setPictureUrl] = React.useState("");
  const userInfo = useUserInformation(props.userId);
  const pictureUrl = useUserPicture(props.userId);
  // const [userInfo, setUserInfo] = React.useState<EmployeeInfoGentex>();

  const formattedName = React.useMemo(() => {
    const formatName = formatUserName(
      userInfo !== "Error" && userInfo !== "Unknown" && userInfo !== "Loading"
        ? userInfo.firstName + "." + userInfo.lastName
        : "first.last"
    ).replace(/[0-9]/g, "");
    return userInfo !== "Error" &&
      userInfo !== "Loading" &&
      userInfo !== "Unknown" &&
      (userInfo.location === "Inactive" ||
        userInfo.jobTitle?.includes("Former"))
      ? `(${formatName})`
      : formatName;
  }, [userInfo]);

  // React.useEffect(() => {
  //   if (!userInfo) {
  //     const loadInfo = async () => {
  //       if (props.userId !== "-1") {
  //         const info = await getEmployeeInfoGentex(props.userId);
  //         if (info) {
  //           setUserInfo(info);
  //         }
  //       } else {
  //         const blank: EmployeeInfoGentex = {
  //           employeeNumber: "00000",
  //           firstName: "Loading",
  //           lastName: "",
  //           username: "unknown",
  //           email: "unknown@gentex.com",
  //           cellPhone: "+16167721800",
  //           workPhone: "",
  //           location: "Unknown",
  //           locationId: "",
  //           shift: "0",
  //           jobTitle: "unknown",
  //         };
  //         setUserInfo(blank);
  //       }
  //     };
  //     void loadInfo();
  //   }
  // }, [props, userInfo]);

  // React.useEffect(() => {
  //   if (userInfo) {
  //     setPictureUrl(
  //       `https://api.gentex.com/user/image/v1/${userInfo?.employeeNumber}`
  //     );
  //   } else {
  //     setPictureUrl(`https://api.gentex.com/user/image/v1/00000`);
  //   }
  // }, [userInfo]);

  return (
    <div className={classes.root}>
      <Button
        onClick={handleClick}
        style={{ width: "100%", margin: "0", padding: "0", color: "#000" }}
      >
        <div className={classes.button}>
          {userInfo ? (
            <Avatar
              alt={formattedName}
              src={pictureUrl}
              style={{ cursor: "pointer" }}
            />
          ) : (
            <Skeleton variant="circular" width={40} height={40} />
          )}

          {userInfo ? (
            <Typography
              variant="body1"
              className={classes.title}
              component={"span"}
            >
              <Box fontWeight="600" fontSize="14px">
                {formattedName.toUpperCase()}
              </Box>
            </Typography>
          ) : (
            <div className={classes.title}>
              <Skeleton width={150} height={20} />
            </div>
          )}
        </div>
      </Button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Paper style={{ padding: "12px 20px 12px 20px" }}>
          <div className={classes.userInfo}>
            <div
              style={{
                padding: "12px 12px 12px 0",
                borderRight: "2px solid rgba(0, 0, 0, 0.2)",
              }}
            >
              {userInfo ? (
                <Avatar
                  src={pictureUrl}
                  alt={formattedName}
                  style={{ width: "84px", height: "84px" }}
                />
              ) : (
                <Skeleton variant="circular" width={84} height={84} />
              )}
            </div>
            <Typography className={classes.userInfoDetails} component={"span"}>
              {userInfo !== "Error" &&
              userInfo !== "Loading" &&
              userInfo !== "Unknown" ? (
                <>
                  <div style={{ display: "flex" }}>
                    <Box fontWeight="600" fontSize="15px">
                      {formattedName}
                    </Box>
                    <Box fontWeight="500" fontSize="15px" marginLeft={1}>
                      {`(${userInfo.employeeId})`}
                    </Box>
                  </div>
                  {userInfo && (
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
                  )}
                  <Box fontWeight="600" fontSize="15px">
                    {userInfo ? userInfo.email : "unknown@gentex.com"}
                  </Box>
                </>
              ) : (
                <>
                  <div style={{ display: "flex" }}>
                    <Box fontWeight="600" fontSize="15px">
                      {formattedName}
                    </Box>
                    <Box fontWeight="500" fontSize="15px" marginLeft={1}>
                      {`(${props.userId})`}
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
                        {formatUserPhone("+16167721800")}
                      </Box>
                    </div>
                  )}
                  <Box fontWeight="600" fontSize="15px">
                    {"unknown@gentex.com"}
                  </Box>
                </>
              )}
            </Typography>
          </div>
          <div
            style={{
              paddingTop: "10px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={(event) => {
                openInNewTab(
                  `https://lumen.gentex.com/PROD/Person/${props.userId}`
                );
              }}
            >
              <Typography component={"span"}>
                <Box fontWeight="600" fontSize="12px">
                  {"Lumen"}
                </Box>
              </Typography>
            </Button>
          </div>
        </Paper>
      </Popover>
    </div>
  );
};
