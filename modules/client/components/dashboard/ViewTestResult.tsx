import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Popover,
  Typography,
} from "@mui/material";
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
}));

const openInNewTab = (url: string) => {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};

export const ViewTestResult: React.FC<{
  metaDataId: string;
}> = (props) => {
  const classes = useStyles();

  const [resultUrl, setResultUrl] = React.useState(
    `https://api.gentex.com/gtm/dctools/v1/genResultFileByBloborMDIDorSNID.php?mdid=${props.metaDataId}&blobName=TestLog`
  );

  React.useEffect(() => {
    setResultUrl(
      `https://api.gentex.com/gtm/dctools/v1/genResultFileByBloborMDIDorSNID.php?mdid=${props.metaDataId}&blobName=TestLog`
    );
  }, [props]);

  const handleClick = () => {
    openInNewTab(resultUrl);
  };

  return (
    <div className={classes.root}>
      <Chip label="Result" size="small" onClick={handleClick} />
    </div>
  );
};
