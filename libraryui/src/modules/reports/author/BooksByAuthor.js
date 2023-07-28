import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { SideBySideMagnifier } from "react-image-magnifiers";
import Button from "../../../lib/button/Button";
import { useMutation } from "@apollo/client";
import { DELETE_BOOK } from "../../../queries/BookQueries";
import {
  ErrorMessage,
  SuccessMessage,
} from "../../../lib/toastMessage/Toastmessage";
import { confirmAlert } from "react-confirm-alert";

const BooksByAuthor = (props) => {
  const [width, setWidth] = useState("100%");
  useEffect(() => {
    if (window.screen.width < 600) {
      setWidth("50%");
    } else {
      setWidth("12.5%");
    }
  }, [props.count]);

  const navigate = useNavigate();

  const switchSide = (index) => {
    let switchSide = false;
    if (index > 0) {
      let mod = index % 8;
      if (mod === 0 || mod === 7 || mod === 6) {
        switchSide = true;
      }
    }

    console.log(index, switchSide);
    return switchSide;
  };

  const [deleteBook] = useMutation(DELETE_BOOK, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (!data.deleteBook.failure) {
        SuccessMessage("Book Deleted Successfully.");
        props.refetch();
      } else {
        ErrorMessage(data.deleteBook.message);
      }
    },

    onError: (data) => {
      console.log(data);
    },
  });

  const onDeleteBook = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div
            className="p-2"
            style={{ border: "1px solid black", borderRadius: "8px" }}
          >
            <h1>Confirm to delete</h1>
            <p>You want to delete this book?</p>
            <Button onClick={onClose} extraClass={"btn-warning me-2"}>
              No
            </Button>
            <Button
              buttonType="loss"
              extraClass={"btn-danger"}
              onClick={() => {
                deleteBook({ variables: { bookId: id } });
                onClose();
              }}
            >
              Yes, Delete it!
            </Button>
          </div>
        );
      },
    });
  };

  const copyBook = (m) => {
    let book = {
      author: m.author,
      bookId: m.bookId,
      bookName: m.bookName,
      bookNameInEnglish: m.bookNameInEnglish,
      description: m.description,
      format: m.format,
      language: m.language,
      publicastion: m.publication,
      image: m.bookImage,
      shelfId: m.shelfId,
    };
    book.bookId = 0;
    navigate("/addBookToLibrary", {
      state: {
        book: book,
        edit: true,
      },
    });
  };

  const [showImage, setShowImage] = useState(true);
  return (
    <Fragment>
      <div className="container-fluid">
        <div className="p-2 pt-3 row col-sm-12">
          <div className="col-sm-4">
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                placeholder="Search By Book"
                value={props.bookSearchParam}
                onChange={props.onBookFilterChange}
              />
              <span class="input-group-text" id="basic-addon2">
                <i className="fa fa-search"></i>
              </span>
            </div>
          </div>
        </div>
        <div className="pt-3 row col-sm-12">
          <div className="justify-content-start">
            <div className="d-flex  pt-3 mb-3">
              <div>
                <i
                  className="fa fa-circle-left fa-2x hand golden-text"
                  onClick={() => props.setVisibleArea("main")}
                ></i>
              </div>
              <div
                className="badge rounded-pill bg-primary ms-2"
                style={{ fontSize: "15px", fontWeight: "normal" }}
              >
                Total books of {props.author} :{" "}
                {props.books ? props.books.length : 0}
              </div>
            </div>
            <div
              className="row"
              style={{
                width: "96%",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {props.books &&
                props.books.map((m, index) => {
                  return (
                    <div
                      className="hand mb-4"
                      key={props.books.bookId}
                      style={{ width: width }}
                    >
                      <div className="col-sm-12 shelf text-center p-2 shadow">
                        <div className="col-sm-12 text-center">
                          <i
                            className="fa fa-times-circle text-danger float-start hand"
                            title="Delete Book"
                            style={{ position: "relative", top: "-5px" }}
                            onClick={() => onDeleteBook(m.bookId)}
                          ></i>

                          <i
                            className="fa fa-edit text-success float-end hand"
                            title="Edit Book"
                            style={{ position: "relative", top: "-5px" }}
                            onClick={() =>
                              navigate("/addBookToLibrary", {
                                state: {
                                  book: {
                                    author: m.author,
                                    bookId: m.bookId,
                                    bookName: m.bookName,
                                    bookNameInEnglish: m.bookNameInEnglish,
                                    description: m.description,
                                    format: m.format,
                                    language: m.language,
                                    publicastion: m.publication,
                                    image: m.bookImage,
                                    shelfId: m.shelfId,
                                  },
                                  edit: true,
                                },
                              })
                            }
                          ></i>
                          <i
                            className="fa fa-copy text-primary float-end hand me-2"
                            title="Copy Book"
                            style={{ position: "relative", top: "-5px" }}
                            onClick={() => copyBook(m)}
                          ></i>
                        </div>
                        <div
                          className="d-flex justify-content-center"
                          style={{ width: "100%" }}
                          onClick={() =>
                            navigate("/borrow", {
                              state: {
                                book: {
                                  bookId: m.bookId,
                                  bookName: m.bookName,
                                  authorName: m.author,
                                  bookImage: m.bookImage,
                                  description: m.description,
                                  shelfName:
                                    m.parentShelfName + " -> " + m.shelfName,
                                },
                              },
                            })
                          }
                        >
                          <SideBySideMagnifier
                            imageSrc={`${
                              process.env.PUBLIC_URL
                            }/assets/bookImages/${
                              m.bookImage !== "" ? m.bookImage : "book.png"
                            }`}
                            imageAlt="library"
                            largeImageSrc={`${
                              process.env.PUBLIC_URL
                            }/assets/bookImages/${
                              m.bookImage !== "" ? m.bookImage : "book.png"
                            }`} // Optional
                            // magnifierSize={"50%"}
                            alwaysInPlace={false}
                            fillAvailableSpace={true}
                            switchSides={switchSide(index + 1)}
                            magnifierBorderColor="rgba(255, 255, 255, .5)"
                            zoomContainerBorder="1px solid #ccc"
                            zoomContainerBoxShadow="0 4px 8px rgba(0,0,0,.5)"
                          />

                          {/* <img
                            src={`${process.env.PUBLIC_URL}/assets/bookImages/${
                              m.bookImage !== "" ? m.bookImage : "book.png"
                            }`}
                            alt="library"
                            width={"100%"}
                            className="img-fluid rounded"
                            key={Math.random()}

                            //   onClick={onShelfClickHandle}
                          /> */}
                        </div>
                        <div className="mt-2">
                          <b>{m.bookName}</b>
                        </div>
                        <div className="mt-2">
                          <b>
                            {m.parentShelfName !== ""
                              ? m.parentShelfName + " -> "
                              : ""}{" "}
                            {m.shelfName}
                          </b>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

BooksByAuthor.propTypes = {};

export default BooksByAuthor;
