import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";

const Borrow = (props) => {
  const location = useLocation();
  const [book, setBook] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (location.state) {
      if (typeof location.state.book !== "undefined") {
        if (location.state.book) {
          setBook(location.state.book);
        }
      }
    }
  }, []);
  return (
    <Fragment>
      <div className="container-fluid">
        <div className="p-2 pt-3">
          <i
            className="fa fa-circle-left fa-2x hand golden-text"
            onClick={() => navigate(-1)}
          ></i>
        </div>
        {book && (
          <div className="p-2 pt-3 row col-sm-12 d-flex justify-content-center">
            <div className="add-book " style={{ width: "30%" }}>
              <div className="row border-bottom golden-border-color p-3 mb-2">
                <div className="col-sm-12 text-center">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/bookImages/${
                      book.bookImage !== "" ? book.bookImage : "book.png"
                    }`}
                    alt="library"
                    width={"30%"}
                    className="img-fluid rounded img-thumbnail"
                  />{" "}
                </div>
                <div className="col-sm-6 mt-2 text-center">{book.bookName}</div>
                <div className="col-sm-6 mt-2 text-center">
                  {book.authorName}
                </div>
                <div className="col-sm-12 mt-2 text-center">
                  {book.shelfName}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

Borrow.propTypes = {};

export default Borrow;
