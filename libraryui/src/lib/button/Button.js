import React from "react";
import "./button.scss";
import PropTypes from "prop-types";
const Button = (props) => {
  const backGroundColor = () => {
    if (props.buttonType === "create") {
      return "createButtonColor";
    } else if (props.buttonType === "stopLoss") {
      return "stopLossButtonColor";
    } else if (props.buttonType === "loss") {
      return "lossButtonColor";
    }

    return "createButtonColor";
  };

  return (
    <button
      className={`btn btn-sm shadow-none ${backGroundColor()} ${
        props.extraClass
      }`}
      onClick={props.onClick}
      disabled={props.disabled}
      style={props.style}
      type={props.type}
      title={props.title}
    >
      {props.children}
    </button>
  );
};
Button.propTypes = {
  extraClass: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.string,
  disabled: PropTypes.bool,
  buttonType: PropTypes.string,
};

Button.defaultProps = {
  extraClass: "",
  onClick: undefined,
  children: "Create",
  disabled: false,
  buttonType: "create",
};

export default Button;
