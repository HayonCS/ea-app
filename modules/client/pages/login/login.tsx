import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Paper,
  TextField,
  Theme,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
// import { getEmployeeInfoGentex, getUserInfoGentex } from "client/utilities/mes";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { USER_COOKIE_NAME } from "client/utilities/definitions";
import { enqueueSnackbar } from "notistack";
import { Actions } from "client/redux/actions";
// import { SavedUserRecord } from "records/user";
import { UserInformation } from "core/schemas/user-information.gen";
import { getUserInformation } from "client/user-utils";
import { useUserInformation } from "client/components/hooks/UserInformation";
import { Selectors } from "client/redux/selectors";
import { AppTheme } from "client/styles/mui-theme";
import { LockOutlined } from "@mui/icons-material";
import { usingLocalAuth } from "client/auth";
import { login } from "client/redux/actions/thunks/authentication-thunks";
import * as AuthRoutes from "client/auth/authentication-routes";

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  inputLabel: {
    color: theme.palette.primary.main,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const Login: React.FC<{}> = () => {
  document.title = "Login";

  const classes = useStyles();

  const navigate = useNavigate();

  const localAuth = usingLocalAuth();

  const [username, setUsername] = React.useState("");
  const dispatch = useDispatch<Dispatch<any>>();
  const authenticationType = useSelector(Selectors.Authentication.type);
  const errorText = useSelector(Selectors.Authentication.errorText);

  const errorProps =
    authenticationType === "Error"
      ? {
          error: true,
          helperText: errorText ?? "Error logging in",
        }
      : { error: false };

  React.useEffect(() => {
    if (authenticationType === "Authenticated") {
      // history.push("/dashboard");
      navigate("/home");
    }
  }, [authenticationType]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          {localAuth ? "Log In" : "Sign In"}
        </Typography>
        <form
          className={classes.form}
          noValidate={true}
          onSubmit={async (event) => {
            event.preventDefault();
            if (localAuth) {
              dispatch(login(username));
            } else {
              window.open(AuthRoutes.LOGIN, "_self");
            }
          }}
        >
          {usingLocalAuth() && (
            <TextField
              InputLabelProps={{
                className: classes.inputLabel,
              }}
              variant="outlined"
              margin="normal"
              required={true}
              fullWidth={true}
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus={true}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              {...errorProps}
            />
          )}
          <Button
            type="submit"
            fullWidth={true}
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {localAuth ? "Log In" : "Sign In"}
          </Button>
        </form>
      </div>
    </Container>
  );
};
