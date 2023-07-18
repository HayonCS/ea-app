import * as React from "react";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
    cursor: "default",
  },
  layout: {
    paddingTop: "30px",
    display: "grid",
    rowGap: "20px",
  },
  title: {
    alignSelf: "center",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#000",
    paddingRight: "10px",
    paddingBottom: "10px",
  },
  body: {
    fontSize: "16px",
  },
  contact: {
    fontSize: "16px",
    fontWeight: "bold",
    paddingBottom: "8px",
  },
}));

export const About: React.FC<{}> = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.layout}>
        <Typography component="span">
          <Box className={classes.title}>{"About the EA App"}</Box>
        </Typography>
        <Typography component="span">
          <Box className={classes.body}>
            {
              "This web app for EA was developed with React 18 and Typescript 4.9.5"
            }
          </Box>
        </Typography>
        <Typography component="span">
          <Box className={classes.body}>
            {
              "It utilizes MUI X React components for UI and Typescript/NodeJS for backend."
            }
          </Box>
        </Typography>
        <Typography component="span">
          <Box className={classes.body}>
            {"Data is mutated and queried using MES REST API endpoints."}
          </Box>
        </Typography>
        <Typography component="span" className={classes.body} />
      </div>
      <div style={{ height: "20px" }} />
      <Typography component="span">
        <Box className={classes.contact}>
          {"Questions or concerns please contact me!"}
        </Box>
      </Typography>
      <Typography component="span">
        <Box className={classes.body}>{"Noah Krueger"}</Box>
      </Typography>
      <Typography component="span">
        <Box className={classes.body}>{"noah.krueger@gentex.com"}</Box>
      </Typography>
      <Typography component="span">
        <Box className={classes.body}>{"Cell: (616) 613-0818"}</Box>
      </Typography>
    </div>
  );
};
