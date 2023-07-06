import React, { Fragment, useEffect, useReducer, useState } from "react";
import "./login.scss";
import Input from "../../lib/input/Input";
import formReducer from "../../lib/formReducer/FormReducer";
import Button from "../../lib/button/Button";
import { ErrorMessage } from "../../lib/toastMessage/Toastmessage";
import Setting from "../../common/layout/Setting";
import { Link, useNavigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../store/Store";
import { enc, SHA256 } from "crypto-js";
import CustomLoader from "../../lib/customLoader/CustomLoader";
import { postCall } from "../../utils/RestCalls";

const Login = (props) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [initialData] = useState({
    userName: "",
    password: "",
    email: "",
    mobile: "",
  });
  let [loginUser, loginUserDispatch] = useReducer(formReducer, initialData);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    loginUserDispatch({
      type: "SET INITIAL VALUE",

      payload: initialData,
    });
    setUser(initialData);
    sessionStorage.clear();
  }, []);

  const onInputChange = (data) => {
    let d = user;
    d[data.id] = data.value;
    setUser(d);

    loginUserDispatch({
      type: "HANDLE INPUT TEXT",
      field: data.id,

      payload: data.value,
    });
  };

  const login = (e) => {
    e.preventDefault();
    if (loginUser.userName === "") {
      ErrorMessage("User name should not be blank!");
      return;
    } else if (loginUser.password === "") {
      ErrorMessage("Password should not be blank!");
      return;
    }

    let encryptPass = SHA256(loginUser.password).toString(enc.Hex);
    //console.log(encryptPass);
    loginUser.password = encryptPass;
    let url = "authentication/login";
    setLoad(true);
    postCall({
      endpoint: url,
      body: {
        username: loginUser.userName,
        password: loginUser.password,
      },
    })
      .then((data) => {
        //console.log(data);
        if (!data.failure) {
          //console.log(data);
          loginUser["broker"] = data.broker;
          loginUser["userId"] = data.userId;
          loginUser["email"] = data.email;
          loginUser["mobile"] = data.mobile;
          sessionStorage.setItem("user", JSON.stringify(loginUser));
          sessionStorage.setItem("isLogin", true);
          if (data.broker === "Shoonya") navigate("/trading-account");
          else {
            navigate("/dashboard");
          }
        } else {
          ErrorMessage(data.message);
        }
        setLoad(false);
      })
      .catch((error) => {
        setLoad(false);
      });
  };

  return (
    <Fragment>
      {load && <CustomLoader />}
      <Provider store={store}>
        <Setting />
        <div
          className="container-fluid d-flex align-items-center justify-content-center back"
          style={{
            // background: `url('${process.env.PUBLIC_URL}/assets/images/backGround.jpg')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            overflow: "auto",
            height: "100vh",
          }}
        >
          <div className="login-div login-background ">
            <form>
              <div className="card">
                <div className="card-header">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/images/Login.png`}
                    width="32px"
                    alt=""
                    className="me-3"
                  />
                  Login
                  <span className="float-end">
                    <Link to="/help">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/images/video.png`}
                        width="40px"
                        alt=""
                        className="hand"
                        title="Help"
                      />
                    </Link>
                  </span>
                </div>
                <div className="card-body">
                  <div className="col-sm-12 mt-3">
                    <Input
                      id="userName"
                      value={loginUser.userName}
                      inputType="inputgroup"
                      placeholder={"User Id"}
                      icon={<i className="fa fa-user-circle"></i>}
                      events={{ onChange: (data) => onInputChange(data) }}
                      classes={{
                        contClass: "",
                        errorClass: "error-label",
                        fieldClass: "form-control form-control-sm",
                        labelClass: "large-text-header",
                      }}
                    />
                  </div>
                  <div className="col-sm-12 mt-3">
                    <Input
                      id="password"
                      value={loginUser.password}
                      inputType="inputgroup"
                      type="password"
                      placeholder={"Password"}
                      icon={<i className="fa fa-key"></i>}
                      events={{ onChange: (data) => onInputChange(data) }}
                      classes={{
                        contClass: "",
                        errorClass: "error-label",
                        fieldClass: "form-control form-control-sm",
                        labelClass: "large-text-header",
                      }}
                    />
                  </div>
                  <div className="mt-4 p=0 m-0 d-flex align-items-center">
                    <div className="col-sm-12">
                      <Button
                        buttonType="create"
                        style={{ width: "100%" }}
                        onClick={login}
                      >
                        Login
                      </Button>
                    </div>
                  </div>

                  <div className="col-sm-12 mt-2">
                    <div className="d-flex justify-content-between">
                      <div className="link">
                        <Link to="/registration"> Register</Link>
                      </div>
                      <div className="link">
                        <Link to="/forgotPassword">Forgot Password</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Provider>
    </Fragment>
  );
};

Login.propTypes = {};

export default Login;
