import * as React from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Grid,
  List,
  ListItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { UserDisplayClickGentex } from "client/components/user-display/UserDisplayClickGentex";
import { UserDisplayHover } from "client/components/user-display/UserDisplayHover";
import { formatUserName } from "../../utilities/DataUtility";
import { enqueueSnackbar } from "notistack";
import { UserInformation } from "core/schemas/user-information.gen";

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

export const TeamSettingsPanel: React.FC<{
  operators?: string[];
  teamGentex?: UserInformation[];
  employeeDirectory?: UserInformation[];
  onChange?: (operators: string[]) => void;
}> = (props) => {
  const classes = useStyles();

  const [loadedProps, setLoadedProps] = React.useState(false);

  const [userOperators, setUserOperators] = React.useState<UserInformation[]>(
    []
  );
  // const [userOperatorsGentex, setUserOperatorsGentex] = React.useState<
  //   UserInformation[]
  // >([]);
  const [employeeDirectoryGentex, setEmployeeDirectoryGentex] = React.useState<
    UserInformation[]
  >([]);

  const [editing, setEditing] = React.useState(false);

  React.useEffect(() => {
    if (
      props.operators &&
      props.teamGentex &&
      props.employeeDirectory &&
      !loadedProps
    ) {
      const operators = [...props.operators].sort((a, b) => a.localeCompare(b));
      // const teamGentex = props.teamGentex.sort(
      //   (a, b) =>
      //     a.firstName.localeCompare(b.firstName) ||
      //     a.lastName.localeCompare(b.lastName)
      // );
      const empDirectory = props.employeeDirectory.sort(
        (a, b) =>
          a.firstName.localeCompare(b.firstName) ||
          a.lastName.localeCompare(b.lastName)
      );
      const opInfo = empDirectory.filter((x) =>
        operators.includes(x.employeeId)
      );
      setUserOperators(opInfo);
      // setUserOperatorsGentex(teamGentex);
      setEmployeeDirectoryGentex(empDirectory);
      setLoadedProps(true);
    }
  }, [props, loadedProps]);

  const [checked, setChecked] = React.useState<string[]>([]);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const [errorSearch, setErrorSearch] = React.useState(false);

  const [autocompleteOpen, setAutocompleteOpen] = React.useState(false);

  const [inputValue, setInputValue] = React.useState("");

  const [selectedValue, setSelectedValue] =
    React.useState<UserInformation | null>(null);

  const handleAutocompleteOpen = () => {
    if (inputValue.length > 2) {
      setAutocompleteOpen(true);
    }
  };

  const handleAutocompleteClose = () => {
    if (inputValue.length > 2) {
      setAutocompleteOpen(true);
    } else {
      setAutocompleteOpen(false);
    }
  };

  const handleInputChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    setInputValue(value);
    setErrorSearch(false);
    if (value.length > 2) {
      setAutocompleteOpen(true);
    } else {
      setAutocompleteOpen(false);
    }
  };

  const addTeamMember = () => {
    const add = async () => {
      if (errorSearch) return;
      if (
        !selectedValue ||
        (selectedValue && userOperators.includes(selectedValue))
      ) {
        setErrorSearch(true);
        return;
      }
      if (selectedValue) {
        if (props.onChange) {
          const newOps = [...userOperators, selectedValue].sort((a, b) =>
            a.employeeId.localeCompare(b.employeeId)
          );
          const newOpsInfo = newOps.map((x) => x.employeeId);
          // const newGentex = [...userOperatorsGentex, selectedValue].sort(
          //   (a, b) =>
          //     a.firstName.localeCompare(b.firstName) ||
          //     a.lastName.localeCompare(b.lastName)
          // );
          setUserOperators(newOps);
          // setUserOperatorsGentex(newGentex);
          setInputValue("");
          setSelectedValue(null);
          setAutocompleteOpen(false);
          props.onChange(newOpsInfo);
          enqueueSnackbar(
            `Added ${formatUserName(
              selectedValue.firstName + "." + selectedValue.lastName
            )} (${selectedValue.employeeId}) to your team.`,
            {
              variant: "info",
              autoHideDuration: 3000,
            }
          );
        }
      } else {
        setErrorSearch(true);
      }
    };
    void add();
  };

  const removeTeamMembers = () => {
    const newOpsInfo = [...userOperators].filter(
      (x) => !checked.includes(x.employeeId)
    );
    const newOps = newOpsInfo.map((x) => x.employeeId);
    // const newGentex = [...userOperatorsGentex].filter(
    //   (x) => !checked.includes(x.employeeId)
    // );
    const opsRemoved = [...userOperators].filter((x) =>
      checked.includes(x.employeeId)
    );
    setUserOperators(newOpsInfo);
    // setUserOperatorsGentex(newGentex);
    setChecked([]);
    if (props.onChange) props.onChange(newOps);
    opsRemoved.forEach((op) => {
      enqueueSnackbar(
        `Removed ${formatUserName(op.firstName + "." + op.lastName)} (${
          op.employeeId
        }) from your team.`,
        {
          variant: "warning",
          autoHideDuration: 3000,
        }
      );
    });
  };

  return (
    <div className={classes.root}>
      <div
        style={{ display: "flex", marginLeft: "24px", alignItems: "center" }}
      >
        <div style={{ width: "800px" }}>
          <Grid
            container={true}
            spacing={2}
            justifyContent="start"
            alignItems="start"
          >
            <Grid item>
              <Typography
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "default",
                  marginBottom: "16px",
                }}
              >
                {"Add Team Member"}
              </Typography>
              <div>
                <Autocomplete
                  disablePortal={true}
                  autoHighlight={true}
                  id="autocomplete-employee-directory"
                  options={
                    !selectedValue ? employeeDirectoryGentex : [selectedValue]
                  }
                  getOptionLabel={(option) =>
                    `${formatUserName(
                      option.firstName + "." + option.lastName
                    )} (${option.employeeId})`
                  }
                  // autoFocus={true}
                  sx={{ width: 300 }}
                  open={autocompleteOpen}
                  onOpen={handleAutocompleteOpen}
                  onClose={handleAutocompleteClose}
                  inputValue={inputValue}
                  onInputChange={handleInputChange}
                  value={selectedValue}
                  onChange={(event, value) => {
                    setSelectedValue(value);
                  }}
                  clearOnBlur={false}
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      key={option.employeeId}
                      style={{ padding: "2px 8px" }}
                      {...props}
                    >
                      <UserDisplayHover userInfo={option} />
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password", // disable autocomplete and autofill
                      }}
                      label="Search for employee"
                    />
                  )}
                />
              </div>
              <div style={{ marginTop: "70px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!selectedValue}
                  onClick={() => {
                    addTeamMember();
                  }}
                >
                  <Typography component={"span"}>
                    <Box fontWeight="600" fontSize="16px" color="white">
                      {"Add"}
                    </Box>
                  </Typography>
                </Button>
              </div>
            </Grid>
            <Grid item>
              <Grid container direction="column" alignItems="center">
                <div style={{ width: "30px" }} />
              </Grid>
            </Grid>
            <Grid item={true}>
              <div>
                <Typography
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    cursor: "default",
                    marginBottom: "16px",
                  }}
                >
                  {"MY TEAM"}
                </Typography>
                <Paper sx={{ minWidth: 350, maxHeight: 400, overflow: "auto" }}>
                  <List
                    dense
                    sx={{
                      width: "100%",
                      bgcolor: "background.paper",
                    }}
                    role="list"
                  >
                    {userOperators.map((value) => {
                      const labelId = `checkbox-list-secondary-label-${value.employeeId}`;
                      return (
                        <ListItem
                          key={value.employeeId}
                          secondaryAction={
                            editing ? (
                              <Checkbox
                                edge="end"
                                onChange={handleToggle(value.employeeId)}
                                checked={
                                  checked.indexOf(value.employeeId) !== -1
                                }
                                inputProps={{ "aria-labelledby": labelId }}
                              />
                            ) : (
                              <div />
                            )
                          }
                          disablePadding={true}
                        >
                          <div style={{ padding: "2px 8px", width: "100%" }}>
                            <UserDisplayClickGentex userInfo={value} />
                          </div>
                        </ListItem>
                      );
                    })}
                  </List>
                </Paper>
                <div
                  style={{
                    paddingTop: "20px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Stack direction="row" spacing={1}>
                    {editing ? (
                      <Chip
                        label="Remove"
                        variant="outlined"
                        color="error"
                        disabled={checked.length < 1}
                        onClick={() => {
                          removeTeamMembers();
                        }}
                      />
                    ) : (
                      <div />
                    )}

                    {editing ? (
                      <Chip
                        label="Cancel"
                        color="primary"
                        onClick={() => {
                          setEditing(false);
                          setChecked([]);
                        }}
                      />
                    ) : (
                      <Chip
                        label="Edit"
                        variant="outlined"
                        color="primary"
                        disabled={userOperators.length < 1}
                        onClick={() => {
                          setEditing(true);
                        }}
                      />
                    )}
                  </Stack>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};
