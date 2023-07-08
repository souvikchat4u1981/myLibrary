import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import DisplayBooks from "../DisplayBooks";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  GET_SHELF_BY_ID,
  LOAD_BOOK_BY_SHELF,
} from "../../../queries/BookQueries";

const ChildShelf = (props) => {
  const navigate = useNavigate();
  sessionStorage.setItem(
    "CurrentPage",
    "ChildShelf" +
      JSON.parse(sessionStorage.getItem("currentChildShelf")).shelfName
  );
  const [parentShelf, setParentShelf] = useState("");
  useQuery(GET_SHELF_BY_ID, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: JSON.parse(sessionStorage.getItem("currentChildShelf")).parentShelfId,
    },
    fetchPolicy: "network-only",

    nextFetchPolicy: "cache-first",
    onCompleted: (data) => {
      if (!data.getShelfById.failure) {
        setParentShelf(data.getShelfById.bookShelfs.shelfName);
      }
    },

    onError: (data) => {
      console.log(data);
    },
  });

  useEffect(() => {
    fetchBooks({
      variables: {
        shelfId: sessionStorage.getItem("shelfId"),
      },
    });
    // const childreloadCount = sessionStorage.getItem("childreloadCount");
    // if (childreloadCount < 1) {
    //   sessionStorage.setItem("childreloadCount", String(childreloadCount + 1));
    //   window.location.reload();
    // } else {
    //   // sessionStorage.removeItem("reloadCount");
    // }
  }, []);
  const [books, setBooks] = useState([]);
  const [fetchBooks, { refetch }] = useLazyQuery(LOAD_BOOK_BY_SHELF, {
    // notifyOnNetworkStatusChange: true,

    fetchPolicy: "network-only",
    onCompleted: (data) => {
      // setBooks(null);
      if (!data.loadBookByShelf.failure) {
        // if (data.loadBookByShelf.bookList.length > 0) {
        setBooks(data.loadBookByShelf.bookList);
        // }
      }
    },

    onError: (data) => {
      console.log(data);
    },
  });

  return (
    <Fragment>
      <div className="p-2 pt-3 row d-flex">
        <div>
          <i
            className="fa fa-circle-left fa-2x hand golden-text"
            onClick={() => navigate("/shelfDetails")}
            title="back to home"
          ></i>
          <i
            className="fa fa-plus-circle fa-2x hand golden-text ms-2"
            onClick={() =>
              navigate("/addBook", {
                state: {
                  shelf: JSON.parse(
                    sessionStorage.getItem("currentChildShelf")
                  ),
                },
              })
            }
            title="Add New Book"
          ></i>
        </div>
        <div className="col-sm-12 text-center fs-2">
          {parentShelf} --{" "}
          {JSON.parse(sessionStorage.getItem("currentChildShelf")).shelfName}
        </div>
        <div className="col-sm-12 mt-2 p-2">
          {books.length > 0 && <DisplayBooks books={books} refetch={refetch} />}
        </div>
      </div>
    </Fragment>
  );
};

ChildShelf.propTypes = {};

export default ChildShelf;
