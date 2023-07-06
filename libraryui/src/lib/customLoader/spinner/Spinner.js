import React from "react";

import "./spinner.css";
import { Bars } from "react-loader-spinner";
export const Spinner = (props) => {
  // //console.log(props.spinnerConfig);
  return (
    <div className="parentDisable">
      <div className="overlay-box">
        <Bars
          height={props.spinnerConfig.height}
          width={props.spinnerConfig.width}
          color={props.spinnerConfig.color}
          ariaLabel="loading-indicator"
        />
      </div>
    </div>
  );
};
