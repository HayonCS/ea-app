import * as React from "react";
import { Avatar, Box, Paper, Popover, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { formatUserName, formatUserPhone } from "../utils/DataUtility";
import { EmployeeInfoGentex } from "../utils/DataTypes";

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
    // width: "180px",
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

export const UserDisplayHover: React.FC<{
  userInfo: EmployeeInfoGentex;
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

  const formattedName = React.useMemo(() => {
    const formatName = formatUserName(
      props.userInfo.firstName + "." + props.userInfo.lastName
    ).replace(/[0-9]/g, "");
    return props.userInfo.location === "Inactive" ||
      props.userInfo.jobTitle?.includes("Former")
      ? `(${formatName})`
      : formatName;
  }, [props]);

  React.useEffect(() => {
    if (props.userInfo) {
      setPictureUrl(
        `https://api.gentex.com/user/image/v1/${props.userInfo.employeeNumber}`
      );
    } else {
      setPictureUrl("");
    }
  }, [props]);

  return (
    <div className={classes.root}>
      <div
        className={classes.button}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
      >
        <Avatar
          alt={formattedName}
          src={pictureUrl}
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
            <Typography className={classes.userInfoDetails} component={"span"}>
              <div style={{ display: "flex" }}>
                <Box fontWeight="600" fontSize="15px">
                  {formattedName}
                </Box>
                <Box fontWeight="500" fontSize="15px" marginLeft={1}>
                  {`(${props.userInfo.employeeNumber})`}
                </Box>
              </div>
              <div>
                <Box fontWeight="600" fontSize="15px">
                  {props.userInfo.location}
                </Box>
                <Box fontWeight="600" fontSize="15px">
                  {props.userInfo.jobTitle}
                </Box>
                {props.userInfo.cellPhone && (
                  <Box fontWeight="600" fontSize="15px">
                    {formatUserPhone(props.userInfo.cellPhone)}
                  </Box>
                )}
              </div>
              <Box fontWeight="600" fontSize="15px">
                {props.userInfo.email}
              </Box>
            </Typography>
          </div>
          {/* <div
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
                  `https://lumen.gentex.com/PROD/Person/${props.userInfo.employeeId}`
                );
              }}
            >
              <Typography component={"span"}>
                <Box fontWeight="600" fontSize="12px">
                  {"Lumen"}
                </Box>
              </Typography>
            </Button>
          </div> */}
        </Paper>
      </Popover>
    </div>
  );
};
