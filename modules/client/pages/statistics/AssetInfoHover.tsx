import * as React from "react";
import { Paper, Popover } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { AssetInfo } from "rest-endpoints/mes-bi/mes-bi";

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
  popupDetails: {
    marginRight: "4px",
    width: "100%",
    height: "100%",
    alignItems: "center",
    color: "black",
    fontSize: "16px",
    fontFamily: "inherit",
    fontWeight: "bold",
    display: "flex",
    flexDirection: "column",
  },
}));

export const AssetInfoHover: React.FC<{
  assetInfo: AssetInfo;
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

  return (
    <div className={classes.root}>
      <div
        className={classes.button}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
      >
        {props.assetInfo.assetName}
      </div>

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
        disableRestoreFocus={true}
        sx={{ pointerEvents: "none" }}
      >
        <Paper style={{ padding: "12px 20px 12px 20px" }}>
          <div className={classes.popupDetails}>
            <div>{`Name: ${props.assetInfo.assetName}`}</div>
            <div>{`Model: ${props.assetInfo.model}`}</div>
            <div>{`Line: ${props.assetInfo.line}`}</div>
            <div>{`OrgCode: ${props.assetInfo.orgCode}`}</div>
          </div>
        </Paper>
      </Popover>
    </div>
  );
};
