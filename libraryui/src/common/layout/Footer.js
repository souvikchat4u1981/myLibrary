import React from "react";
import PropTypes from "prop-types";

const Footer = (props) => {
  return (
    <div className="fixed-bottom  bg-light">
      <span className="text-muted ps-2 pe-2" style={{ fontSize: "12px" }}>
        This is a personal app to maintain library. Please contact
        souvik.chatterjee1981@gmail.com for any kind of suggestion and query.
      </span>
    </div>
  );
};

Footer.propTypes = {};

export default Footer;
