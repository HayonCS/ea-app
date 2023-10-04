// import * as React from "react";
// import { useNavigate } from "react-router";
// import { useDispatch, useSelector } from "react-redux";
// import {Avatar, Button, Container, CssBaseline, TextField, Typography} from "@mui/material";
// import { makeStyles } from "@mui/styles";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import { login } from "client/redux/actions/thunks/authentication-thunks";
// import { Selectors } from "client/redux/selectors";
// import { usingLocalAuth } from "client/auth";
// import * as AuthRoutes from "client/auth/authentication-routes";

// const useStyles = makeStyles((theme: any) => ({
//   paper: {
//     marginTop: theme.spacing(8),
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//   },
//   avatar: {
//     margin: theme.spacing(1),
//     backgroundColor: theme.palette.secondary.main,
//   },
//   form: {
//     width: "100%", // Fix IE 11 issue.
//     marginTop: theme.spacing(1),
//   },
//   inputLabel: {
//     color: theme.palette.primary.main,
//   },
//   submit: {
//     margin: theme.spacing(3, 0, 2),
//   },
// }));

// export const LogIn: React.FC = () => {
//   const classes = useStyles();
//   const navigate = useNavigate();

//   const localAuth = usingLocalAuth();

//   const [username, setUsername] = React.useState("");
//   const dispatch = useDispatch();
//   const authenticationType = useSelector(Selectors.Authentication.type);
//   const errorText = useSelector(Selectors.Authentication.errorText);

//   const errorProps =
//     authenticationType === "Error"
//       ? {
//           error: true,
//           helperText: errorText ?? "Error logging in",
//         }
//       : { error: false };

//   React.useEffect(() => {
//     if (authenticationType === "Authenticated") {
//       navigate("/dashboard");
//     }
//   }, [authenticationType, navigate]);

//   return (
//     <Container component="main" maxWidth="xs">
//       <CssBaseline />
//       <div className={classes.paper}>
//         <Avatar className={classes.avatar}>
//           <LockOutlinedIcon />
//         </Avatar>
//         <Typography component="h1" variant="h5">
//           {localAuth ? "Log In" : "Sign In"}
//         </Typography>
//         <form
//           className={classes.form}
//           noValidate={true}
//           onSubmit={async (event) => {
//             event.preventDefault();
//             if (localAuth) {
//               // dispatch(login(username));
//             } else {
//               window.open(AuthRoutes.LOGIN, "_self");
//             }
//           }}
//         >
//           {usingLocalAuth() && (
//             <TextField
//               InputLabelProps={{
//                 className: classes.inputLabel,
//               }}
//               variant="outlined"
//               margin="normal"
//               required={true}
//               fullWidth={true}
//               id="username"
//               label="Username"
//               name="username"
//               autoComplete="username"
//               autoFocus={true}
//               value={username}
//               onChange={(event) => setUsername(event.target.value)}
//               {...errorProps}
//             />
//           )}
//           <Button
//             type="submit"
//             fullWidth={true}
//             variant="contained"
//             color="primary"
//             className={classes.submit}
//           >
//             {localAuth ? "Log In" : "Sign In"}
//           </Button>
//         </form>
//       </div>
//     </Container>
//   );
// };

export {};
