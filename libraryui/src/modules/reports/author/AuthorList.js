import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  GET_ALL_AUTHORS,
  GET_ALL_BOOKS,
  GET_ALL_BOOKS_BY_AUTHOR,
} from "../../../queries/BookQueries";
import CustomLoader from "../../../lib/customLoader/CustomLoader";
import Button from "../../../lib/button/Button";
import MainList from "./MainList";
import BooksByAuthor from "./BooksByAuthor";

const AuthorList = (props) => {
  const [baseAuthor, setBaseAuthor] = useState(null);
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState(null);
  const [baseBooks, setBaseBooks] = useState(null);
  const [searchParam, setSearchparam] = useState("");
  const [bookSearchParam, setBookSearchparam] = useState("");
  const [visibleArea, setVisibleArea] = useState("main");
  const [selectedAuthor, setSelectedAuthor] = useState("");

  const { loading, refetch } = useQuery(GET_ALL_AUTHORS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (!data.getAllAuthor.failure) {
        setAuthor(data.getAllAuthor.authorWithBookCountModels);
        setBaseAuthor(data.getAllAuthor.authorWithBookCountModels);
      }
    },

    onError: (data) => {
      console.log(data);
    },
  });

  const { loading: loading1, refetch: refetch1 } = useQuery(GET_ALL_BOOKS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (!data.getAllBooksWithAuthorAndShelf.failure) {
        setBooks(data.getAllBooksWithAuthorAndShelf.bookList);
        setBaseBooks(data.getAllBooksWithAuthorAndShelf.bookList);
      }
    },

    onError: (data) => {
      console.log(data);
    },
  });
  const onFilterChange = (e) => {
    let filterAuthor = [...baseAuthor];
    setSearchparam(e.target.value);
    if (e.target.value === "") {
      setAuthor([...baseAuthor]);
    } else {
      filterAuthor = filterAuthor.filter((m) => {
        if (m.authorName.toLowerCase().includes(e.target.value.toLowerCase())) {
          return m;
        }
      });
      setAuthor(filterAuthor);
    }
  };

  const [getBookByAuthor, { loading: loading2 }] = useLazyQuery(
    GET_ALL_BOOKS_BY_AUTHOR,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
      onCompleted: (data) => {
        if (!data.getAllBooksWithAuthorAndShelfByAuthor.failure) {
          setBooks(data.getAllBooksWithAuthorAndShelfByAuthor.bookList);
          setBaseBooks(data.getAllBooksWithAuthorAndShelfByAuthor.bookList);
          setVisibleArea("books");
        }
      },

      onError: (data) => {
        console.log(data);
      },
    }
  );

  const onClickAuthor = (author) => {
    setSelectedAuthor(author.authorName);
    getBookByAuthor({ variables: { author: author.authorName } });
  };

  const onBookFilterChange = (e) => {
    let filterBooks = [...baseBooks];
    setBookSearchparam(e.target.value);
    if (e.target.value === "") {
      setBooks([...baseBooks]);
    } else {
      filterBooks = filterBooks.filter((m) => {
        if (
          m.bookName.toLowerCase().includes(e.target.value.toLowerCase()) ||
          m.bookNameInEnglish
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        ) {
          return m;
        }
      });
      setBooks(filterBooks);
    }
  };

  return (
    <Fragment>
      {(loading || loading1 || loading2) && <CustomLoader />}
      {visibleArea === "main" && (
        <MainList
          searchParam={searchParam}
          onFilterChange={onFilterChange}
          onClickAuthor={onClickAuthor}
          author={author}
        />
      )}
      {visibleArea === "books" && (
        <BooksByAuthor
          books={books}
          author={selectedAuthor}
          setVisibleArea={setVisibleArea}
          bookSearchParam={bookSearchParam}
          onBookFilterChange={onBookFilterChange}
        />
      )}
    </Fragment>
  );
};

AuthorList.propTypes = {};

export default AuthorList;
