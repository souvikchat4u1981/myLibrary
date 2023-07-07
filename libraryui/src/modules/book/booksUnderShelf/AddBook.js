import React, { Fragment, useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import formReducer from "../../../lib/formReducer/FormReducer";
import CustomLoader from "../../../lib/customLoader/CustomLoader";
import Input from "../../../lib/input/Input";
import { useLazyQuery } from "@apollo/client";
import { GET_ONLINE_BOOKS } from "../../../queries/BookQueries";
import Button from "../../../lib/button/Button";
import "../book.scss";
import OnlineBook from "./OnlineBook";

const AddBook = (props, { route }) => {
  const location = useLocation();
  sessionStorage.setItem("AddBookUnder", JSON.stringify(location.state.shelf));
  const [bookList, setBookList] = useState(null);

  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const [searchBook, setSearchBook] = useState("");
  const onInputChange = (e) => {
    setSearchBook(e.value);
  };

  const [getBooks] = useLazyQuery(GET_ONLINE_BOOKS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      parentId: JSON.parse(sessionStorage.getItem("currentShelf")).shelfId,
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setBookList(null);
      if (!data.retrieveBooks.failure) {
        if (data.retrieveBooks.books.length > 0) {
          setBookList(data.retrieveBooks.books);
        }
      }
      setLoad(false);
    },

    onError: (data) => {
      setLoad(false);
      console.log(data);
    },
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      console.log(searchBook);
      if (searchBook !== "") {
        setLoad(true);
        getBooks({ variables: { queryString: searchBook } });
      }
      // Send Axios request here
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchBook]);

  return (
    // <div>{JSON.parse(sessionStorage.getItem("AddBookUnder")).shelfId}</div>
    <Fragment>
      {load && <CustomLoader />}
      <div className="p-2 pt-3 row d-flex">
        <div>
          <i
            className="fa fa-circle-left fa-2x hand golden-text"
            onClick={() => navigate(-1)}
            title="go back"
          ></i>
          <i
            className="fa fa-pen-nib fa-2x hand text-success ms-2"
            onClick={() =>
              navigate("/addBookToLibrary", {
                state: {
                  edit: false,
                },
              })
            }
            title="Add Manual"
          ></i>
        </div>
      </div>
      <div className="col-sm-12 text-center fs-2">
        Add book under {location.state.shelf.shelfName}
      </div>
      <div className="p-2 row">
        <div className="col-sm-4"></div>
        <div className="col-sm-4  border-bottom pb-2 border-golden">
          <Input
            id="searchBook"
            value={searchBook}
            inputType="text"
            placeholder={"Search Book Online"}
            label="Search Book Online"
            icon={<i className="fa fa-user-circle"></i>}
            events={{ onChange: (data) => onInputChange(data) }}
            classes={{
              contClass: "",
              errorClass: "error-label",
              fieldClass: "form-control form-control-sm",
              labelClass: "large-text-header",
            }}
          />
          <Button
            extraClass={"mt-2"}
            onClick={() => {
              setLoad(true);
              getBooks({ variables: { queryString: searchBook } });
            }}
          >
            Search
          </Button>
        </div>
      </div>
      <div className="p-2 row">
        {bookList &&
          bookList.map((m, index) => {
            return <OnlineBook key={index} data={m} />;
          })}
      </div>
    </Fragment>
  );
};

AddBook.propTypes = {};

export default AddBook;
