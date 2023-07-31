import * as React from "react";
import {
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
import { getEmployeeInfoGentex } from "../../utils/mes";
import { UserDisplayClickGentex } from "../UserDisplayClickGentex";
import { EmployeeInfoGentex } from "../../utils/DataTypes";

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
  teamGentex?: EmployeeInfoGentex[];
  onChange?: (operators: string[], teamGentex: EmployeeInfoGentex[]) => void;
}> = (props) => {
  const classes = useStyles();

  const [loadedProps, setLoadedProps] = React.useState(false);

  const [userOperators, setUserOperators] = React.useState<string[]>([]);
  const [userOperatorsGentex, setUserOperatorsGentex] = React.useState<
    EmployeeInfoGentex[]
  >([]);

  const [editing, setEditing] = React.useState(false);

  React.useEffect(() => {
    if (props.operators && props.teamGentex && !loadedProps) {
      const operators = props.operators.sort((a, b) => a.localeCompare(b));
      const teamGentex = props.teamGentex.sort((a, b) =>
        a.employeeNumber.localeCompare(b.employeeNumber)
      );
      setUserOperators(operators);
      setUserOperatorsGentex(teamGentex);
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

  const [valueSearch, setValueSearch] = React.useState("");

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueSearch(event.target.value);
  };

  React.useEffect(() => {
    if (valueSearch.length > 0) {
      if (valueSearch.includes(".") || !+valueSearch) {
        setErrorSearch(true);
        console.log("NaN error");
      } else {
        setErrorSearch(false);
      }
    } else {
      setErrorSearch(false);
    }
  }, [valueSearch]);

  const addTeamMember = () => {
    const add = async () => {
      if (errorSearch) return;
      if (userOperators.includes(valueSearch)) {
        setErrorSearch(true);
        return;
      }
      const userInfo = await getEmployeeInfoGentex(valueSearch);
      if (userInfo) {
        if (props.onChange) {
          const newOps = [...userOperators, valueSearch].sort((a, b) =>
            a.localeCompare(b)
          );
          const newGentex = [...userOperatorsGentex, userInfo].sort((a, b) =>
            a.employeeNumber.localeCompare(b.employeeNumber)
          );
          setUserOperators(newOps);
          setUserOperatorsGentex(newGentex);
          props.onChange(newOps, newGentex);
          console.log(newOps);
        }
      } else {
        setErrorSearch(true);
      }
    };
    void add();
  };

  const removeTeamMembers = () => {
    const newOps = [...userOperators].filter((x) => !checked.includes(x));
    const newGentex = [...userOperatorsGentex].filter(
      (x) => !checked.includes(x.employeeNumber)
    );
    setUserOperators(newOps);
    setUserOperatorsGentex(newGentex);
    if (props.onChange) props.onChange(newOps, newGentex);
  };

  return (
    <div className={classes.root}>
      <div
        style={{ display: "flex", marginLeft: "24px", alignItems: "center" }}
      >
        <div style={{ width: "700px" }}>
          <Grid
            container={true}
            spacing={2}
            justifyContent="center"
            alignItems="center"
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
                <TextField
                  error={errorSearch}
                  id="outlined-error"
                  label="Search for Team Member"
                  placeholder="Employee ID"
                  variant="outlined"
                  value={valueSearch}
                  onChange={handleChangeSearch}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      addTeamMember();
                    }
                  }}
                />
              </div>
              <div style={{ paddingTop: "20px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(event) => {
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
                    {userOperatorsGentex.map((value, index) => {
                      const labelId = `checkbox-list-secondary-label-${value.employeeNumber}`;
                      return (
                        <ListItem
                          key={value.employeeNumber}
                          secondaryAction={
                            editing ? (
                              <Checkbox
                                edge="end"
                                onChange={handleToggle(value.employeeNumber)}
                                checked={
                                  checked.indexOf(value.employeeNumber) !== -1
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
                    {/* {userOperators.map((value, index) => {
                      const labelId = `checkbox-list-secondary-label-${value}`;
                      return (
                        <ListItem
                          key={value}
                          secondaryAction={
                            editing ? (
                              <Checkbox
                                edge="end"
                                onChange={handleToggle(value)}
                                checked={checked.indexOf(value) !== -1}
                                inputProps={{ "aria-labelledby": labelId }}
                              />
                            ) : (
                              <div />
                            )
                          }
                          disablePadding
                        >
                          <ListItemButton>
                            <UserDisplayClick userId={value} />
                          </ListItemButton>
                        </ListItem>
                      );
                    })} */}
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
