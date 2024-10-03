import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { useQuery } from "@apollo/client";
import { GET_BORROW_LIST } from "../../queries/BookQueries";
import CustomLoader from "../../lib/customLoader/CustomLoader";
import { convertToMmDdYyyy } from "../../utils/DateTimeFormatter";

const BorrowList = (props) => {
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
          </div>
        </div>
        <div className="p-2 pt-3 d-flex">
          <div
            className="badge rounded-pill bg-primary ms-2"
            style={{ fontSize: "15px", fontWeight: "normal" }}
          >
            Total Books : {books ? books.length : 0}
          </div>
        </div>
        <div className="p-3 row ">
          <div className="tableContainer">
            <table className="table table-stripped table-responsive">
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
                    {" "}
                    <td colSpan={4} className="text-center">
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
                      <tr key={m.borrowId}>
                        <td>
                          {" "}
                          <img
                            src={`${process.env.PUBLIC_URL}/assets/bookImages/${
                              m.bookImage !== "" ? m.bookImage : "book.png"
                            }`}
                            alt="library"
                            width={"15%"}
                            className="me-2 img-thumbnail"
                          />
                          {m.bookName}
                        </td>
                        <td>{m.bookNameInEnglish}</td>
                        <td>{m.parentShelfName}</td>
                        <td>{m.shelfName}</td>
                        <td>{m.borrowBy}</td>
                        <td> {convertToMmDdYyyy(m.borrowDate)}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

BorrowList.propTypes = {};

export default BorrowList;
