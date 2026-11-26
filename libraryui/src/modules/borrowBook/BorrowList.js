import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_BORROW_LIST } from "../../queries/BookQueries";
import CustomLoader from "../../lib/customLoader/CustomLoader";
import { convertToMmDdYyyy } from "../../utils/DateTimeFormatter";

const BorrowList = (props) => {
  const navigate = useNavigate();
  const [books, setBooks] = useState(null);
  const [baseBooks, setBaseBooks] = useState(null);
  const [searchParam, setSearchparam] = useState("");

  const { loading, refetch } = useQuery(GET_BORROW_LIST, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (!data.getBorrowList.failure) {
        setBooks(data.getBorrowList.borrowList);
        setBaseBooks(data.getBorrowList.borrowList);
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
          m.borrowBy.toLowerCase().includes(e.target.value.toLowerCase()) ||
          m.shelfName.toLowerCase().includes(e.target.value.toLowerCase()) ||
          m.parentShelfName.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          return m;
        }
      });
      setBooks(filterBooks);
    }
  };

  return (
    <Fragment>
      {loading && <CustomLoader />}
      <div className="saas-page-header">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <h1 className="saas-page-title">
            <i className="fa-solid fa-box-open golden-text"></i>
            Borrow List
          </h1>
          <span className="saas-badge">
            <i className="fa-solid fa-book"></i>
            {books ? books.length : 0} Books
          </span>
        </div>

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
      </div>

      <div className="tableContainer">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th className="fixheader" style={{ width: "25%" }}>
                Book Name
              </th>
              <th className="fixheader" style={{ width: "25%" }}>
                Book Name In English
              </th>
              <th className="fixheader">Parent Shelf</th>
              <th className="fixheader">Shelf</th>
              <th className="fixheader">Borrower Name</th>
              <th className="fixheader">Borrow Date</th>
            </tr>
          </thead>
          <tbody>
            {books === null && (
              <tr>
                <td colSpan={6} className="text-center py-5">
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
                <tr
                  key={m.borrowId}
                  className="hand"
                  onClick={() =>
                    navigate("/borrow", {
                      state: {
                        book: {
                          bookId: m.bookId,
                          bookName: m.bookName,
                          authorName: m.parentShelfName || "",
                          bookImage: m.bookImage || "",
                          description: "",
                          shelfName: m.shelfName || "",
                        },
                      },
                    })
                  }
                >
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
                  <td>{m.bookNameInEnglish}</td>
                  <td>{m.parentShelfName}</td>
                  <td>{m.shelfName}</td>
                  <td>{m.borrowBy}</td>
                  <td>{convertToMmDdYyyy(m.borrowDate)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

BorrowList.propTypes = {};

export default BorrowList;
