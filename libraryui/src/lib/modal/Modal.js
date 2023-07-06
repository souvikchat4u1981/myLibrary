import React, { Fragment, useEffect, useState } from "react";
import ModalComp from "react-modal";
import "./modal.scss";
import PropTypes from "prop-types";

const Modal = (props) => {
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();
  const customStyles = {
    content: {
      top: props.top ? props.top : "60%",
      left: "50%",
      right: "auto",
      // bottom: "auto",
      marginRight: "0%",
      transform: "translate(-50%, -50%)",
      width: props.width ? props.width : "50%",
      height: props.height ? props.height : "90%",
      padding: "0px !important",
      background: "transparent",
      marginTop: props.marginTop,
      marginBottom: props.marginBottom,
      border: "none",
    },
  };

  useEffect(() => {
    ModalComp.setAppElement("#main");
    customStyles.content.width = props.width || "50%";
    customStyles.content.height = props.height || "90%";
  }, [props.width, props.height]);

  let subtitle;

  return (
    <Fragment>
      <ModalComp
        parentSelector={() => document.querySelector("#main")}
        isOpen={props.isOpen}
        onAfterOpen={props.onAfterOpen}
        onRequestClose={props.onRequestClose}
        style={customStyles}
        contentLabel={props.label}
        role={"dialog"}
        shouldCloseOnOverlayClick={props.shouldCloseOnOverlayClick}
        preventScroll={false}
        overlayClassName="Overlay"
      >
        <div className="card modalBody ">
          <div className="card-header text-white modalHeader headerText  user-panel">
            {props.headerLabel}
            {props.showCloseButton && (
              <span className="float-end hand" onClick={props.onRequestClose}>
                <i className="fa fa-times-circle"></i>
              </span>
            )}
          </div>
          <div className="mbody">{props.children}</div>
        </div>
      </ModalComp>
    </Fragment>
  );
};

Modal.propTypes = {
  showHeader: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  onRequestClose: PropTypes.func,
  headerLabel: PropTypes.string,
  shouldCloseOnOverlayClick: PropTypes.bool,
  isOpen: PropTypes.bool,
  marginTop: PropTypes.string,
  marginBottom: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
};

Modal.defaultProps = {
  showHeader: true,
  showCloseButton: true,
  onRequestClose: () => console.log("Close Clicked"),
  headerLabel: "Header",
  shouldCloseOnOverlayClick: false,
  isOpen: true,
  marginTop: undefined,
  marginBottom: undefined,
  width: undefined,
  height: undefined,
};
export default Modal;
