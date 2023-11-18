import * as React from "react";
import { Avatar, Box, Button, Paper, Popover, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { formatUserName, formatUserPhone } from "client/user-utils";
import { UserInformation } from "core/schemas/user-information.gen";
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

const openInNewTab = (url: string) => {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};

export const UserDisplayClick: React.FC<{
  employeeId?: string;
  userInfo?: UserInformation;
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

  const [pictureUrl, setPictureUrl] = React.useState("");

  const [userInformation, setUserInformation] = React.useState<
    UserInformation | undefined
  >(props.userInfo);

  const userPicture = useUserPicture(
    props.userInfo?.employeeId ?? props.employeeId ?? ""
  );
  const userInfoHook = useUserInformation(
    props.userInfo ? "" : props.employeeId ?? ""
  );

  const handleBadPicture = () => {
    setPictureUrl(
      `https://lumen.gentex.com/InnovatorImage/images/customer/employee/0000${
        props.userInfo?.employeeId ?? props.employeeId ?? ""
      }.jpg`
    );
  };

  const formattedName = React.useMemo(() => {
    const formatName = formatUserName(
      userInformation?.firstName + "." + userInformation?.lastName
    ).replace(/[0-9]/g, "");
    return userInformation?.location === "Inactive" ||
      userInformation?.jobTitle.includes("Former")
      ? `(${formatName})`
      : formatName;
  }, [props, userInformation]);

  React.useEffect(() => {
    if (userPicture !== "Error" && userPicture !== "Loading") {
      setPictureUrl(userPicture);
    }
  }, [userPicture]);

  React.useEffect(() => {
    if (props.userInfo) {
      setUserInformation(props.userInfo);
    } else if (
      userInfoHook !== "Error" &&
      userInfoHook !== "Loading" &&
      userInfoHook !== "Unknown"
    ) {
      setUserInformation(userInfoHook);
    } else if (userInfoHook === "Unknown") {
      console.log("UNKNOWN USER");
    }
  }, [props, userInfoHook]);

  return (
    <div className={classes.root}>
      <Button
        onClick={handleClick}
        style={{ width: "100%", margin: "0", padding: "0", color: "#000" }}
      >
        <div className={classes.button}>
          <Avatar
            alt={formattedName}
            src={pictureUrl}
            imgProps={{ onError: handleBadPicture }}
            style={{ cursor: "pointer" }}
          />
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
              <Avatar
                src={pictureUrl}
                alt={formattedName}
                imgProps={{ onError: handleBadPicture }}
                style={{ width: "84px", height: "84px" }}
              />
            </div>
            <Typography className={classes.userInfoDetails} component={"span"}>
              <div style={{ display: "flex" }}>
                <Box fontWeight="600" fontSize="15px">
                  {formattedName}
                </Box>
                <Box fontWeight="500" fontSize="15px" marginLeft={1}>
                  {`(${userInformation?.employeeId})`}
                </Box>
              </div>
              <div>
                <Box fontWeight="600" fontSize="15px">
                  {userInformation?.location}
                </Box>
                <Box fontWeight="600" fontSize="15px">
                  {userInformation?.jobTitle}
                </Box>
                {userInformation?.cellPhone && (
                  <Box fontWeight="600" fontSize="15px">
                    {formatUserPhone(userInformation?.cellPhone)}
                  </Box>
                )}
              </div>
              <Box fontWeight="600" fontSize="15px">
                {userInformation?.email}
              </Box>
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
              onClick={() => {
                openInNewTab(
                  `https://lumen.gentex.com/PROD/Person/${userInformation?.employeeId}`
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
