import React, { Fragment } from "react";
import PropTypes from "prop-types";
import MainListFolder from "./MainListFolder";

const MainList = (props) => {
  return (
    <Fragment>
      <div className="p-2 pt-3 row col-sm-12">
        <div className="d-flex justify-content-start">
          <div class="input-group" style={{ width: "30%" }}>
            <input
              type="text"
              class="form-control col-sm-2"
              placeholder="Search By Author"
              value={props.searchParam}
              onChange={props.onFilterChange}
            />
            <span class="input-group-text" id="basic-addon2">
              <i className="fa fa-search"></i>
            </span>
          </div>
        </div>
      </div>
      <div className="p-2 pt-3 row d-flex">
        {props.author && props.author.length > 0 && (
          <div className="row mb-3">
            <div className="">
              <div
                className="badge rounded-pill bg-primary ms-2"
                style={{ fontSize: "15px", fontWeight: "normal" }}
              >
                Total authors {props.author.length}
              </div>
            </div>
          </div>
        )}
        {props.author &&
          props.author.length > 0 &&
          props.author.map((m, index) => {
            return (
              <MainListFolder
                key={m.authorName}
                data={m}
                onClickAuthor={props.onClickAuthor}
              />
            );
          })}
      </div>
    </Fragment>
  );
};

MainList.propTypes = {};

export default MainList;
