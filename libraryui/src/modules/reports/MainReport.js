import React, { Fragment } from "react";
import PropTypes from "prop-types";
import "./report.scss";
import { useNavigate } from "react-router-dom";

const MainReport = (props) => {
  const navigate = useNavigate();
  return (
    <Fragment>
      <div
        className="container p-0 pt-3 main-report-div"
        style={{
          height: "50vh",
          width: "50%",
          position: "absolute",
          top: "25%",
          left: "25%",
        }}
      >
        <div className="text-center border-bottom pb-2 border-golden">
          Reports
        </div>
        <div
          className="d-flex justify-content-around align-items-center"
          style={{ height: "100%" }}
        >
          <div
            className="shelf text-center"
            onClick={() => navigate("/bookList")}
          >
            <div>
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/BookStack.png`}
                alt="library"
                width={"40%"}
              />
            </div>
            <div className="mb-2">Book List</div>
          </div>
          <div className="shelf text-center">
            <div>
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/author.png`}
                alt="library"
                width={"40%"}
              />
            </div>
            <div className="mb-2">Author List</div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

MainReport.propTypes = {};

export default MainReport;
