import * as React from "react";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { Chip, Fab, Stack, Typography } from "@mui/material";
import { Dashboard, Equalizer } from "@mui/icons-material";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    height: "calc(100vh - 48px)",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    // backgroundImage: `url(/images/ea-background.jpg)`,
    // backgroundSize: "cover",
    // backgroundPosition: "bottom",
  },
  background: {
    height: "100%",
    width: "177.77777778vh",
    minWidth: "100%",
    minHeight: "56.25vw",
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: "-1",
  },
  appHeader: {
    height: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    cursor: "default",
    userSelect: "none",
    whiteSpace: "nowrap",
  },
  mainBody: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "calc(100vh - 260px)",
  },
}));

export const HomePage: React.FC<{}> = () => {
  document.title = "Home | EA Performance";

  const classes = useStyles();

  const navigate = useNavigate();

  return (
    <div className={classes.root}>
      <video
        id="plexus-background"
        className={classes.background}
        autoPlay
        muted
        loop
      >
        <source src="videos/plexus-background.webm" type="video/webm" />
      </video>
      <header className={classes.appHeader}>
        <Typography
          style={{ fontSize: "72px", fontWeight: "bold", color: "#FFF" }}
        >
          {"EA PERFORMANCE"}
        </Typography>
        <Typography
          style={{ fontSize: "12px", fontWeight: "400", color: "#FFF" }}
        >
          {"Historical performance metrics and live dashboard displays."}
        </Typography>
      </header>
      <div className={classes.mainBody}>
        <Fab
          variant="extended"
          color="primary"
          style={{ transform: "scale(1.25)", marginBottom: "60px" }}
          sx={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
          onClick={() => {
            navigate("/statistics");
          }}
        >
          <Equalizer style={{ paddingRight: "8px" }} />
          {"STATISTICS"}
        </Fab>
        <Fab
          variant="extended"
          color="primary"
          style={{ transform: "scale(1.25)", marginBottom: "80px" }}
          sx={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
          onClick={() => {
            navigate("/dashboard");
          }}
        >
          <Dashboard style={{ paddingRight: "8px" }} />
          {"DASHBOARD"}
        </Fab>
        <Stack direction="row" spacing={2}>
          <Chip
            label="Resources"
            color="primary"
            sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)", width: "90px" }}
            onClick={() => {
              navigate("/resources");
            }}
          />
          <Chip
            label="About"
            color="primary"
            sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)", width: "90px" }}
            onClick={() => {
              navigate("/about");
            }}
          />
        </Stack>
      </div>
    </div>
  );
};
