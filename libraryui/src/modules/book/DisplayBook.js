import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
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
    if (props.data.image !== "") {
      setImageName(props.data.image);
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
  return (
    <Fragment>
      {load && <CustomLoader />}
      <div className="hand mb-2" style={{ width: width }}>
        <div className="col-sm-12 shelf text-center p-2 shadow">
          <div className="col-sm-12 text-center">
            <i
              className="fa fa-edit text-success float-end hand"
              title="Edit Book"
              style={{ position: "relative", top: "-5px" }}
              onClick={() =>
                navigate("/addBookToLibrary", {
                  state: {
                    book: props.data,
                    edit: true,
                  },
                })
              }
            ></i>
            <i
              className="fa fa-copy text-primary float-end hand me-2"
              title="Copy Book"
              style={{ position: "relative", top: "-5px" }}
              onClick={copyBook}
            ></i>
            <i
              className="fa fa-right-left text-warning float-end hand me-2"
              title="Move Book To"
              style={{ position: "relative", top: "-5px" }}
              onClick={() => setShowImage(!showImage)}
            ></i>
          </div>

          <div
            className="d-flex justify-content-center"
            style={{ width: "100%" }}
          >
            {showImage && (
              <div
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
                  largeImageSrc={`${process.env.PUBLIC_URL}/assets/bookImages/${imageName}`} // Optional
                  // magnifierSize={"50%"}
                  alwaysInPlace={false}
                  fillAvailableSpace={true}
                  switchSides={
                    props.index % 8 === 0 ||
                    props.index % 8 === 6 ||
                    props.index % 8 === 7
                      ? true
                      : false
                  }
                  magnifierBorderColor="rgba(255, 255, 255, .5)"
                  zoomContainerBorder="1px solid #ccc"
                  zoomContainerBoxShadow="0 4px 8px rgba(0,0,0,.5)"
                />
              </div>
            )}
            {!showImage && (
              <Fragment>
                <div style={{ zIndex: "5" }}>
                  <Select
                    id={"changedShelf"}
                    value={changedShelf}
                    onChange={onChangeShelf}
                    //   inputLabel="Shelf"
                    //   required={true}
                    //   inputsValid={inputsValid}
                    //   error={error}
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
                  <Button extraClass={"ms-2"} onClick={changeBookShelf}>
                    Change
                  </Button>
                </div>
              </Fragment>
            )}
          </div>

          <div className="mt-2">
            <b>{props.data.bookName}</b>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

DisplayBook.propTypes = {};

export default DisplayBook;
