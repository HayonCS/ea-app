import * as React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ORGANIZATIONS } from "client/utilities/definitions";
import { enqueueSnackbar } from "notistack";

const useStyles = makeStyles(() => ({
  root: {
    textAlign: "center",
    margin: "0px 16px 16px 64px",
  },
  tabBar: {
    flexGrow: 1,
    backgroundColor: "primary",
  },
  tabStyle: {
    fontWeight: "bolder",
    fontSize: "1rem",
  },
  tabIndicator: {
    height: "20px",
  },
}));

export const GeneralSettingsPanel: React.FC<{
  orgCode?: number;
  onChange?: (orgCode: number) => void;
}> = (props) => {
  const classes = useStyles();

  const [orgCode, setOrgCode] = React.useState(props.orgCode ?? 0);

  const handleChange = (event: SelectChangeEvent) => {
    const value = +event.target.value;
    setOrgCode(value);
    if (props.onChange) props.onChange(value);
    const org = ORGANIZATIONS.find((x) => x.code === value);
    if (org) {
      enqueueSnackbar(`Changed Organization to: ${org.code} - ${org.name}`, {
        variant: "info",
        autoHideDuration: 3000,
      });
    }
  };

  React.useEffect(() => {
    if (props.orgCode) setOrgCode(props.orgCode);
  }, [props]);

  return (
    <div className={classes.root}>
      <div
        style={{ display: "flex", marginLeft: "24px", alignItems: "center" }}
      >
        <Typography
          style={{ fontSize: "18px", fontWeight: "bold", cursor: "default" }}
        >
          {"Organization: "}
        </Typography>

        <Box sx={{ minWidth: 240, marginLeft: "16px" }}>
          <div>
            <FormControl fullWidth={true}>
              <InputLabel>Organization</InputLabel>
              <Select
                displayEmpty={true}
                value={orgCode.toString()}
                label="Organization"
                onChange={handleChange}
              >
                <MenuItem value={"0"}>
                  <em>None</em>
                </MenuItem>
                {ORGANIZATIONS.map((org) => {
                  return (
                    <MenuItem
                      value={org.code}
                      key={org.code}
                    >{`${org.code} - ${org.name}`}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
        </Box>
      </div>
    </div>
  );
};
