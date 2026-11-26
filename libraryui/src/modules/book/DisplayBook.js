import React, { Fragment, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  DELETE_BOOK,
  GET_ALL_PARENT_BOOKSHELFS,
  GET_FIRST_BOOK_BY_SHELF,
  SAVE_BOOK,
} from "../../queries/BookQueries";
import Select from "../../lib/Select";
import Button from "../../lib/button/Button";
import {
  ErrorMessage,
  SuccessMessage,
} from "../../lib/toastMessage/Toastmessage";
import CustomLoader from "../../lib/customLoader/CustomLoader";
import { SideBySideMagnifier } from "react-image-magnifiers";

const DisplayBook = (props) => {
  const [width, setWidth] = useState("100%");
  useEffect(() => {
    if (window.screen.width < 600) {
      setWidth("50%");
    } else {
      setWidth("12.5%");
    }
  }, [props.data]);

  const [imageName, setImageName] = useState("book.png");

  useEffect(() => {
    if (props.data.image && props.data.image !== "") {
      setImageName(props.data.image);
    } else {
      setImageName("book.png");
    }
  }, [props.data.image]);

  useEffect(() => {
    const reloadCount = sessionStorage.getItem("reloadCount");
    if (reloadCount < 2) {
      sessionStorage.setItem("reloadCount", String(reloadCount + 1));
      // window.location.reload();
    } else {
      // sessionStorage.removeItem("reloadCount");
    }
  }, []);

  const copyBook = () => {
    let book = { ...props.data };
    book.bookId = 0;
    navigate("/addBookToLibrary", {
      state: {
        book: book,
        edit: true,
      },
    });
  };

  const [showImage, setShowImage] = useState(true);
  const [flipLeft, setFlipLeft] = useState(false);
  const mediaRef = useRef(null);

  const [load, setLoad] = useState(false);

  const [changedShelf, setChangedShelf] = useState(0);

  const onChangeShelf = (e) => {
    setChangedShelf(e.target.value);
  };

  const changeBookShelf = () => {
    let book = { ...props.data };
    console.log("oldBook", book);
    book.shelfId = changedShelf;
    console.log("newBook", book);
    setLoad(true);
    addBook({
      variables: { book: { userId: book.userId, book: book } },
    });
  };

  const [addBook] = useMutation(SAVE_BOOK, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (!data.saveBook.failure) {
        SuccessMessage("Book added successfully");
        props.refetch();
      } else {
        ErrorMessage(data.saveBook.message);
      }
      setLoad(false);
    },

    onError: (data) => {
      console.log(data);
      setLoad(false);
    },
  });

  const navigate = useNavigate();

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

  return (
    <Fragment>
      {load && <CustomLoader />}
      <div className="shelf text-center">
        <div className="saas-card-actions">
          <div className="d-flex align-items-center gap-1">
            <span
              className="saas-action-icon text-danger hand"
              title="Delete Book"
              onClick={() => onDeleteBook(props.data.bookId)}
            >
              <i className="fa fa-trash"></i>
            </span>
            {props.data.digitalFileName !== "" &&
              props.data.digitalFileName !== null && (
                <span
                  className="saas-action-icon text-success hand"
                  title="Read Book"
                  onClick={() =>
                    navigate("/readBook", {
                      state: {
                        data: props.data,
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
              className="saas-action-icon text-warning hand"
              title="Move Book To"
              onClick={() => setShowImage(!showImage)}
            >
              <i className="fa fa-right-left"></i>
            </span>
            <span
              className="saas-action-icon text-primary hand"
              title="Copy Book"
              onClick={copyBook}
            >
              <i className="fa fa-copy"></i>
            </span>
            <span
              className="saas-action-icon text-success hand"
              title="Edit Book"
              onClick={() =>
                navigate("/addBookToLibrary", {
                  state: {
                    book: props.data,
                    edit: true,
                  },
                })
              }
            >
              <i className="fa fa-pen"></i>
            </span>
          </div>
        </div>

        <div className="saas-card-media">
          {showImage && (
            <img
              src={`${process.env.PUBLIC_URL}/assets/bookImages/${imageName}`}
              alt=""
              aria-hidden="true"
              className="glass-cover-aura"
            />
          )}
          {showImage && (
            <div
              ref={mediaRef}
              className="w-100 h-100 d-flex align-items-center justify-content-center saas-magnifier-wrap position-relative"
              style={{ zIndex: 2 }}
              onMouseEnter={() => {
                if (mediaRef.current) {
                  const rect = mediaRef.current.getBoundingClientRect();
                  setFlipLeft(window.innerWidth - rect.right < 450);
                }
              }}
              onClick={() =>
                navigate("/borrow", {
                  state: {
                    book: {
                      bookId: props.data.bookId,
                      bookName: props.data.bookName,
                      authorName: props.data.author,
                      bookImage: props.data.image,
                      description: props.data.description,
                      shelfName: props.shelfName,
                    },
                  },
                })
              }
            >
              <SideBySideMagnifier
                imageSrc={`${process.env.PUBLIC_URL}/assets/bookImages/${imageName}`}
                imageAlt="library"
                largeImageSrc={`${process.env.PUBLIC_URL}/assets/bookImages/${imageName}`}
                alwaysInPlace={false}
                fillAvailableSpace={true}
                switchSides={flipLeft}
                magnifierBorderColor="rgba(255, 255, 255, .5)"
                zoomContainerBorder="1px solid #e2e8f0"
                zoomContainerBoxShadow="0 12px 24px rgba(15, 23, 42, .2)"
              />
            </div>
          )}
          {!showImage && (
            <div className="w-100 px-1" style={{ zIndex: "5" }}>
              <Select
                id={"changedShelf"}
                value={changedShelf}
                onChange={onChangeShelf}
                withValidation={false}
                initialOption={{
                  displayText: "--- Select Shelf ---",
                  value: "0",
                }}
                options={
                  props.shelfs &&
                  props.shelfs.map((m) => {
                    return {
                      key: m.shelfId,
                      displayText:
                        m.shelfName !== ""
                          ? m.parentShelfName + "->" + m.shelfName
                          : m.parentShelfName,
                      value: m.shelfId,
                    };
                  })
                }
              />
              <Button extraClass={"mt-2 w-100"} onClick={changeBookShelf}>
                Move Book
              </Button>
            </div>
          )}
        </div>

        <div className="saas-card-title">{props.data.bookName}</div>
        {props.data.author && (
          <div className="saas-card-meta">{props.data.author}</div>
        )}
      </div>
    </Fragment>
  );
};

DisplayBook.propTypes = {};

export default DisplayBook;
