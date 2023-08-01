import * as React from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { getEmployeeInfoGentex, getUserInfoGentex } from "../utils/mes";
import { useDispatch } from "react-redux";
import {
  setCurrentUser,
  updateUserGentex,
  addAlert,
} from "../store/actionCreators";
import { Dispatch } from "redux";
import { USER_COOKIE_NAME } from "../definitions";
import { EmployeeInfoGentex, AlertType } from "../utils/DataTypes";

const useStyles = makeStyles(() => ({
  app: {
    textAlign: "center",
  },
  paperStyle: {
    alignContent: "center",
    flexDirection: "column",
    justifyContent: "center",
    height: "calc(100vh - 48px)",
  },
}));

export const Login: React.FC<{}> = (props) => {
  document.title = "Login";

  const classes = useStyles();

  const navigate = useNavigate();

  const [error, setError] = React.useState(false);

  const [value, setValue] = React.useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const dispatch: Dispatch<any> = useDispatch();
  const addAlertRedux = React.useCallback(
    (alert: AlertType) => dispatch(addAlert(alert)),
    [dispatch]
  );
  const setCurrentUserRedux = React.useCallback(
    (user: string) => dispatch(setCurrentUser(user)),
    [dispatch]
  );
  const updateUserGentexRedux = React.useCallback(
    (userInfo: EmployeeInfoGentex) => dispatch(updateUserGentex(userInfo)),
    [dispatch]
  );

  React.useEffect(() => {
    const user = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(`${USER_COOKIE_NAME}=`))
      ?.split("=")[1];
    if (user) {
      setCurrentUserRedux(user);
    } else {
      setCurrentUserRedux("unknown");
      navigate("/Login");
    }
  }, [navigate, setCurrentUserRedux]);

  React.useEffect(() => {
    if (value.length > 0) {
      if (!value.includes(".") || value.split(".")[1].length < 1) {
        setError(true);
      } else {
        setError(false);
      }
    } else {
      setError(false);
    }
  }, [value]);

  const tryLogin = () => {
    async function login() {
      const userInfo = await getUserInfoGentex(value);
      if (userInfo) {
        let cookieDate = new Date();
        cookieDate.setFullYear(cookieDate.getFullYear() + 1);
        document.cookie = `${USER_COOKIE_NAME}=${
          userInfo.username
        }; expires=${cookieDate.toUTCString()};`;
        setCurrentUserRedux(userInfo.username);
        const employeeInfo = await getEmployeeInfoGentex(userInfo.employeeId);
        if (employeeInfo) updateUserGentexRedux(employeeInfo);
        addAlertRedux({
          message: "Login successful!",
          severity: "success",
          timeout: 4000,
        });
        navigate("/");
      } else {
        addAlertRedux({
          message: "Invalid login.",
          severity: "error",
          timeout: 4000,
        });
        setError(true);
      }
    }
    void login();
  };

  return (
    <div className={classes.app}>
      <Paper className={classes.paperStyle}>
        <div style={{ paddingTop: "calc(15vh)" }}>
          <Typography component={"span"}>
            <Box fontWeight="900" fontSize="46px">
              {"Login Page"}
            </Box>
          </Typography>
          <div style={{ paddingTop: "50px" }}>
            <TextField
              error={error}
              id="outlined-error"
              label="Username"
              placeholder="FirstName.LastName"
              variant="outlined"
              value={value}
              onChange={handleChange}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  tryLogin();
                }
              }}
            />
          </div>
          <div style={{ paddingTop: "20px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={(event) => {
                tryLogin();
              }}
            >
              <Typography component={"span"}>
                <Box fontWeight="600" fontSize="16px" color="white">
                  {"LOGIN"}
                </Box>
              </Typography>
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
};
