import React from "react";
import PropTypes from "prop-types";
import Setting from "../layout/Setting";
import "./access-denied.scss";

const AccessDenied = (props) => {
  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <Setting />
      <div className="cage"></div>
      <h1>
        <span className="span">403</span>
      </h1>
    </div>
  );
};

AccessDenied.propTypes = {};

export default AccessDenied;
