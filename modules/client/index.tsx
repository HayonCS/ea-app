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
import { DashboardAsset } from "./pages/dashboard/DashboardAsset";
import { DashboardPage } from "./pages/dashboard/Dashboard";
import { Statistics } from "./pages/statistics/Statistics";
import { HomePage } from "./pages/home";
import { Settings } from "./pages/settings/Settings";
import { Login } from "./pages/login/Login";
import { asyncComponent } from "react-async-component";
import { USER_COOKIE_NAME } from "./utilities/definitions";
import { LogOut } from "./pages/logout/Logout";
import { ResourcesPage } from "./pages/resources";
import { AboutPage } from "./pages/about";
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
    <div style={{}}>
      <AppBarMenu />

      <Routes>
        {/* <Route
          path="/login"
          Component={asyncComponent({
            resolve: async () =>
              (await import("client/pages/login/login")).Login,
            name: "Log In",
          })}
        />
        <Route
          path="/logout"
          Component={asyncComponent({
            resolve: async () => (await import("client/pages/logout")).LogOut,
            name: "Log Out",
          })}
        /> */}

        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<LogOut />} />

        <Route path="/error" Component={ServerErrorPageRouteLoader} />

        <Route path="/" element={<Navigate to="/home" />} />

        {/* <Route
          path="/home"
          element={ProtectedElement(<HomePage tabIndex={0} />)}
        />
        <Route
          path="/resources"
          element={ProtectedElement(<HomePage tabIndex={1} />)}
        />
        <Route
          path="/about"
          element={ProtectedElement(<HomePage tabIndex={2} />)}
        /> */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/about" element={<AboutPage />} />

        <Route path="/settings" element={ProtectedElement(<Settings />)} />

        <Route path="/statistics" element={ProtectedElement(<Statistics />)} />

        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/dashboard/:asset" element={<DashboardAsset />} />
        <Route path="/dashboard/:asset/:tab" element={<DashboardAsset />} />

        <Route Component={NotFoundErrorPageRouteLoader} />
      </Routes>
    </div>
  );
}

function ProtectedElement(element: React.ReactNode): React.ReactNode {
  const isAuthenticated = useSelector(
    Selectors.Authentication.isNotUnauthenticated
  );

  const redirectPath = "/login";

  if (isAuthenticated) {
    return element;
  } else {
    return <Navigate to={redirectPath} />;
    // return <Login />;
  }
}

// function ProtectedElement(element: React.ReactNode): React.ReactNode {
//   const currentUser = useSelector(Selectors.App.currentUserInfo);

//   const redirectPath = "/login";

//   const user = document.cookie
//     .split("; ")
//     .find((cookie) => cookie.startsWith(`${USER_COOKIE_NAME}=`))
//     ?.split("=")[1];

//   if (currentUser.employeeId !== "00000" || (user && user !== "undefined")) {
//     return element;
//   } else {
//     return <Navigate to={redirectPath} />;
//   }
// }
