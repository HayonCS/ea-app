import * as React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Main } from "./pages/Main";
import { Stats } from "./pages/Stats";
import { Login } from "./pages/Login";
import { Settings } from "./pages/Settings";
import { Provider } from "react-redux";
import { Store, applyMiddleware, createStore } from "redux";
import reducer from "./store/reducer";
import thunk from "redux-thunk";
import { AppAction, AppState, DispatchType } from "./store/type";
import { MenuBar } from "./modules/MenuBar";

const store: Store<AppState, AppAction> & {
  dispatch: DispatchType;
} = createStore(reducer, applyMiddleware(thunk));

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <MenuBar />
      <Routes>
        <Route path="/Stats" element={<Stats />} />
        <Route path="/About" element={<Main tabIndex={2} />} />
        <Route path="/Resources" element={<Main tabIndex={1} />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/" element={<Main />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
