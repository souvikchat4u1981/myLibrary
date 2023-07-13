import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { useQuery } from "@apollo/client";
import { GET_ALL_BOOKS } from "../../queries/BookQueries";
import CustomLoader from "../../lib/customLoader/CustomLoader";
import BookReportPDF from "./BookReportPDF";
import Button from "../../lib/button/Button";

const BookList = (props) => {
  const [books, setBooks] = useState(null);
  const [baseBooks, setBaseBooks] = useState(null);
  const [searchParam, setSearchparam] = useState("");

  const { loading, refetch } = useQuery(GET_ALL_BOOKS, {
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
    let filterBooks = [...baseBooks];
    setSearchparam(e.target.value);
    if (e.target.value === "") {
      setBooks([...baseBooks]);
    } else {
      filterBooks = filterBooks.filter((m) => {
        if (
          m.bookName.toLowerCase().includes(e.target.value.toLowerCase()) ||
          m.bookNameInEnglish
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          m.author.toLowerCase().includes(e.target.value.toLowerCase()) ||
          m.shelfName.toLowerCase().includes(e.target.value.toLowerCase()) ||
          m.parentShelfName.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          return m;
        }
      });
      setBooks(filterBooks);
    }
  };

  const [showPage, setShowpage] = useState("mainPage");

  return (
    <Fragment>
      {loading && <CustomLoader />}
      <div className="container">
        <div className="p-2 pt-3 row col-sm-12">
          <div className="d-flex justify-content-start">
            <div class="input-group" style={{ width: "30%" }}>
              <input
                type="text"
                class="form-control col-sm-2"
                placeholder="Search By Author or Book or Shelf"
                value={searchParam}
                onChange={onFilterChange}
              />
              <span class="input-group-text" id="basic-addon2">
                <i className="fa fa-search"></i>
              </span>
            </div>
            <div className="ms-2">
              <Button
                onClick={() => {
                  if (showPage !== "pdf") {
                    setShowpage("pdf");
                  } else {
                    setShowpage("mainPage");
                  }
                }}
              >
                {showPage === "pdf" ? "Hide" : "Show"} PDF
              </Button>
            </div>
          </div>
        </div>
        <div className="ps-3 row mt-2 ">
          Total Books : {books ? books.length : 0}
        </div>
        {showPage === "mainPage" && (
          <div className="p-3 row ">
            <div className="tableContainer">
              <table className="table table-stripped table-responsive">
                <thead>
                  <tr>
                    <th className="fixheader" style={{ width: "40%" }}>
                      Book Name
                    </th>
                    <th className="fixheader">Author</th>
                    <th className="fixheader">Publication</th>
                    <th className="fixheader">Shelf name</th>
                    <th className="fixheader" style={{ width: "10%" }}>
                      Parent Shelf Name
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {books === null && (
                    <tr>
                      {" "}
                      <td colSpan={5} className="text-center">
                        <img
                          src={`${process.env.PUBLIC_URL}/assets/images/nobook.png`}
                          alt="library"
                          width={"5%"}
                          className="me-2"
                        />{" "}
                        No Books available
                      </td>
                    </tr>
                  )}
                  {books &&
                    books.map((m) => {
                      return (
                        <tr key={m.bookId}>
                          <td>
                            <img
                              src={`${
                                process.env.PUBLIC_URL
                              }/assets/bookImages/${
                                m.bookImage !== "" ? m.bookImage : "book.png"
                              }`}
                              alt="library"
                              width={"15%"}
                              className="me-2 img-thumbnail"
                            />

                            {m.bookName}
                          </td>
                          <td>{m.author}</td>
                          <td>{m.publication}</td>
                          <td>{m.shelfName}</td>
                          <td>{m.parentShelfName}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div className="row">
          {books && showPage === "pdf" && <BookReportPDF books={books} />}
        </div>
      </div>
    </Fragment>
  );
};

BookList.propTypes = {};

export default BookList;
