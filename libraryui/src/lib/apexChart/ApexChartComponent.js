import React from "react";
import PropTypes from "prop-types";
import Chart from "react-apexcharts";
const ApexChartComponent = (props) => {
  return (
    <div
      style={{
        width: props.width ? props.width : "100%",
        height: props.height ? props.height : "100%",
      }}
    >
      <Chart
        options={props.options}
        series={props.series}
        type={props.type}

        // width="500"
      />
    </div>
  );
};

ApexChartComponent.propTypes = {
  options: PropTypes.object,
  series: PropTypes.object,
  type: PropTypes.string,
};

export default ApexChartComponent;
