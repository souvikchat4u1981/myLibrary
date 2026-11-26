import React, { Fragment } from "react";
import PropTypes from "prop-types";
import MainListFolder from "./MainListFolder";

const MainList = (props) => {
  return (
    <Fragment>
      <div className="saas-page-header">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <h1 className="saas-page-title">
            <i className="fa-solid fa-user-pen golden-text"></i>
            Authors
          </h1>
          {props.author && props.author.length > 0 && (
            <span className="saas-badge">
              <i className="fa-solid fa-users"></i>
              {props.author.length} Authors
            </span>
          )}
        </div>

        <div className="input-group saas-search-box">
          <input
            type="text"
            className="form-control"
            placeholder="Search by author..."
            value={props.searchParam}
            onChange={props.onFilterChange}
          />
          <span className="input-group-text" id="basic-addon2">
            <i className="fa fa-search"></i>
          </span>
        </div>
      </div>

      <div className="saas-grid">
        {props.author &&
          props.author.length > 0 &&
          props.author.map((m) => (
            <MainListFolder
              key={m.authorName}
              data={m}
              onClickAuthor={props.onClickAuthor}
            />
          ))}
      </div>
    </Fragment>
  );
};

MainList.propTypes = {};

export default MainList;
