import * as React from "react";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { Box, Divider, Link, Paper, Typography } from "@mui/material";
import { Info } from "@mui/icons-material";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    height: "calc(100vh - 48px)",
    textAlign: "left",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  mainBody: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    // height: "100%",
    width: "100%",
    padding: "0 30px",
  },
  title: {
    display: "flex",
    alignItems: "center",
    margin: "20px 0",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    margin: "20px 0",
  },
}));

const openInNewTab = (url: string) => {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};

export const AboutPage: React.FC<{}> = () => {
  document.title = "About | EA Performance";

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
      <div style={{ width: "100%", height: "100%", padding: "50px 200px" }}>
        <Paper
          className={classes.mainBody}
          sx={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        >
          <Box className={classes.title}>
            <Info
              style={{ color: "#FFF", marginRight: "10px" }}
              sx={{ fontSize: "2rem" }}
            />
            <Typography
              style={{ fontWeight: "500", fontSize: "36px", color: "#FFF" }}
            >
              {"About"}
            </Typography>
          </Box>
          <Divider
            sx={{ width: "100%", borderColor: "rgba(255, 255, 255, 1)" }}
          />
          <Box className={classes.section}>
            <Typography
              style={{
                fontWeight: "500",
                fontSize: "18px",
                color: "#FFF",
                marginBottom: "8px",
              }}
            >
              {"Performance Metrics"}
            </Typography>
            <Typography
              style={{ fontWeight: "400", fontSize: "16px", color: "#FFF" }}
            >
              {`Overall, performance is calculated based on the number of parts tested and each part's cycle time goal.
                It uses asset test logs to get the actual production time spent on the asset, and compares that with the expected production time, which is based on part cycle time goals.`}
            </Typography>
            <Typography
              style={{
                fontWeight: "400",
                fontSize: "16px",
                color: "#FFF",
                paddingTop: "8px",
              }}
            >
              {`Cycle times for part numbers are found and can be updated from two different areas, depending on the organization and asset.`}
            </Typography>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                style={{
                  fontWeight: "500",
                  fontSize: "16px",
                  color: "#FFF",
                  paddingRight: "8px",
                }}
              >
                {`FLOW Operations: `}
              </Typography>
              <Link
                color="#FFF"
                href="#"
                onClick={() => {
                  openInNewTab(
                    "https://mes.gentex.com/ReportingConfiguration/LineOperationPartCycleTimes"
                  );
                }}
              >
                {`Line, Operation, and Part Specific Cycle Times (MES)`}
              </Link>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                style={{
                  fontWeight: "500",
                  fontSize: "16px",
                  color: "#FFF",
                  paddingRight: "8px",
                }}
              >
                {`WIP Discrete: `}
              </Typography>
              <Link
                color="#FFF"
                href="#"
                onClick={() => {
                  openInNewTab(
                    "https://api.gentex.com/mes/ebs/swagger/index.html"
                  );
                }}
              >
                {`EBS BOM Routings (MES)`}
              </Link>
            </div>
          </Box>
          <Divider
            sx={{ width: "100%", borderColor: "rgba(255, 255, 255, 1)" }}
          />
          <Box className={classes.section}>
            <Typography
              style={{ fontWeight: "400", fontSize: "16px", color: "#FFF" }}
            >
              {
                "This web application for the Electrical Assembly departments\nwas developed with React 18 and Typescript 4.9.5."
              }
            </Typography>
            <Typography
              style={{ fontWeight: "400", fontSize: "16px", color: "#FFF" }}
            >
              {
                "It utilizes MUI X React components for UI and Node.js for backend."
              }
            </Typography>
            <Typography
              style={{ fontWeight: "400", fontSize: "16px", color: "#FFF" }}
            >
              {"Data is mutated and queried using a GraphQL API."}
            </Typography>
          </Box>
          <Divider
            sx={{ width: "100%", borderColor: "rgba(255, 255, 255, 1)" }}
          />
          <Box className={classes.section}>
            <Typography
              style={{
                fontWeight: "400",
                fontSize: "16px",
                color: "#FFF",
                paddingBottom: "16px",
              }}
            >
              {"Developed by:"}
            </Typography>
            <Typography
              style={{ fontWeight: "400", fontSize: "16px", color: "#FFF" }}
            >
              {"Noah Krueger"}
            </Typography>
            <Typography
              style={{ fontWeight: "400", fontSize: "16px", color: "#FFF" }}
            >
              {"noah.krueger@gentex.com"}
            </Typography>
            <Typography
              style={{ fontWeight: "400", fontSize: "16px", color: "#FFF" }}
            >
              {"+1 (616) 613-0818"}
            </Typography>
          </Box>
        </Paper>
      </div>
    </div>
  );
};
