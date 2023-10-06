import * as React from "react";
import * as TWEEN from "tween.js";
import {
  NotFoundErrorPageRouteLoader,
  ServerErrorPageRouteLoader,
} from "./pages/error/error-loaders";
import { Navigate, Route, RouteProps, Routes } from "react-router-dom";
// import { Editor } from "client/components/editor/Editor";
// import { EditorRedirectLatest } from "client/components/editor/EditorRedirectLatest";
import { Selectors } from "./redux/selectors";
// import { asyncComponent } from "react-async-component";
import { useSelector } from "react-redux";
// import { DashboardUI } from "./pages/dashboard/dashboard-ui";
// import {
//   lockoutEnabled,
//   TestPlanLockManager,
// } from "./components/test-plan-lockout/TestPlanLockManager";
// import { TextEditorPage } from "./texteditor/components/standalone/TextEditorPage";
// import { StationWatchersDashboard } from "./stationwatchers/StationWatchersDashboard";
// import { QmlViewer } from "./texteditor/components/QmlViewer";
// import { DiffViewPage } from "./texteditor/components/diff-view/DiffViewPage";
// import { WorkingCopyDiffPage } from "./texteditor/components/diff-view/WorkingCopyDiffPage";
// import { AnalyzeDashboard } from "./analyze/AnalyzeDashboard";
// import { CreateUI } from "./pages/create/create-ui";
// import { ConnectionChecker } from "./components/network-connection/ConnectionChecker";
// import { HelpOverlay } from "./components/help/HelpOverlay";
import { isFeatureEnabled } from "../../entry/feature-flags";
import { AppBarMenu } from "./components/app-bar/AppBar";
import { DashboardAsset } from "./pages/DashboardAsset";
import { DashboardPage } from "./pages/Dashboard";
import { Statistics } from "./pages/statistics/statistics";
import { HomePage } from "./pages/home/home";
import { Settings } from "./pages/settings/settings";
import { Login } from "./pages/login/login";
import { asyncComponent } from "react-async-component";
import { USER_COOKIE_NAME } from "./utilities/definitions";
// import { server_url } from "./connection-utils";

//Setup the animation loop.
function animate(time: number) {
  requestAnimationFrame(animate);
  TWEEN.update(time);
}
requestAnimationFrame(animate);

// const lockoutIsEnabled = lockoutEnabled();
// const helpContextIsEnabled = isFeatureEnabled("helpContext");

export function App() {
  return (
    <div>
      <AppBarMenu />

      <Routes>
        {/* <Route
          path="/login"
          Component={asyncComponent({
            resolve: async () =>
              (await import("client/pages/login/login")).Login,
            name: "Log In",
          })}
        /> */}

        <Route path="/login" element={<Login />} />

        <Route path="/error" Component={ServerErrorPageRouteLoader} />

        <Route path="/" element={<Navigate to="/home" />} />

        <Route path="/home" element={ProtectedElement(<HomePage />)} />
        <Route
          path="/resources"
          element={ProtectedElement(<HomePage tabIndex={1} />)}
        />
        <Route
          path="/about"
          element={ProtectedElement(<HomePage tabIndex={2} />)}
        />

        <Route path="/settings" element={ProtectedElement(<Settings />)} />

        <Route path="/statistics" element={ProtectedElement(<Statistics />)} />

        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/dashboard/:asset" element={<DashboardAsset />} />

        <Route Component={NotFoundErrorPageRouteLoader} />
      </Routes>
    </div>
  );
}

function ProtectedElement(element: React.ReactNode): React.ReactNode {
  const currentUser = useSelector(Selectors.App.currentUserInfo);

  const redirectPath = "/login";

  const user = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${USER_COOKIE_NAME}=`))
    ?.split("=")[1];

  if (currentUser.employeeId !== "00000" || (user && user !== "undefined")) {
    return element;
  } else {
    return <Navigate to={redirectPath} />;
  }
  // return element;
}

// let ASSET_LIST: string[] = [];

// export function App() {
//   return (
//     <div>
//       <AppBarMenu />
//       <Routes>
//         {ASSET_LIST.map((asset, i) => {
//           return (
//             <Route
//               key={i}
//               path={`/Dashboard/${asset}`}
//               element={<DashboardAsset asset={asset} />}
//             />
//           );
//         })}
//         <Route path="/Dashboard" element={<DashboardPage />} />
//         <Route path="/Stats" element={<Statistics />} />
//         <Route path="/About" element={<HomePage tabIndex={2} />} />
//         <Route path="/Resources" element={<HomePage tabIndex={1} />} />
//         <Route path="/Settings" element={<Settings />} />
//         <Route path="/Login" element={<Login />} />
//         <Route path="/" element={<HomePage />} />
//       </Routes>
//     </div>
//   );
// }

// export const ProtectedRoute: React.FC<RouteProps> = (props) => {
//   const isAuthenticated = useSelector(
//     Selectors.Authentication.isNotUnauthenticated
//   );

//   const redirectPath = "/login";

//   if (isAuthenticated) {
//     return <Route {...props} />;
//   } else {
//     const renderComponent = () => <Redirect to={{ pathname: redirectPath }} />;
//     return <Route component={renderComponent} render={undefined} />;
//   }
// };
