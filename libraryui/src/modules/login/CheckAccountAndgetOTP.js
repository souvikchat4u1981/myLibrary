import React, { Fragment, useState } from "react";
import "./login.scss";
import Setting from "../../common/layout/Setting";
import Input from "../../lib/input/Input";
import Button from "../../lib/button/Button";
import RequireAuth from "../../routes/RequireAuth";
import { Provider } from "react-redux";
import store from "../../store/Store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { postCall } from "../../utils/RestCalls";
import CustomLoader from "../../lib/customLoader/CustomLoader";

const CheckAccountAndgetOTP = (props) => {
  const [totp, setTotp] = useState(null);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const onInputChange = (data) => {
    setTotp(data.value);
  };
  const login = (e) => {
    e.preventDefault();

    let user = JSON.parse(sessionStorage.getItem("user"));
    let url = "authentication/broker";
    if (totp !== "" && totp !== null) {
      setLoad(true);
      //console.log(url);

      postCall({
        endpoint: url,
        body: {
          username: user.userName,
          password: user.password,
          otp: totp,
          broker: user.broker,
        },
      }).then((data) => {
        //console.log(data);
        if (!data.failure) {
          //console.log(data.data);
          navigate("/dashboard");
        }
        setLoad(false);
      });
    }
    // axios
    //   .post(url, {
    //     username: user.userName,
    //     password: user.password,
    //     otp: totp,
    //     headers: {},
    //   })
    //   .then((response) => {
    //     if (response.status === 200) {
    //       //console.log(response.data);
    //       navigate("/dashboard");
    //     }
    //   });
  };
  return (
    <Fragment>
      {load && <CustomLoader />}
      <Provider store={store}>
        <RequireAuth authed={JSON.parse(sessionStorage.getItem("isLogin"))}>
          <Setting />
          <div
            className="container-fluid d-flex align-items-center justify-content-center"
            style={{
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              overflow: "auto",
              height: "100vh",
            }}
          >
            <div className="login-div login-background ">
              <div className="col-sm-12 p-0 m-0">
                <div className="card">
                  <div className="card-header">Please enter Shoonya TOTP</div>
                  <div className="card-body">
                    <form>
                      <div className="col-sm-12 mt-3">
                        <Input
                          id="userName"
                          value={totp}
                          type="inputgroup"
                          inputType="password"
                          placeholder={"Please enter TOTP"}
                          icon={<i className="fa-solid fa-ticket"></i>}
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
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RequireAuth>
      </Provider>
    </Fragment>
  );
};

CheckAccountAndgetOTP.propTypes = {};

export default CheckAccountAndgetOTP;
