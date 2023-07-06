import React from "react";
import PropTypes from "prop-types";
import "../book.scss";

const OnlineBook = (props) => {
  return (
    <div className="col-sm-2 mb-2">
      <div className="col-sm-12 shelf p-2 text-center">
        <div>
          <img src={props.data.image} alt={props.data.image} width={"90%"} />
        </div>
        <div style={{ fontSize: "20px" }}>{props.data.bookName}</div>
        <div>{props.data.author}</div>
      </div>
    </div>
  );
};

OnlineBook.propTypes = {};

export default OnlineBook;
