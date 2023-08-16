import React, { Fragment, useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import CustomLoader from "../../../lib/customLoader/CustomLoader";
import "../book.scss";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  GET_AUTOCOMPLETE_VALUES,
  GET_ONLINE_BOOK_DETAILS,
  SAVE_BOOK,
} from "../../../queries/BookQueries";
import Input from "../../../lib/input/Input";
import formReducer from "../../../lib/formReducer/FormReducer";
import Button from "../../../lib/button/Button";
import {
  ErrorMessage,
  SuccessMessage,
} from "../../../lib/toastMessage/Toastmessage";
import axios from "axios";
import { multiPartPost, postCall } from "../../../utils/RestCalls";
import AutoComplete from "../../../lib/autoComplete/AutoComplete";

const AddBookToLibrary = (props) => {
  sessionStorage.setItem(
    "CurrentPage",
    "Addbook" + JSON.parse(sessionStorage.getItem("currentShelf")).shelfId
  );
  const location = useLocation();
  const [book, setBook] = useState({
    author: "",
    bookId: 0,
    bookName: "",
    bookNameInEnglish: "",
    description: "",
    detailsURL: "",
    format: "Hardcover",
    genere: "",
    image: "",
    isbn: "",
    language: "",
    price: 0,
    publicastion: "",
    publishigYear: "",
    shelfId: 0,
    userId: 0,
    purchaseDate: null,
    digitalFileName: "",
  });

  const [loadedBook, setLodedBook] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [publication, setPublication] = useState([]);

  const [load, setLoad] = useState(false);

  useEffect(() => {
    sessionStorage.removeItem("reloadCount");
    // sessionStorage.removeItem("childreloadCount");
    if (location.state) {
      if (typeof location.state.edit !== "undefined") {
        if (location.state.edit) {
          console.log("Loaded Book", location.state.book);
          setLodedBook(location.state.book);
          newBookDispatch({
            type: "SET INITIAL VALUE",

            payload: location.state.book,
          });
        } else {
          setLodedBook(book);
        }
      } else {
        setBook(location.state.book);
      }
    } else {
      newBookDispatch({
        type: "SET INITIAL VALUE",

        payload: book,
      });
      setLodedBook(book);
    }

    getAuthor();
    getPublication();
  }, []);

  const [getBook] = useLazyQuery(GET_ONLINE_BOOK_DETAILS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      parentId: JSON.parse(sessionStorage.getItem("currentShelf")).shelfId,
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      //   console.log(data);
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

  const [getAuthor] = useLazyQuery(GET_AUTOCOMPLETE_VALUES, {
    notifyOnNetworkStatusChange: true,
    variables: {
      columnName: "author",
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      //   console.log(data);

      setAuthors(data.getUniqueListByColumn);

      setLoad(false);
    },

    onError: (data) => {
      setLoad(false);
      console.log(data);
    },
  });

  const [getPublication] = useLazyQuery(GET_AUTOCOMPLETE_VALUES, {
    notifyOnNetworkStatusChange: true,
    variables: {
      columnName: "publication",
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      //   console.log(data);

      setPublication(data.getUniqueListByColumn);

      setLoad(false);
    },

    onError: (data) => {
      setLoad(false);
      console.log(data);
    },
  });

  useEffect(() => {
    if (book.detailsURL !== null && book.detailsURL !== "") {
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

  const [addBook] = useMutation(SAVE_BOOK, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (!data.saveBook.failure) {
        SuccessMessage("Book added successfully");
        // navigate("/shelfDetails");
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

  const onSaveClick = (e) => {
    e.preventDefault();

    // console.log(loadedBook);
    if (loadedBook.bookName !== "") {
      let b = { ...loadedBook };
      delete b.detailsURL;
      delete b.failure;
      delete b.message;
      delete b.userId;
      if (b.shelfId === 0)
        b.shelfId = JSON.parse(sessionStorage.getItem("AddBookUnder")).shelfId;

      b["purchaseDate"] = null;
      setLoad(true);
      if (loadedBook.image.includes("blob")) {
        saveTempImage(b);
      } else {
        addBook({
          variables: { book: { userId: loadedBook.userId, book: b } },
        });
      }
    }
  };

  const [fileLocation, setFileLocation] = useState("web");
  const [selectedImage, setSelectedImage] = useState(null);

  const saveTempImage = (b) => {
    const data = new FormData();
    data.append("image", selectedImage);
    let url = "uploadImage";
    setLoad(true);
    multiPartPost({ endpoint: url, data: data })
      .then((data) => {
        //console.log(data);
        // loadedBook.image = data;
        setLoad(false);
        b.image = data;
        addBook({
          variables: { book: { userId: loadedBook.userId, book: b } },
        });
      })
      .catch((error) => {
        setLoad(false);
      });
  };

  const loadImageFromFolder = (event) => {
    event.preventDefault();
    setSelectedImage(event.target.files[0]);
    loadedBook.image = URL.createObjectURL(event.target.files[0]);
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
                <div>
                  <i
                    className="fa fa-folder me-2"
                    title="From folder"
                    onClick={() => setFileLocation("folder")}
                  ></i>
                  <i
                    className="fa fa-globe me-2"
                    title="From URL"
                    onClick={() => setFileLocation("web")}
                  ></i>
                </div>
                <div className="mb-2">
                  {fileLocation === "web" && (
                    <Input
                      id="image"
                      value={newBook.image}
                      inputType="text"
                      placeholder={"Image URL"}
                      label="Image URL"
                      icon={<i className="fa fa-user-circle"></i>}
                      events={{ onChange: (data) => onInputChange(data) }}
                      classes={{
                        contClass: "",
                        errorClass: "error-label",
                        fieldClass: "form-control form-control-sm",
                        labelClass: "large-text-header",
                      }}
                    />
                  )}
                  {fileLocation === "folder" && (
                    <input
                      type="file"
                      name="myImage"
                      onChange={(event) => {
                        console.log(event.target.files[0]);
                        loadImageFromFolder(event);
                      }}
                    />
                  )}
                </div>

                {loadedBook.image.includes("http") && (
                  <img
                    src={loadedBook.image}
                    alt={loadedBook.image}
                    width={"90%"}
                  />
                )}
                {!loadedBook.image.includes("http") && (
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/bookImages/${loadedBook.image}`}
                    alt={loadedBook.image}
                    width={"90%"}
                  />
                )}
                {/* {fileLocation === "folder" && selectedImage && (
                  <img
                    alt="not found"
                    width={"90%"}
                    src={URL.createObjectURL(selectedImage)}
                  />
                )} */}
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
                <div className="row">
                  <Input
                    id="bookNameInEnglish"
                    value={newBook.bookNameInEnglish}
                    inputType="text"
                    placeholder={"Book Name In English"}
                    label="Book Name In English"
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
                  <AutoComplete
                    id="author"
                    value={newBook.author}
                    data={authors}
                    placeholder={"Author"}
                    events={{ onChange: (data) => onInputChange(data) }}
                    className="form-control form-control-sm"
                    label="Author"
                  />
                  {/* <Input
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
                  /> */}
                </div>
                <div className="row mt-2">
                  <AutoComplete
                    id="publicastion"
                    value={newBook.publicastion}
                    inputType="text"
                    placeholder={"Publicastion"}
                    label="Publicastion"
                    data={publication}
                    events={{ onChange: (data) => onInputChange(data) }}
                    className="form-control form-control-sm"
                  />
                  {/* <Input
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
                  /> */}
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
                      inputType="dropdown"
                      type="dropdown"
                      placeholder={"Language"}
                      label="Language"
                      events={{ onChange: (data) => onInputChange(data) }}
                      classes={{
                        contClass: "",
                        errorClass: "error-label",
                        fieldClass: "form-select form-select-sm",
                        labelClass: "large-text-header",
                      }}
                    >
                      <option value="Bengali">Bengali</option>
                      <option value={"bengali"}>bengali</option>
                      <option value="English">English</option>
                      <option value={"english"}>english</option>
                      <option value={"Hindi"}>Hindi</option>
                    </Input>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-sm-4">
                    <Input
                      id="format"
                      value={newBook.format}
                      inputType="dropdown"
                      type="dropdown"
                      placeholder={"Format"}
                      label="Format"
                      events={{ onChange: (data) => onInputChange(data) }}
                      classes={{
                        contClass: "",
                        errorClass: "error-label",
                        fieldClass: "form-select form-select-sm",
                        labelClass: "large-text-header",
                      }}
                    >
                      <option value="Hardcover">Hardcover</option>
                      <option value="Hardbound">Hardbound</option>
                      <option value={"Softcover"}>Softcover</option>
                      <option value={"Paperback"}>Paperback</option>
                      <option value={"PaperBack"}>PaperBack</option>
                    </Input>
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
                  <div className="col-sm-8 mt-2">
                    <Input
                      id="digitalFileName"
                      value={newBook.digitalFileName}
                      inputType="text"
                      placeholder={"Digital File Name"}
                      label="Digital File Name"
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
                  <Button extraClass={"col-sm-6"} onClick={onSaveClick}>
                    Save
                  </Button>
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
