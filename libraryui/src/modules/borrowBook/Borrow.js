import React, { Fragment, useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../../lib/input/Input";
import formReducer from "../../lib/formReducer/FormReducer";
import Button from "../../lib/button/Button";
import { SideBySideMagnifier } from "react-image-magnifiers";
import { useLazyQuery, useMutation } from "@apollo/client";
import { BORROW_BOOK, GET_BORROW_DETAILS } from "../../queries/BookQueries";
import {
  ErrorMessage,
  SuccessMessage,
} from "../../lib/toastMessage/Toastmessage";

const Borrow = (props) => {
  const location = useLocation();
  const [book, setBook] = useState(null);
  const initBorrow = {
    borrowId: "0",
    borrowBy: "",
    bookId: 0,
    comment: "",
    borrowDate: new Date(),
    returnDate: new Date(),
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

          borrowBookInfo({ variables: { bookId: b.bookId } });
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
    if (data.id === "isReturn") {
      if (data.value === "false") {
        data.value = true;

        newBorrowfDispatch({
          type: "HANDLE INPUT TEXT",
          field: "returnDate",

          payload: new Date(),
        });
      } else {
        data.value = false;
      }
    }
    d[data.id] = data.value;

    newBorrowfDispatch({
      type: "HANDLE INPUT TEXT",
      field: data.id,

      payload: data.value,
    });
  };

  const [borrowBookInfo] = useLazyQuery(GET_BORROW_DETAILS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (!data.bookBorrowedBy.failure) {
        if (data.bookBorrowedBy.borrow) {
          newBorrowfDispatch({
            type: "SET INITIAL VALUE",

            payload: data.bookBorrowedBy.borrow,
          });
          setBorrow(data.bookBorrowedBy.borrow);
        }
      } else {
        ErrorMessage(data.bookBorrowedBy.message);
      }
    },

    onError: (data) => {
      console.log(data);
    },
  });

  const [borrowBook] = useMutation(BORROW_BOOK, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (!data.addBookToBorrow.failure) {
        SuccessMessage("Book Added to Borrow Successfully.");
      } else {
        ErrorMessage(data.addBookToBorrow.message);
      }
    },

    onError: (data) => {
      console.log(data);
    },
  });

  const onClickBorrow = (e) => {
    e.preventDefault();
    if (newBorrow.borrowId === 0) {
      newBorrow.returnDate = null;
      newBorrowfDispatch({
        type: "HANDLE INPUT TEXT",
        field: "returnDate",

        payload: null,
      });
    }
    borrowBook({ variables: { borrowBook: { borrow: newBorrow } } });
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
                  {newBorrow.borrowId > 0 && (
                    <div className="row">
                      <Input
                        id="isReturn"
                        label="Book Returned?"
                        type="checkbox"
                        value={newBorrow.isReturn}
                        checked={newBorrow.isReturn}
                        events={{ onChange: (data) => onInputChange(data) }}
                        classes={{
                          errorClass: "error-label",
                          fieldClass: "",
                        }}
                      ></Input>
                    </div>
                  )}
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
                        value={newBorrow.borrowDate}
                        showIcon={false}
                        events={{ onChange: (data) => onInputChange(data) }}
                        classes={{
                          errorClass: "error-label",
                          fieldClass: "form-control form-control-sm",
                        }}
                      ></Input>
                    </div>
                    <div className="col-sm-12 customDatePickerWidth">
                      <Input
                        id="comment"
                        label="Comment"
                        type="textarea"
                        rows="10"
                        value={newBorrow.comment}
                        events={{ onChange: (data) => onInputChange(data) }}
                        classes={{
                          errorClass: "error-label",
                          fieldClass: "form-control form-control-sm",
                        }}
                      ></Input>
                    </div>
                    {newBorrow.borrowId > 0 && newBorrow.isReturn === true && (
                      <div className="col-sm-6 customDatePickerWidth mt-2">
                        <Input
                          id="returnDate"
                          label="Return Date"
                          type="date"
                          inputType="text"
                          value={newBorrow.returnDate}
                          showIcon={false}
                          events={{ onChange: (data) => onInputChange(data) }}
                          classes={{
                            errorClass: "error-label",
                            fieldClass: "form-control form-control-sm",
                          }}
                        ></Input>
                      </div>
                    )}
                    <div className="col-sm-6 customDatePickerWidth mt-2">
                      <div className="row col-sm-12 ps-4 mt-4">
                        <Button onClick={onClickBorrow}>Save</Button>
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
