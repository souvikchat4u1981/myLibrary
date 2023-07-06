import { Navigate } from "react-router-dom";

const RequireAuth = (props) => {
  let auth = false;
  if (props.authed === null || props.authed === false) {
    if (JSON.parse(sessionStorage.getItem("isLogin")) === true) {
      auth = true;
    }
  } else {
    auth = props.authed;
  }

  if (auth) {
    return props.children;
  }
  if (sessionStorage.getItem("user")) {
    return <Navigate to="/access-denied" replace></Navigate>;
  }
  return <Navigate to="/login" replace></Navigate>;
};
export default RequireAuth;
