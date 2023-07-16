import React, { Fragment, useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../../lib/input/Input";
import formReducer from "../../lib/formReducer/FormReducer";
import Button from "../../lib/button/Button";
import { SideBySideMagnifier } from "react-image-magnifiers";

const Borrow = (props) => {
  const location = useLocation();
  const [book, setBook] = useState(null);
  const initBorrow = {
    borrowId: "0",
    borrowBy: "",
    bookId: 0,
    borrowDate: null,
    returnDate: null,
    isReturn: false,
  };
  const [borrow, setBorrow] = useState(initBorrow);
  const navigate = useNavigate();
  useEffect(() => {
    if (location.state) {
      if (typeof location.state.book !== "undefined") {
        if (location.state.book) {
          setBook(location.state.book);
          let b = location.state.book;
          let borrow = initBorrow;
          borrow.bookId = b.bookId;

          newBorrowfDispatch({
            type: "SET INITIAL VALUE",

            payload: borrow,
          });
          setBorrow(borrow);
        }
      }
    } else {
      let d = initBorrow;
      newBorrowfDispatch({
        type: "SET INITIAL VALUE",

        payload: d,
      });
    }
  }, []);

  let [newBorrow, newBorrowfDispatch] = useReducer(formReducer, initBorrow);
  const onInputChange = (data) => {
    let d = borrow;
    d[data.id] = data.value;

    newBorrowfDispatch({
      type: "HANDLE INPUT TEXT",
      field: data.id,

      payload: data.value,
    });
  };

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
                <div className="col-sm-12 text-center d-flex align-items-center justify-content-center">
                  <div style={{ width: "30%" }}>
                    <SideBySideMagnifier
                      imageSrc={`${process.env.PUBLIC_URL}/assets/bookImages/${
                        book.bookImage !== "" ? book.bookImage : "book.png"
                      }`}
                      width={"30%"}
                      imageAlt="library"
                      largeImageSrc={`${
                        process.env.PUBLIC_URL
                      }/assets/bookImages/${
                        book.bookImage !== "" ? book.bookImage : "book.png"
                      }`} // Optional
                      // magnifierSize={"50%"}
                      alwaysInPlace={false}
                      fillAvailableSpace={true}
                      magnifierBorderColor="rgba(255, 255, 255, .5)"
                      zoomContainerBorder="1px solid #ccc"
                      zoomContainerBoxShadow="0 4px 8px rgba(0,0,0,.5)"
                    />
                  </div>
                  {/* <img
                    src={`${process.env.PUBLIC_URL}/assets/bookImages/${
                      book.bookImage !== "" ? book.bookImage : "book.png"
                    }`}
                    alt="library"
                    width={"30%"}
                    className="img-fluid rounded img-thumbnail"
                  />{" "} */}
                </div>
                <div className="col-sm-6 mt-2 text-center">{book.bookName}</div>
                <div className="col-sm-6 mt-2 text-center">
                  By: {book.authorName}
                </div>
                <div className="col-sm-12 mt-2 text-center">
                  {book.shelfName}
                </div>
                {book.description && (
                  <div
                    className="col-sm-12 mt-2 text-center"
                    style={{ maxHeight: "100px", overflow: "auto" }}
                  >
                    <p>{book.description}</p>
                  </div>
                )}
              </div>
              <div className="row mt-2 mb-2">
                <form>
                  <div className="row">
                    <div className="col-sm-6">
                      <Input
                        id="borrowBy"
                        label="Lend To"
                        type=""
                        value={newBorrow.borrowBy}
                        events={{ onChange: (data) => onInputChange(data) }}
                        classes={{
                          errorClass: "error-label",
                          fieldClass: "form-control form-control-sm",
                        }}
                      ></Input>
                    </div>
                    <div className="col-sm-6 customDatePickerWidth">
                      <Input
                        id="borrowDate"
                        label="Lend Date"
                        type="date"
                        inputType="text"
                        value={newBorrow.borrowDate}
                        showIcon={true}
                        events={{ onChange: (data) => onInputChange(data) }}
                        classes={{
                          errorClass: "error-label",
                          fieldClass: "form-control form-control-sm",
                        }}
                      ></Input>
                    </div>
                    <div className="col-sm-6 customDatePickerWidth mt-2">
                      <Input
                        id="returnDate"
                        label="Return Date"
                        type="date"
                        inputType="text"
                        value={newBorrow.returnDate}
                        showIcon={true}
                        events={{ onChange: (data) => onInputChange(data) }}
                        classes={{
                          errorClass: "error-label",
                          fieldClass: "form-control form-control-sm",
                        }}
                      ></Input>
                    </div>
                    <div className="col-sm-6 customDatePickerWidth mt-2">
                      <div className="row col-sm-12 ps-4 mt-4">
                        <Button>Save</Button>
                      </div>
                    </div>
                  </div>
                </form>
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
