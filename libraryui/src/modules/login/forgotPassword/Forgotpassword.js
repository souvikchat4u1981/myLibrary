import React, { Fragment, useReducer, useState } from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import store from "../../../store/Store";
import Setting from "../../../common/layout/Setting";
import { useNavigate } from "react-router-dom";
import Input from "../../../lib/input/Input";
import formReducer from "../../../lib/formReducer/FormReducer";
import Button from "../../../lib/button/Button";
import CustomLoader from "../../../lib/customLoader/CustomLoader";
import { postCall } from "../../../utils/RestCalls";
import {
  ErrorMessage,
  SuccessMessage,
} from "../../../lib/toastMessage/Toastmessage";

const Forgotpassword = (props) => {
  const navigate = useNavigate();
  const [requiredInfo, setRequiredInfo] = useState({ username: "", email: "" });
  const [load, setLoad] = useState(false);
  let [forgotPassword, forgotPasswordDispatch] = useReducer(formReducer, {
    username: "",
    email: "",
  });

  const onInputChange = (data) => {
    let d = requiredInfo;
    d[data.id] = data.value;
    setRequiredInfo(d);

    forgotPasswordDispatch({
      type: "HANDLE INPUT TEXT",
      field: data.id,

      payload: data.value,
    });

    // setIsValid(validate());
  };

  const forgotUserPassword = (e) => {
    e.preventDefault();
    console.log(requiredInfo);
    setLoad(true);
    let url = "user/forgot-password";
    postCall({
      endpoint: url,
      body: requiredInfo,
    }).then((data) => {
      //console.log(data);
      if (!data.failure) {
        //console.log(data);
        SuccessMessage("New password send to your registered mail.");
        navigate("/login");
      } else {
        ErrorMessage(data.message);
      }
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
                    src={`${process.env.PUBLIC_URL}/assets/images/registration.png`}
                    width="32px"
                    alt=""
                    className="me-3"
                  />
                  Forgot Password
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
                  <div className="col-sm-12 mt-3">
                    <Input
                      id="username"
                      value={requiredInfo.username}
                      inputType="inputgroup"
                      placeholder={`User Id`}
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
                      id="email"
                      value={requiredInfo.email}
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
                  <div className="mt-4 p=0 m-0 d-flex align-items-center">
                    <div className="col-sm-12">
                      <Button
                        buttonType="create"
                        style={{ width: "100%" }}
                        onClick={forgotUserPassword}
                        // disabled={!isValid}
                      >
                        Submit
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

Forgotpassword.propTypes = {};

export default Forgotpassword;
