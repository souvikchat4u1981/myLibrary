import { BrowserRouter, Routes } from "react-router-dom";
import { Route, Navigate } from "react-router-dom";
import routes from "./RouteConfig";
import Login from "../modules/login/Login";
import LayoutProvider from "./LayoutProvider";
import CheckAccountAndgetOTP from "../modules/login/CheckAccountAndgetOTP";
import RequireAuth from "./RequireAuth";
import AccessDenied from "../common/accessDenied/AccessDenied";
import Register from "../modules/login/register/Register";
import Forgotpassword from "../modules/login/forgotPassword/Forgotpassword";

const RouterProvider = () => {
  let authed = true;
  //console.log("Authed: " + sessionStorage.getItem("isLogin"));
  authed = JSON.parse(sessionStorage.getItem("isLogin"));
  return (
    <BrowserRouter basename={window.Configs.baseName}>
      <Routes>
        {/* <Route key={1} path="/login" element={<Login />} />
        <Route key={2} path="/" element={<Navigate replace to="/login" />} />
        <Route key={3} path="/registration" element={<Register />} />
        <Route key={4} path="/forgotPassword" element={<Forgotpassword />} /> */}

        <Route
          key={1}
          path="/trading-account"
          element={<CheckAccountAndgetOTP />}
        />
        <Route key={1} path="/access-denied" element={<AccessDenied />} />

        {routes.map(({ path, Component }, index) => (
          <Route
            key={index}
            path={path}
            element={
              // <RequireAuth authed={authed}>
              <LayoutProvider component={Component} />
              // </RequireAuth>
            }
          ></Route>
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default RouterProvider;
