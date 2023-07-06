import React, { Fragment, useEffect, useReducer, useState } from "react";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import PropTypes from "prop-types";
import { postCall } from "../../../utils/RestCalls";
import {
  ErrorMessage,
  SuccessMessage,
} from "../../../lib/toastMessage/Toastmessage";
import { useNavigate } from "react-router-dom";
import CustomLoader from "../../../lib/customLoader/CustomLoader";
import Input from "../../../lib/input/Input";
import formReducer from "../../../lib/formReducer/FormReducer";
import Button from "../../../lib/button/Button";
import ChangePassword from "../changePassword/ChangePassword";

const Profile = (props) => {
  const [user, setUser] = useState(null);
  const [baseUser, setbaseUser] = useState(null);
  const [passwordChangeShow, setPasswordChangeShow] = useState(false);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const [emailEditEnable, setEmailEditEnable] = useState(false);
  const [mobileEditEnable, setMobileEditEnable] = useState(false);
  let [editUser, editUserDispatch] = useReducer(formReducer, null);
  useEffect(() => {
    loadUser();
  }, []);
  const loadUser = () => {
    let url = "user/get-user-by-id";
    setLoad(true);
    postCall({
      endpoint: url,
      body: JSON.parse(sessionStorage.getItem("user")).userId,
    })
      .then((data) => {
        console.log(data);
        if (data.httpStatusCode > 300 || data.httpStatusCode < 200) {
          navigate("/login");
        }
        if (!data.failure) {
          setUser({ ...data.user });
          setbaseUser({ ...data.user });
          editUserDispatch({
            type: "SET INITIAL VALUE",

            payload: data.user,
          });
        } else {
          ErrorMessage(data.message);
        }
        setLoad(false);
      })
      .catch((error) => {
        setLoad(false);
      });
  };

  const onInputChange = (data) => {
    let d = user;
    d[data.id] = data.value;
    editUserDispatch({
      type: "HANDLE INPUT TEXT",
      field: data.id,

      payload: data.value,
    });
    setUser(d);
  };

  const onCancelEmail = () => {
    let u = { ...baseUser };
    setUser(u);
    setEmailEditEnable(false);
    editUserDispatch({
      type: "HANDLE INPUT TEXT",
      field: "email",

      payload: u.email,
    });
  };

  const onCancelMobile = () => {
    let u = { ...baseUser };
    setUser(u);
    setMobileEditEnable(false);
    editUserDispatch({
      type: "HANDLE INPUT TEXT",
      field: "mobile",

      payload: u.mobile,
    });
  };

  const saveEmailMobile = (e) => {
    e.preventDefault();
    setLoad(true);
    let url = "user/change-details";
    postCall({
      endpoint: url,
      body: editUser,
    })
      .then((data) => {
        if (data.httpStatusCode > 300 || data.httpStatusCode < 200) {
          navigate("/login");
        }
        if (!data.failure) {
          setUser({ ...data.user });
          setbaseUser({ ...data.user });
          editUserDispatch({
            type: "SET INITIAL VALUE",

            payload: data.user,
          });
          SuccessMessage("Information updated...");
        } else {
          ErrorMessage(data.message);
        }
        setLoad(false);
        setEmailEditEnable(false);
        setMobileEditEnable(false);
      })
      .catch((error) => {
        setLoad(false);
      });
  };

  return (
    <Fragment>
      {load && <CustomLoader />}
      <Tooltip
        anchorSelect="#email"
        place="right"
        content="Edit Email"
        className="golden-tooltip"
      />
      <Tooltip
        anchorSelect="#emailCancel"
        place="right"
        content="Cancel Edit Email"
        className="golden-tooltip"
      />
      <Tooltip
        anchorSelect="#mobile"
        place="right"
        content="Edit Mobile"
        className="golden-tooltip"
      />
      <Tooltip
        anchorSelect="#mobileCancel"
        place="right"
        content="Cancel Edit Mobile"
        className="golden-tooltip"
      />
      {!passwordChangeShow && user && (
        <div className="row mt-4 ">
          <div className="d-flex justify-content-center mt-4">
            <div
              className="box-display"
              style={{ width: "40%", height: "auto" }}
            >
              <div className="float-start col-sm-12 border-bottom golden-border-color p-2 ">
                <span className="header-text ">Personal</span>
                <span
                  className="float-end hand running"
                  onClick={() => setPasswordChangeShow(true)}
                >
                  Change password
                </span>
              </div>
              <div className="row col-sm-12 p-2">
                <div className="col-sm-12 col-md-6 col-lg-8">
                  <div className="col-sm-12 running extra-small-text">
                    Email{" "}
                    {!emailEditEnable && (
                      <i
                        className="fa fa-pencil hand ps-2"
                        id="email"
                        onClick={() => setEmailEditEnable(!emailEditEnable)}
                      ></i>
                    )}
                    {emailEditEnable && (
                      <i
                        className="fa fa-times-circle loss hand ps-2"
                        id="emailCancel"
                        onClick={onCancelEmail}
                      ></i>
                    )}
                  </div>
                  <div className="col-sm-12 small-text">
                    {!emailEditEnable && user.email}
                    {emailEditEnable && (
                      <Input
                        id="email"
                        value={editUser.email}
                        type="text"
                        inputType="text"
                        placeholder={"Email"}
                        icon={<i className="fa fa-user-circle"></i>}
                        events={{ onChange: (data) => onInputChange(data) }}
                        classes={{
                          contClass: "",
                          errorClass: "error-label",
                          fieldClass: "form-control form-control-sm",
                          labelClass: "large-text-header",
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-4 ">
                  <div className="col-sm-12 running extra-small-text">
                    Mobile{" "}
                    {!mobileEditEnable && (
                      <i
                        className="fa fa-pencil hand ps-2"
                        id="mobile"
                        onClick={() => setMobileEditEnable(!mobileEditEnable)}
                      ></i>
                    )}
                    {mobileEditEnable && (
                      <i
                        className="fa fa-times-circle loss hand ps-2"
                        id="mobileCancel"
                        onClick={onCancelMobile}
                      ></i>
                    )}
                  </div>
                  <div className="col-sm-12 small-text">
                    {!mobileEditEnable && user.mobile}
                    {mobileEditEnable && (
                      <Input
                        id="mobile"
                        value={editUser.mobile}
                        type="text"
                        inputType="text"
                        placeholder={"Mobile"}
                        icon={<i className="fa fa-user-circle"></i>}
                        events={{ onChange: (data) => onInputChange(data) }}
                        classes={{
                          contClass: "",
                          errorClass: "error-label",
                          fieldClass: "form-control form-control-sm",
                          labelClass: "large-text-header",
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="row border-top ms-0 me-0 pt-2 pb-2 ps-2 golden-border-color">
                <Button
                  extraClass={"col-sm-3"}
                  disabled={!mobileEditEnable && !emailEditEnable}
                  onClick={saveEmailMobile}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {passwordChangeShow && (
        <div className="row mt-4 ">
          <div className="d-flex justify-content-center mt-4">
            <div
              className="box-display"
              style={{ width: "40%", height: "auto" }}
            >
              <div className="float-start col-sm-12 border-bottom golden-border-color p-2 ">
                <span className="header-text ">Change Password</span>
                <span
                  className="float-end hand running"
                  onClick={() => setPasswordChangeShow(false)}
                >
                  Cancel
                </span>
              </div>
              <ChangePassword
                user={user}
                setPasswordChangeShow={setPasswordChangeShow}
              />
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

Profile.propTypes = {};

export default Profile;
