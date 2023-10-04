import * as React from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
// import { getEmployeeInfoGentex, getUserInfoGentex } from "client/utilities/mes";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { USER_COOKIE_NAME } from "client/utilities/definitions";
import { enqueueSnackbar } from "notistack";
import { Actions } from "client/redux/actions";
// import { SavedUserRecord } from "records/user";
import { UserInformation } from "core/schemas/user-information.gen";
import { getUserInformation } from "client/user-utils";
import { useUserInformation } from "client/components/hooks/UserInformation";

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

export const Login: React.FC<{}> = () => {
  document.title = "Login";

  const classes = useStyles();

  const navigate = useNavigate();

  const [error, setError] = React.useState(false);

  const [value, setValue] = React.useState("");

  const [username, setUsername] = React.useState<string>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const dispatch = useDispatch<Dispatch<Actions>>();
  const setCurrentUserRedux = React.useCallback(
    (user: UserInformation) => dispatch(Actions.App.currentUserInfo(user)),
    [dispatch]
  );

  const userInfo = useUserInformation(username ?? "");

  React.useEffect(() => {
    if (userInfo !== "Error" && userInfo !== "Loading") {
      if (userInfo.employeeId !== "00000") {
        let cookieDate = new Date();
        cookieDate.setFullYear(cookieDate.getFullYear() + 1);
        document.cookie = `${USER_COOKIE_NAME}=${
          userInfo.username
        }; expires=${cookieDate.toUTCString()};`;
        setCurrentUserRedux(userInfo);
        enqueueSnackbar("Login successful!", {
          variant: "success",
          autoHideDuration: 4000,
        });
        navigate("/");
      }
    } else if (userInfo === "Error") {
      enqueueSnackbar("Invalid login.", {
        variant: "error",
        autoHideDuration: 4000,
      });
      setError(true);
    }
  }, [userInfo]);

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

  // const tryLogin = () => {
  //   async function login() {
  //     const userInfo = await getUserInfoGentex(value);
  //     if (userInfo) {
  //       let cookieDate = new Date();
  //       cookieDate.setFullYear(cookieDate.getFullYear() + 1);
  //       document.cookie = `${USER_COOKIE_NAME}=${
  //         userInfo.username
  //       }; expires=${cookieDate.toUTCString()};`;
  //       const u: SavedUserRecord = {
  //         // UserID: userInfo.username,
  //         UserID: +userInfo.employeeId,
  //         Name: userInfo.firstName + " " + userInfo.lastName,
  //         EMail: userInfo.emailAddress,
  //         EmployeeNumber: userInfo.employeeId,
  //         Location: "",
  //         Manager: "",
  //         Phone: "",
  //         ReadOnly: false,
  //       };
  //       setCurrentUserRedux(u);
  //       const employeeInfo = await getEmployeeInfoGentex(userInfo.employeeId);
  //       if (employeeInfo) updateUserGentexRedux(employeeInfo);
  //       enqueueSnackbar("Login successful!", {
  //         variant: "success",
  //         autoHideDuration: 4000,
  //       });
  //       navigate("/");
  //     } else {
  //       enqueueSnackbar("Invalid login.", {
  //         variant: "error",
  //         autoHideDuration: 4000,
  //       });
  //       setError(true);
  //     }
  //   }
  //   void login();
  // };

  const tryLogin = () => {
    setUsername(value);
    // async function login() {
    //   const userInfo = await getUserInformation(value);
    //   if (userInfo && userInfo.employeeId !== "00000") {
    //     let cookieDate = new Date();
    //     cookieDate.setFullYear(cookieDate.getFullYear() + 1);
    //     document.cookie = `${USER_COOKIE_NAME}=${
    //       userInfo.username
    //     }; expires=${cookieDate.toUTCString()};`;
    //     setCurrentUserRedux(userInfo);
    //     enqueueSnackbar("Login successful!", {
    //       variant: "success",
    //       autoHideDuration: 4000,
    //     });
    //     navigate("/");
    //   } else {
    //     enqueueSnackbar("Invalid login.", {
    //       variant: "error",
    //       autoHideDuration: 4000,
    //     });
    //     setError(true);
    //   }
    // }
    // void login();
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
              onClick={() => {
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
