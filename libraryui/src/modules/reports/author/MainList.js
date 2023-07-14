import React, { Fragment } from "react";
import PropTypes from "prop-types";

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
        {props.author &&
          props.author.map((m, index) => {
            return (
              <div key={index} className="hand mb-4" style={{ width: "10%" }}>
                <div className="col-sm-12 shelf text-center p-2 shadow">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/authorImage/${
                      m.authorImage !== "" ? m.authorImage : "author.png"
                    }`}
                    alt="library"
                    width={"100%"}
                    className="me-2"
                    onClick={() => props.onClickAuthor(m)}
                  />
                  <div className="mt-2" onClick={() => props.onClickAuthor(m)}>
                    <b>{m.authorName}</b>
                  </div>
                  <div className="mt-2" onClick={() => props.onClickAuthor(m)}>
                    Books : {m.bookCount}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </Fragment>
  );
};

MainList.propTypes = {};

export default MainList;
