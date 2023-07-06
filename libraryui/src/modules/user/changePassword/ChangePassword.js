import React, { Fragment, useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";
import formReducer from "../../../lib/formReducer/FormReducer";
import Input from "../../../lib/input/Input";
import Button from "../../../lib/button/Button";
import { enc, SHA256 } from "crypto-js";
import { postCall } from "../../../utils/RestCalls";
import { useNavigate } from "react-router-dom";
import {
  ErrorMessage,
  SuccessMessage,
} from "../../../lib/toastMessage/Toastmessage";
import CustomLoader from "../../../lib/customLoader/CustomLoader";

const ChangePassword = (props) => {
  const [changeModel, setChangeModel] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    username: "",
  });

  let [changePassword, changePasswordDispatcher] = useReducer(
    formReducer,
    changeModel
  );

  const [valid, setValid] = useState(false);
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState("");
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (props.user) {
      let d = { ...changeModel };
      d.username = props.user.username;
      setChangeModel(d);
      changePasswordDispatcher({
        type: "SET INITIAL VALUE",

        payload: d,
      });
    }
  }, [props.user]);

  const onInputChange = (data) => {
    let d = changeModel;
    d[data.id] = data.value;
    changePasswordDispatcher({
      type: "HANDLE INPUT TEXT",
      field: data.id,

      payload: data.value,
    });
    setChangeModel(d);

    let valid = checkvalidation(d);
    setValid(valid);
  };

  const checkvalidation = (data) => {
    if (data.confirmPassword === "") {
      return false;
    }
    if (data.newPassword === "" || data.oldPassword === "") {
      return false;
    }
    if (data.oldPassword !== "" && data.newPassword !== "") {
      if (data.oldPassword === data.newPassword) {
        setShowError(true);
        setMessage("Old password and new password are same");
        return false;
      }
    }
    if (data.confirmPassword !== data.newPassword) {
      if (data.newPassword !== "" && data.confirmPassword !== "") {
        setShowError(true);
        setMessage("New password and confirm password are not same");
      }
      return false;
    } else if (data.confirmPassword === data.newPassword) {
      if (data.newPassword !== "" && data.confirmPassword !== "") {
        setShowError(false);
      }
    }
    return true;
  };

  const Save = (e) => {
    let d = { ...changePassword };
    d.oldPassword = SHA256(d.oldPassword).toString(enc.Hex);
    d.newPassword = SHA256(d.newPassword).toString(enc.Hex);

    console.log(d);

    e.preventDefault();
    setLoad(true);
    let url = "user/reset-password";
    postCall({
      endpoint: url,
      body: d,
    })
      .then((data) => {
        // if (data.httpStatusCode > 300 || data.httpStatusCode < 200) {
        //   navigate("/login");
        // }
        if (!data.failure) {
          SuccessMessage("Password reset Successfully");
          props.setPasswordChangeShow(false);
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
      <div className="row col-sm-12 p-2">
        <div className="col-sm-12 col-md-12 col-lg-12">
          <div className="col-sm-12">
            <Input
              id="oldPassword"
              value={changeModel.oldPassword}
              type="password"
              inputType="text"
              label="Old Password"
              placeholder={"Old Password"}
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

          <div className="col-sm-12 mt-2">
            <Input
              id="newPassword"
              value={changeModel.newPassword}
              type="password"
              inputType="text"
              label="New Password"
              placeholder={"New Password"}
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

          <div className="col-sm-12 mt-2">
            <Input
              id="confirmPassword"
              value={changeModel.confirmPassword}
              type="password"
              inputType="text"
              label="Confirm Password"
              placeholder={"Confirm Password"}
              icon={<i className="fa fa-user-circle"></i>}
              events={{ onChange: (data) => onInputChange(data) }}
              classes={{
                contClass: "",
                errorClass: "error-label",
                fieldClass: "form-control form-control-sm",
                labelClass: "large-text-header",
              }}
            />
            {showError && (
              <div className="loss" style={{ fontSize: "12px" }}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="row border-top ms-0 me-0 pt-2 pb-2 ps-2 golden-border-color">
        <Button extraClass={"col-sm-3"} disabled={!valid} onClick={Save}>
          Save
        </Button>
      </div>
    </Fragment>
  );
};

ChangePassword.propTypes = {};

export default ChangePassword;
