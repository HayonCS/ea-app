import * as React from "react";
import { Avatar, Box, Button, Paper, Popover, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { formatUserName, formatUserPhone } from "client/user-utils";
import { UserInformation } from "core/schemas/user-information.gen";
import { useUserInformation } from "../hooks/UserInformation";
import { StatsDataOperatorRow } from "client/utilities/webdc-data";
import { getHHMMSS } from "client/utilities/date-util";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  title: {
    flexGrow: 1,
    textAlign: "left",
    cursor: "default",
    paddingLeft: "10px",
    paddingRight: "12px",
  },
  button: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    margin: "1px",
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

const openInNewTab = (url: string) => {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};

export const LeaderboardOperatorDisplay: React.FC<{
  operatorData: StatsDataOperatorRow;
  rank: number;
}> = (props) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [pictureUrl, setPictureUrl] = React.useState("");

  const [userInformation, setUserInformation] =
    React.useState<UserInformation>();

  const userInfoHook = useUserInformation(props.operatorData.Operator);

  const handleGoodPicture = (userId: string) => {
    setPictureUrl(`https://api.gentex.com/user/image/v1/${userId}`);
  };
  const handleBadPicture = () => {
    setPictureUrl(
      `https://lumen.gentex.com/InnovatorImage/images/customer/employee/0000${
        userInformation?.employeeId ?? ""
      }.jpg`
    );
  };

  const formattedName = React.useMemo(() => {
    const formatName = formatUserName(
      userInformation
        ? userInformation.firstName + "." + userInformation.lastName
        : "-"
    ).replace(/[0-9]/g, "");
    return userInformation?.location.toLowerCase() === "inactive" ||
      userInformation?.jobTitle.toLowerCase().includes("former")
      ? `(${formatName})`
      : formatName;
  }, [userInformation]);

  React.useEffect(() => {
    if (
      userInfoHook !== "Error" &&
      userInfoHook !== "Loading" &&
      userInfoHook !== "Unknown"
    ) {
      setUserInformation(userInfoHook);
      handleGoodPicture(userInfoHook.employeeId);
    }
  }, [userInfoHook]);

  React.useEffect(() => {
    handleGoodPicture(props.operatorData.Operator);
  }, [props]);

  return (
    <div className={classes.root}>
      <div
        className={classes.button}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        style={{
          backgroundColor:
            props.operatorData.Efficiency >= 95
              ? "rgb(0, 200, 0)"
              : props.operatorData.Efficiency >= 85
              ? "orange"
              : "red",
        }}
      >
        <Typography
          style={{
            alignSelf: "center",
            fontSize: "16px",
            fontWeight: "500",
            color: "#000",
            width: "30px",
          }}
        >
          {props.rank}
        </Typography>
        <Avatar
          alt={formattedName}
          src={pictureUrl}
          imgProps={{ onError: handleBadPicture }}
          style={{ cursor: "default" }}
        />
        <Typography
          variant="body1"
          className={classes.title}
          component={"span"}
          style={{ color: "#000" }}
        >
          <Box fontWeight="500" fontSize="16px">
            {userInformation?.firstName ?? "-"}
          </Box>
        </Typography>
        <Typography
          style={{
            alignSelf: "center",
            textAlign: "right",
            fontSize: "16px",
            fontWeight: "500",
            color: "#000",
            paddingRight: "8px",
          }}
        >
          {(Math.round(props.operatorData.Efficiency * 100) / 100).toFixed(2) +
            "%"}
        </Typography>
      </div>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        disableRestoreFocus={true}
        sx={{ pointerEvents: "none" }}
      >
        <Paper style={{ padding: "12px 20px 12px 20px" }}>
          <div className={classes.userInfo}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "160px",
                padding: "12px 12px 12px 0",
                borderRight: "2px solid rgba(0, 0, 0, 0.2)",
              }}
            >
              <Avatar
                src={pictureUrl}
                alt={formattedName}
                imgProps={{ onError: handleBadPicture }}
                style={{ width: "84px", height: "84px" }}
              />
            </div>
            <Typography className={classes.userInfoDetails} component={"span"}>
              {userInformation && (
                <div>
                  <div style={{ display: "flex" }}>
                    <Box fontWeight="600" fontSize="16px">
                      {formattedName}
                    </Box>
                    <Box fontWeight="500" fontSize="16px" marginLeft={1}>
                      {`(${userInformation.employeeId})`}
                    </Box>
                  </div>
                </div>
              )}
              <div style={{ display: "flex" }}>
                <Box fontWeight="500" fontSize="16px">
                  {"Efficiency: "}
                </Box>
                <Box
                  fontWeight="600"
                  fontSize="16px"
                  marginLeft={1}
                  style={{
                    color:
                      props.operatorData.Efficiency >= 95
                        ? "rgb(0, 200, 0)"
                        : props.operatorData.Efficiency >= 85
                        ? "orange"
                        : "red",
                  }}
                >
                  {(
                    Math.round(props.operatorData.Efficiency * 100) / 100
                  ).toFixed(2) + "%"}
                </Box>
              </div>
              <div style={{ display: "flex" }}>
                <Box fontWeight="500" fontSize="16px">
                  {"Expected Hours: "}
                </Box>
                <Box
                  fontWeight="600"
                  fontSize="16px"
                  marginLeft={1}
                  style={{ color: "#003D6E" }}
                >
                  {getHHMMSS(props.operatorData.RunTheory)}
                </Box>
              </div>
              <div style={{ display: "flex" }}>
                <Box fontWeight="500" fontSize="16px">
                  {"Actual Hours: "}
                </Box>
                <Box
                  fontWeight="600"
                  fontSize="16px"
                  marginLeft={1}
                  style={{
                    color:
                      props.operatorData.Efficiency >= 95
                        ? "rgb(0, 200, 0)"
                        : props.operatorData.Efficiency >= 85
                        ? "orange"
                        : "red",
                  }}
                >
                  {getHHMMSS(props.operatorData.RunActual)}
                </Box>
              </div>
              <div style={{ display: "flex" }}>
                <Box fontWeight="500" fontSize="16px">
                  {"Parts Per Hour: "}
                </Box>
                <Box
                  fontWeight="600"
                  fontSize="16px"
                  marginLeft={1}
                  style={{ color: "#003D6E" }}
                >
                  {(
                    Math.round(props.operatorData.PartsPerHour * 100) / 100
                  ).toFixed(2)}
                </Box>
              </div>
              <div style={{ display: "flex" }}>
                <Box fontWeight="500" fontSize="16px">
                  {"Parts Passed: "}
                </Box>
                <Box
                  fontWeight="600"
                  fontSize="16px"
                  marginLeft={1}
                  style={{ color: "#003D6E" }}
                >
                  {props.operatorData.Passes}
                </Box>
              </div>
              <div style={{ display: "flex" }}>
                <Box fontWeight="500" fontSize="16px">
                  {"Parts Failed: "}
                </Box>
                <Box
                  fontWeight="600"
                  fontSize="16px"
                  marginLeft={1}
                  style={{ color: "#003D6E" }}
                >
                  {props.operatorData.Fails}
                </Box>
              </div>
              <div style={{ display: "flex" }}>
                <Box fontWeight="500" fontSize="16px">
                  {"Part Number(s): "}
                </Box>
                <Box
                  fontWeight="600"
                  fontSize="16px"
                  marginLeft={1}
                  style={{ color: "#003D6E" }}
                >
                  {props.operatorData.PartNumber.split(",")
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .join(", ")}
                </Box>
              </div>
            </Typography>
          </div>
        </Paper>
      </Popover>
    </div>
  );
};
