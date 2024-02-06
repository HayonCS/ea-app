import * as React from "react";
import { Avatar, Box, Button, Paper, Popover, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { formatUserName, formatUserPhone } from "client/user-utils";
import { UserInformation } from "core/schemas/user-information.gen";
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
    height: "100%",
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
  userInfo: string | UserInformation;
  nameFont?: { fontWeight: string | number; fontSize: string | number };
  picSize?: string | number;
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
  >(typeof props.userInfo === "string" ? undefined : props.userInfo);

  const userInfoHook = useUserInformation(
    typeof props.userInfo === "string" ? props.userInfo : ""
  );

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
    if (typeof props.userInfo !== "string") {
      handleGoodPicture(props.userInfo.employeeId);
      setUserInformation(props.userInfo);
    }
  }, [props.userInfo]);

  return (
    <div className={classes.root}>
      <Button
        onClick={handleClick}
        style={{
          width: "100%",
          height: "100%",
          margin: "0",
          padding: "0",
          color: "#000",
        }}
        sx={{ textTransform: "none" }}
      >
        <div className={classes.button}>
          <Avatar
            alt={formattedName}
            src={pictureUrl}
            imgProps={{ onError: handleBadPicture }}
            style={{
              cursor: "pointer",
              width: props.picSize ? props.picSize : "40px",
              height: props.picSize ? props.picSize : "40px",
            }}
          />
          <Typography
            variant="body1"
            className={classes.title}
            component={"span"}
          >
            <Box
              style={
                props.nameFont
                  ? props.nameFont
                  : {
                      fontWeight: "500",
                      fontSize: "14px",
                    }
              }
            >
              {formattedName}
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
              {userInformation && (
                <div>
                  <div style={{ display: "flex" }}>
                    <Box fontWeight="600" fontSize="15px">
                      {formattedName}
                    </Box>
                    <Box fontWeight="500" fontSize="15px" marginLeft={1}>
                      {`(${userInformation.employeeId})`}
                    </Box>
                  </div>
                  <div>
                    <Box fontWeight="600" fontSize="15px">
                      {userInformation.location}
                    </Box>
                    <Box fontWeight="600" fontSize="15px">
                      {userInformation.jobTitle}
                    </Box>
                    {userInformation?.cellPhone && (
                      <Box fontWeight="600" fontSize="15px">
                        {formatUserPhone(userInformation.cellPhone)}
                      </Box>
                    )}
                  </div>
                  <Box fontWeight="600" fontSize="15px">
                    {userInformation.email}
                  </Box>
                </div>
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
