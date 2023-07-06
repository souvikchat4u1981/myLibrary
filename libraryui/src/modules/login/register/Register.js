import React, { Fragment, useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import store from "../../../store/Store";
import Setting from "../../../common/layout/Setting";
import { useNavigate } from "react-router-dom";
import formReducer from "../../../lib/formReducer/FormReducer";
import Input from "../../../lib/input/Input";
import { getCall, postCall } from "../../../utils/RestCalls";
import Button from "../../../lib/button/Button";
import { enc, SHA256 } from "crypto-js";
import {
  ErrorMessage,
  SuccessMessage,
} from "../../../lib/toastMessage/Toastmessage";

const Register = (props) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [initialData] = useState({
    username: "",
    password: "",
    broker: "None",
    vendorCode: "",
    appkey: "",
    status: "Approved",
    id: 0,
    email: "",
    mobile: "",
  });
  let [loginUser, loginUserDispatch] = useReducer(formReducer, initialData);
  const [load, setLoad] = useState(false);
  const [brokers, setBrokers] = useState([]);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    loginUserDispatch({
      type: "SET INITIAL VALUE",

      payload: initialData,
    });
    setUser(initialData);
    sessionStorage.clear();
    getBroker();
  }, []);

  const getBroker = () => {
    let url = "broker";
    getCall({
      endpoint: url,
    }).then((data) => {
      //console.log(data);
      if (!data.failure) {
        setBrokers(data.brokers);
      }
      setLoad(false);
    });
  };

  const onInputChange = (data) => {
    let d = user;
    d[data.id] = data.value;
    if (data.id === "username" && d.broker === "Shoonya") {
      d["vendorCode"] = data.value + "_U";
      loginUserDispatch({
        type: "HANDLE INPUT TEXT",
        field: "vendorCode",

        payload: data.value + "_U",
      });
    }
    setUser(d);

    loginUserDispatch({
      type: "HANDLE INPUT TEXT",
      field: data.id,

      payload: data.value,
    });

    setIsValid(validate());
  };

  const register = (e) => {
    e.preventDefault();
    let obj = {
      username: "",
      password: "",
      broker: "",
      id: 0,
      vendorCode: "",
      appkey: "",
      status: "Approved",
    };

    obj.username = loginUser.username;
    if (loginUser.password !== "")
      obj.password = SHA256(loginUser.password).toString(enc.Hex);
    obj.broker = loginUser.broker;
    obj.mobile = loginUser.mobile;
    obj.email = loginUser.email;
    if (obj.broker === "Shoonya") {
      obj.appkey = SHA256(loginUser.appkey).toString(enc.Hex);
      obj.vendorCode = loginUser.vendorCode;
    }

    if (obj.broker === "0" || obj.broker === "") {
      ErrorMessage("Select a valid broker or Self");
      return;
    }
    if (obj.username === "") {
      ErrorMessage("User name is blank");
      return;
    }

    if (obj.password === "") {
      ErrorMessage("Password is blank");
      return;
    }

    if (loginUser.broker === "Shoonya" && loginUser.vendorCode === "") {
      ErrorMessage("Vendor code required for Shoonya");
      return;
    }

    if (loginUser.broker === "Shoonya" && loginUser.appkey === "") {
      ErrorMessage("App key required for Shoonya");
      return;
    }

    let url = "user/registration";

    setLoad(true);
    postCall({
      endpoint: url,
      body: obj,
    }).then((data) => {
      //console.log(data);
      if (!data.failure) {
        //console.log(data);
        SuccessMessage("User Registered...");
        navigate("/login");
      } else {
        ErrorMessage(data.message);
      }
      setLoad(false);
    });
  };

  const validate = () => {
    let isValid = false;

    const mobileRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    const emailRegex =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    const isMobileSatisfied = mobileRegex.test(loginUser.mobile.toString());
    const isEmailSatisfied = emailRegex.test(loginUser.email.toString());
    if (!isMobileSatisfied) {
      return false;
    }

    if (!isEmailSatisfied) {
      return false;
    }

    if (
      loginUser.username !== "" &&
      loginUser.password !== "" &&
      loginUser.email !== "" &&
      loginUser.mobile !== ""
    ) {
      isValid = true;
    }

    return isValid;
  };

  return (
    <Fragment>
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
                    src={`${process.env.PUBLIC_URL}/assets/images/registration.png`}
                    width="32px"
                    alt=""
                    className="me-3"
                  />
                  Registration
                  <div className="float-end">
                    <i
                      className="fas fa-arrow-left hand"
                      onClick={() => {
                        navigate("/login");
                      }}
                    ></i>
                  </div>
                </div>
                <div className="card-body">
                  {/* <div className="col-sm-12 mt-3">
                    <Input
                      id="broker"
                      //   label="Broker Name"
                      type="dropdown"
                      inputType="inputgroup"
                      icon={<i className="fa fa-chart-line"></i>}
                      required
                      value={loginUser.broker}
                      events={{ onChange: (data) => onInputChange(data) }}
                      classes={{
                        contClass: "",
                        errorClass: "error-label",
                        fieldClass: "form-select form-select-sm",
                      }}
                    >
                      <option value={"0"}>Select Broker Name</option>
                      <option value={"None"}>Self</option>
                      {brokers &&
                        brokers.map((m) => {
                          return (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          );
                        })}
                    </Input>
                  </div> */}
                  <div className="col-sm-12 mt-3">
                    <Input
                      id="username"
                      value={loginUser.username}
                      inputType="inputgroup"
                      placeholder={`${
                        loginUser.broker !== "None" && loginUser.broker !== "0"
                          ? loginUser.broker + " "
                          : ""
                      }User Id`}
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
                      placeholder={`${
                        loginUser.broker !== "None" && loginUser.broker !== "0"
                          ? loginUser.broker + " "
                          : ""
                      }Password`}
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
                  <div className="col-sm-12 mt-3">
                    <Input
                      id="mobile"
                      value={loginUser.mobile}
                      inputType="inputgroup"
                      type="text"
                      placeholder="Mobile"
                      icon={<i class="fa-solid fa-mobile-screen-button"></i>}
                      events={{ onChange: (data) => onInputChange(data) }}
                      validate={"validatemobile"}
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
                      id="email"
                      value={loginUser.email}
                      inputType="inputgroup"
                      type="text"
                      placeholder="Email"
                      icon={<i class="fa-solid fa-at"></i>}
                      events={{ onChange: (data) => onInputChange(data) }}
                      validate={"validateemail"}
                      classes={{
                        contClass: "",
                        errorClass: "error-label",
                        fieldClass: "form-control form-control-sm",
                        labelClass: "large-text-header",
                      }}
                    />
                  </div>
                  {loginUser.broker === "Shoonya" && (
                    <Fragment>
                      <div className="col-sm-12 mt-3">
                        <Input
                          id="vendorCode"
                          value={loginUser.vendorCode}
                          inputType="inputgroup"
                          type="text"
                          placeholder="Vendor Code"
                          icon={<i className="fa fa-user"></i>}
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
                          id="appkey"
                          value={loginUser.appkey}
                          inputType="inputgroup"
                          type="text"
                          placeholder="App Key"
                          icon={<i className="fa fa-lock-open"></i>}
                          events={{ onChange: (data) => onInputChange(data) }}
                          classes={{
                            contClass: "",
                            errorClass: "error-label",
                            fieldClass: "form-control form-control-sm",
                            labelClass: "large-text-header",
                          }}
                        />
                      </div>
                    </Fragment>
                  )}
                  <div className="mt-4 p=0 m-0 d-flex align-items-center">
                    <div className="col-sm-12">
                      <Button
                        buttonType="create"
                        style={{ width: "100%" }}
                        onClick={register}
                        disabled={!isValid}
                      >
                        Register
                      </Button>
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

Register.propTypes = {};

export default Register;
