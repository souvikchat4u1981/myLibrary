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
      <div className="saas-page-header">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <h1 className="saas-page-title">
            <i className="fa-solid fa-book golden-text"></i>
            Book List
          </h1>
          <span className="saas-badge">
            <i className="fa-solid fa-layer-group"></i>
            {books ? books.length : 0} Books
          </span>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap flex-grow-1 justify-content-md-end">
          <div className="input-group saas-search-box">
            <input
              type="text"
              className="form-control"
              placeholder="Search by author, book, or shelf..."
              value={searchParam}
              onChange={onFilterChange}
            />
            <span className="input-group-text" id="basic-addon2">
              <i className="fa fa-search"></i>
            </span>
          </div>

          <Button
            onClick={() => {
              if (showPage !== "pdf") {
                setShowpage("pdf");
              } else {
                setShowpage("mainPage");
              }
            }}
          >
            <i className="fa-solid fa-file-pdf me-2"></i>
            {showPage === "pdf" ? "Hide" : "Show"} PDF
          </Button>
        </div>
      </div>

      {showPage === "mainPage" && (
        <div className="tableContainer">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th className="fixheader" style={{ width: "40%" }}>
                  Book Name
                </th>
                <th className="fixheader">Author</th>
                <th className="fixheader">Publication</th>
                <th className="fixheader">Shelf Name</th>
                <th className="fixheader" style={{ width: "14%" }}>
                  Parent Shelf
                </th>
              </tr>
            </thead>
            <tbody>
              {books === null && (
                <tr>
                  <td colSpan={5} className="text-center py-5">
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/nobook.png`}
                      alt="library"
                      width={"48px"}
                      className="me-2"
                    />
                    No Books available
                  </td>
                </tr>
              )}
              {books &&
                books.map((m) => (
                  <tr key={m.bookId}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={`${process.env.PUBLIC_URL}/assets/bookImages/${
                            m.bookImage !== "" ? m.bookImage : "book.png"
                          }`}
                          alt="library"
                          style={{
                            width: "44px",
                            height: "58px",
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                          className="border golden-border-color"
                        />
                        <span className="fw-medium">{m.bookName}</span>
                      </div>
                    </td>
                    <td>{m.author}</td>
                    <td>{m.publication}</td>
                    <td>{m.shelfName}</td>
                    <td>{m.parentShelfName}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {books && showPage === "pdf" && (
        <div className="mt-3">
          <BookReportPDF books={books} />
        </div>
      )}
    </Fragment>
  );
};

BookList.propTypes = {};

export default BookList;
