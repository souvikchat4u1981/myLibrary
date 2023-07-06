import React, { Fragment, useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import CustomLoader from "../../../lib/customLoader/CustomLoader";
import "../book.scss";
import { useLazyQuery } from "@apollo/client";
import { GET_ONLINE_BOOK_DETAILS } from "../../../queries/BookQueries";
import Input from "../../../lib/input/Input";
import formReducer from "../../../lib/formReducer/FormReducer";
import Button from "../../../lib/button/Button";

const AddBookToLibrary = (props) => {
  const location = useLocation();
  const [book, setBook] = useState({
    author: null,
    bookId: 0,
    bookName: null,
    description: null,
    detailsURL: null,
    format: null,
    genere: null,
    image: null,
    isbn: null,
    language: null,
    price: null,
    publicastion: null,
    publishigYear: null,
    shelfId: null,
    userId: null,
    purchaseDate: null,
  });

  const [loadedBook, setLodedBook] = useState(null);

  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (location.state) {
      setBook(location.state.book);
    }
  }, []);

  const [getBook] = useLazyQuery(GET_ONLINE_BOOK_DETAILS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      parentId: JSON.parse(sessionStorage.getItem("currentShelf")).shelfId,
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      console.log(data);
      if (!data.bookDetails.failure) {
        setLodedBook(data.bookDetails);
        newBookDispatch({
          type: "SET INITIAL VALUE",

          payload: data.bookDetails,
        });
      }
      setLoad(false);
    },

    onError: (data) => {
      setLoad(false);
      console.log(data);
    },
  });

  useEffect(() => {
    if (book.detailsURL !== null) {
      setLoad(true);
      getBook({ variables: { book: book } });
    }
  }, [book]);

  const navigate = useNavigate();

  let [newBook, newBookDispatch] = useReducer(formReducer, book);

  const onInputChange = (data) => {
    let d = loadedBook;
    d[data.id] = data.value;
    setLodedBook(d);
    newBookDispatch({
      type: "HANDLE INPUT TEXT",
      field: data.id,

      payload: data.value,
    });
  };
  return (
    <Fragment>
      {load && <CustomLoader />}
      <div className="p-2 pt-3 row d-flex">
        <div>
          <i
            className="fa fa-circle-left fa-2x hand golden-text"
            onClick={() => navigate(-1)}
            title="go back"
          ></i>
        </div>
        <div className="col-sm-12 row">
          <div className="col-sm-2"></div>
          {loadedBook && (
            <div className="col-sm-8 add-book row">
              <div className="p-2 border-end col-sm-6">
                <img
                  src={loadedBook.image}
                  alt={loadedBook.image}
                  width={"90%"}
                />
              </div>
              <div className="col-sm-6 p-2 ">
                <div className="row">
                  <Input
                    id="bookName"
                    value={newBook.bookName}
                    inputType="text"
                    placeholder={"Book Name"}
                    label="Book Name"
                    icon={<i className="fa fa-user-circle"></i>}
                    events={{ onChange: (data) => onInputChange(data) }}
                    classes={{
                      contClass: "",
                      errorClass: "error-label",
                      fieldClass: "form-control form-control-sm",
                      labelClass: "large-text-header",
                    }}
                  />
                </div>
                <div className="row mt-2">
                  <Input
                    id="author"
                    value={newBook.author}
                    inputType="text"
                    placeholder={"Author"}
                    label="Author"
                    icon={<i className="fa fa-user-circle"></i>}
                    events={{ onChange: (data) => onInputChange(data) }}
                    classes={{
                      contClass: "",
                      errorClass: "error-label",
                      fieldClass: "form-control form-control-sm",
                      labelClass: "large-text-header",
                    }}
                  />
                </div>
                <div className="row mt-2">
                  <Input
                    id="publicastion"
                    value={newBook.publicastion}
                    inputType="text"
                    placeholder={"publicastion"}
                    label="publicastion"
                    icon={<i className="fa fa-user-circle"></i>}
                    events={{ onChange: (data) => onInputChange(data) }}
                    classes={{
                      contClass: "",
                      errorClass: "error-label",
                      fieldClass: "form-control form-control-sm",
                      labelClass: "large-text-header",
                    }}
                  />
                </div>
                <div className="row mt-2">
                  <Input
                    id="description"
                    value={newBook.description}
                    inputType="textarea"
                    type={"textarea"}
                    placeholder={"Description"}
                    rows={10}
                    label="Description"
                    icon={<i className="fa fa-user-circle"></i>}
                    events={{ onChange: (data) => onInputChange(data) }}
                    classes={{
                      contClass: "",
                      errorClass: "error-label",
                      fieldClass: "form-control form-control-sm",
                      labelClass: "large-text-header",
                    }}
                  />
                </div>
                <div className="row mt-2">
                  <div className="col-sm-6">
                    <Input
                      id="isbn"
                      value={newBook.isbn}
                      inputType="text"
                      placeholder={"ISBN"}
                      label="ISBN"
                      icon={<i className="fa fa-user-circle"></i>}
                      events={{ onChange: (data) => onInputChange(data) }}
                      classes={{
                        contClass: "",
                        errorClass: "error-label",
                        fieldClass: "form-control form-control-sm",
                        labelClass: "large-text-header",
                      }}
                    />
                  </div>
                  <div className="col-sm-6">
                    <Input
                      id="language"
                      value={newBook.language}
                      inputType="text"
                      placeholder={"Language"}
                      label="Language"
                      icon={<i className="fa fa-user-circle"></i>}
                      events={{ onChange: (data) => onInputChange(data) }}
                      classes={{
                        contClass: "",
                        errorClass: "error-label",
                        fieldClass: "form-control form-control-sm",
                        labelClass: "large-text-header",
                      }}
                    />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-sm-4">
                    <Input
                      id="format"
                      value={newBook.format}
                      inputType="text"
                      placeholder={"Format"}
                      label="Format"
                      icon={<i className="fa fa-user-circle"></i>}
                      events={{ onChange: (data) => onInputChange(data) }}
                      classes={{
                        contClass: "",
                        errorClass: "error-label",
                        fieldClass: "form-control form-control-sm",
                        labelClass: "large-text-header",
                      }}
                    />
                  </div>
                  <div className="col-sm-4">
                    <Input
                      id="price"
                      value={newBook.price}
                      inputType="text"
                      placeholder={"Price"}
                      label="Price"
                      icon={<i className="fa fa-user-circle"></i>}
                      events={{ onChange: (data) => onInputChange(data) }}
                      classes={{
                        contClass: "",
                        errorClass: "error-label",
                        fieldClass: "form-control form-control-sm",
                        labelClass: "large-text-header",
                      }}
                    />
                  </div>
                  <div className="col-sm-4">
                    <Input
                      id="publishigYear"
                      value={newBook.publishigYear}
                      inputType="text"
                      placeholder={"Publishig Year"}
                      label="Publishig Year"
                      icon={<i className="fa fa-user-circle"></i>}
                      events={{ onChange: (data) => onInputChange(data) }}
                      classes={{
                        contClass: "",
                        errorClass: "error-label",
                        fieldClass: "form-control form-control-sm",
                        labelClass: "large-text-header",
                      }}
                    />
                  </div>
                </div>
                <div className="row mt-2 p-2 text-center d-flex justify-content-center">
                  <Button extraClass={"col-sm-6"}>Save</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

AddBookToLibrary.propTypes = {};

export default AddBookToLibrary;
