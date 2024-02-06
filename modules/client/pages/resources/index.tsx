import * as React from "react";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { Box, Divider, Link, Paper, Typography } from "@mui/material";
import { Construction, Info } from "@mui/icons-material";

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

export const ResourcesPage: React.FC<{}> = () => {
  document.title = "Resources | EA Performance";

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
            <Construction
              style={{ color: "#FFF", marginRight: "10px" }}
              sx={{ fontSize: "2rem" }}
            />
            <Typography
              style={{ fontWeight: "500", fontSize: "36px", color: "#FFF" }}
            >
              {"Resources"}
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
              {"Cycle Times Update/View"}
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
              style={{
                fontWeight: "500",
                fontSize: "18px",
                color: "#FFF",
                marginBottom: "8px",
              }}
            >
              {"Docs/Wikis"}
            </Typography>
            <Link
              color="#FFF"
              href="#"
              onClick={() => {
                openInNewTab("https://redmine.gentex.com/projects/redis/wiki");
              }}
            >
              {`Subscription Service (Redis)`}
            </Link>
            <Link
              color="#FFF"
              href="#"
              onClick={() => {
                openInNewTab(
                  "https://api.gentex.com/MES/Client/manufacturingweb/swagger/"
                );
              }}
            >
              {`MES Manufacturing API`}
            </Link>
            <Link
              color="#FFF"
              href="#"
              onClick={() => {
                openInNewTab(
                  "https://api.gentex.com/mes/ebs/swagger/index.html"
                );
              }}
            >
              {`MES EBS API`}
            </Link>
            <Link
              color="#FFF"
              href="#"
              onClick={() => {
                openInNewTab(
                  "https://zvm-msgprod.gentex.com/MES/ProcessDataExportApi/swagger/ui/index"
                );
              }}
            >
              {`Process Data Export API`}
            </Link>
            <Link
              color="#FFF"
              href="#"
              onClick={() => {
                openInNewTab(
                  "https://zvm-msgprod.gentex.com/processdata/testhistoryweb/swagger/ui/index"
                );
              }}
            >
              {`Test History Web API`}
            </Link>
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
