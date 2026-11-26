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
          <div className="saas-confirm-dialog">
            <h4>Delete Book?</h4>
            <p>Are you sure you want to delete this book?</p>
            <div className="d-flex justify-content-end gap-2">
              <Button onClick={onClose} extraClass={"btn-light border"}>
                Cancel
              </Button>
              <Button
                buttonType="loss"
                extraClass={"btn-danger"}
                onClick={() => {
                  deleteBook({ variables: { bookId: id } });
                  onClose();
                }}
              >
                Delete
              </Button>
            </div>
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
      digitalFileName: "",
      isbn: m.isbn,
      price: m.price,
      publishigYear: m.publishing_year,
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
      <div className="saas-page-header">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button
            type="button"
            className="saas-toolbar-btn"
            onClick={() => props.setVisibleArea("main")}
            title="Back to Authors"
          >
            <i className="fa fa-arrow-left"></i>
            Back
          </button>
          <h1 className="saas-page-title ms-1">{props.author}</h1>
          <span className="saas-badge">
            <i className="fa-solid fa-book"></i>
            {props.books ? props.books.length : 0} Books
          </span>
        </div>

        <div className="input-group saas-search-box">
          <input
            type="text"
            className="form-control"
            placeholder="Search by book..."
            value={props.bookSearchParam}
            onChange={props.onBookFilterChange}
          />
          <span className="input-group-text" id="basic-addon2">
            <i className="fa fa-search"></i>
          </span>
        </div>
      </div>

      <div className="saas-grid">
        {props.books &&
          props.books.map((m, index) => (
            <div className="shelf text-center" key={m.bookId || index}>
              <div className="saas-card-actions">
                <div className="d-flex align-items-center gap-1">
                  <span
                    className="saas-action-icon text-danger hand"
                    title="Delete Book"
                    onClick={() => onDeleteBook(m.bookId)}
                  >
                    <i className="fa fa-trash"></i>
                  </span>
                  {m.digitalFileName !== "" && m.digitalFileName !== null && (
                    <span
                      className="saas-action-icon text-success hand"
                      title="Read Book"
                      onClick={() =>
                        navigate("/readBook", {
                          state: {
                            data: m,
                          },
                        })
                      }
                    >
                      <i className="fa fa-book-open-reader"></i>
                    </span>
                  )}
                </div>

                <div className="d-flex align-items-center gap-1">
                  <span
                    className="saas-action-icon text-primary hand"
                    title="Copy Book"
                    onClick={() => copyBook(m)}
                  >
                    <i className="fa fa-copy"></i>
                  </span>
                  <span
                    className="saas-action-icon text-success hand"
                    title="Edit Book"
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
                            digitalFileName: m.digitalFileName,
                            isbn: m.isbn,
                            price: m.price,
                            publishigYear: m.publishing_year,
                          },
                          edit: true,
                        },
                      })
                    }
                  >
                    <i className="fa fa-pen"></i>
                  </span>
                </div>
              </div>

              <div
                className="saas-card-media saas-magnifier-wrap"
                onClick={() =>
                  navigate("/borrow", {
                    state: {
                      book: {
                        bookId: m.bookId,
                        bookName: m.bookName,
                        authorName: m.author,
                        bookImage: m.bookImage,
                        description: m.description,
                        shelfName: m.parentShelfName + " -> " + m.shelfName,
                      },
                    },
                  })
                }
              >
                <SideBySideMagnifier
                  imageSrc={`${process.env.PUBLIC_URL}/assets/bookImages/${
                    m.bookImage !== "" ? m.bookImage : "book.png"
                  }`}
                  imageAlt="library"
                  largeImageSrc={`${process.env.PUBLIC_URL}/assets/bookImages/${
                    m.bookImage !== "" ? m.bookImage : "book.png"
                  }`}
                  alwaysInPlace={false}
                  fillAvailableSpace={true}
                  switchSides={switchSide(index + 1)}
                  magnifierBorderColor="rgba(255, 255, 255, .5)"
                  zoomContainerBorder="1px solid #e2e8f0"
                  zoomContainerBoxShadow="0 12px 24px rgba(15, 23, 42, .2)"
                />
              </div>

              <div className="saas-card-title">{m.bookName}</div>
              <div className="saas-card-meta">
                {m.parentShelfName !== "" ? m.parentShelfName + " -> " : ""}
                {m.shelfName}
              </div>
            </div>
          ))}
      </div>
    </Fragment>
  );
};

BooksByAuthor.propTypes = {};

export default BooksByAuthor;
