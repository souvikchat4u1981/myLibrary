import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import DisplayBooks from "../DisplayBooks";

const ChildShelf = (props) => {
  const navigate = useNavigate();
  return (
    <Fragment>
      <div className="p-2 pt-3 row d-flex">
        <div>
          <i
            className="fa fa-circle-left fa-2x hand golden-text"
            onClick={() => navigate("/shelfDetails")}
            title="back to home"
          ></i>
          <i
            className="fa fa-plus-circle fa-2x hand golden-text ms-2"
            onClick={() =>
              navigate("/addBook", {
                state: {
                  shelf: JSON.parse(
                    sessionStorage.getItem("currentChildShelf")
                  ),
                },
              })
            }
            title="Add New Book"
          ></i>
        </div>
        <div className="col-sm-12 text-center fs-2">
          {JSON.parse(sessionStorage.getItem("currentChildShelf")).shelfName}
        </div>
        <div className="row mt-2 p-2">
          <DisplayBooks />
        </div>
      </div>
    </Fragment>
  );
};

ChildShelf.propTypes = {};

export default ChildShelf;
