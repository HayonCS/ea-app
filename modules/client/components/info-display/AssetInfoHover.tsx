import * as React from "react";
import { Box, Grid, Paper, Popover, Typography } from "@mui/material";
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
    justifyContent: "center",
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
        <Paper
          style={{ padding: "12px 24px 2px 20px" }}
          sx={{
            width: "100%",
            textAlign: "center",
            height: "100%",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Grid
            container
            spacing={1}
            columns={1}
            padding={2}
            sx={{
              width: "100%",
              textAlign: "center",
              height: "100%",
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Grid container spacing={1} columns={2}>
              <Grid item xs={1}>
                <Box
                  fontWeight="500"
                  fontSize="16px"
                  sx={{ display: "flex", justifyContent: "end" }}
                >
                  {"Name:"}
                </Box>
              </Grid>
              <Grid item xs={1}>
                <Box
                  fontWeight="600"
                  fontSize="16px"
                  textAlign="left"
                  sx={{
                    width: "100%",
                    display: "flex",
                    whiteSpace: "nowrap",
                    justifyContent: "start",
                  }}
                >
                  {props.assetInfo.assetName}
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={1} columns={2}>
              <Grid item xs={1}>
                <Box
                  fontWeight="500"
                  fontSize="16px"
                  sx={{ display: "flex", justifyContent: "end" }}
                >
                  {"Model:"}
                </Box>
              </Grid>
              <Grid item xs={1}>
                <Box
                  fontWeight="600"
                  fontSize="16px"
                  textAlign="left"
                  sx={{
                    width: "100%",
                    display: "flex",
                    whiteSpace: "nowrap",
                    justifyContent: "start",
                  }}
                >
                  {props.assetInfo.model}
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={1} columns={2}>
              <Grid item xs={1}>
                <Box
                  fontWeight="500"
                  fontSize="16px"
                  sx={{ display: "flex", justifyContent: "end" }}
                >
                  {"Line:"}
                </Box>
              </Grid>
              <Grid item xs={1}>
                <Box
                  fontWeight="600"
                  fontSize="16px"
                  textAlign="left"
                  sx={{
                    width: "100%",
                    display: "flex",
                    whiteSpace: "nowrap",
                    justifyContent: "start",
                  }}
                >
                  {props.assetInfo.line}
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={1} columns={2}>
              <Grid item xs={1}>
                <Box
                  fontWeight="500"
                  fontSize="16px"
                  sx={{ display: "flex", justifyContent: "end" }}
                >
                  {"OrgCode:"}
                </Box>
              </Grid>
              <Grid item xs={1}>
                <Box
                  fontWeight="600"
                  fontSize="16px"
                  textAlign="left"
                  sx={{
                    width: "100%",
                    display: "flex",
                    whiteSpace: "nowrap",
                    justifyContent: "start",
                  }}
                >
                  {props.assetInfo.orgCode}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Popover>
    </div>
  );
};
