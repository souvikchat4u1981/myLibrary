import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { useLazyQuery, useQuery } from "@apollo/client";
import { LOAD_BOOK_BY_SHELF } from "../../queries/BookQueries";
import DisplayBook from "./DisplayBook";

const DisplayBooks = (props) => {
  const [books, setBooks] = useState(null);

  useQuery(LOAD_BOOK_BY_SHELF, {
    notifyOnNetworkStatusChange: true,
    variables: {
      shelfId: sessionStorage.getItem("shelfId"),
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setBooks(null);
      if (!data.loadBookByShelf.failure) {
        if (data.loadBookByShelf.bookList.length > 0) {
          setBooks(data.loadBookByShelf.bookList);
        }
      }
    },

    onError: (data) => {
      console.log(data);
    },
  });
  return (
    <Fragment>
      {books &&
        books.map((m) => {
          return <DisplayBook key={m.bookId} data={m} />;
        })}
    </Fragment>
  );
};

DisplayBooks.propTypes = {};

export default DisplayBooks;
