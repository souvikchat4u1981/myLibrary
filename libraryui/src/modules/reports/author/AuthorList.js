import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { useQuery } from "@apollo/client";
import { GET_ALL_AUTHORS, GET_ALL_BOOKS } from "../../../queries/BookQueries";
import CustomLoader from "../../../lib/customLoader/CustomLoader";
import Button from "../../../lib/button/Button";

const AuthorList = (props) => {
  const [baseAuthor, setBaseAuthor] = useState(null);
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState(null);
  const [baseBooks, setBaseBooks] = useState(null);

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
  return (
    <Fragment>
      {(loading || loading1) && <CustomLoader />}
      <div className="p-2 pt-3 row col-sm-12">
        <div className="d-flex justify-content-start">
          <div class="input-group" style={{ width: "30%" }}>
            <input
              type="text"
              class="form-control col-sm-2"
              placeholder="Search By Author"
              // value={searchParam}
              // onChange={onFilterChange}
            />
            <span class="input-group-text" id="basic-addon2">
              <i className="fa fa-search"></i>
            </span>
          </div>
        </div>
      </div>
      <div className="p-2 pt-3 row d-flex">
        {author &&
          author.map((m, index) => {
            return (
              <div key={index} className="hand mb-4" style={{ width: "10%" }}>
                <div className="col-sm-12 shelf text-center p-2 shadow">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/authorImage/${
                      m.authorImage !== "" ? m.authorImage : "author.png"
                    }`}
                    alt="library"
                    width={"100%"}
                    className="me-2"
                    // onClick={onShelfClickHandle}
                  />
                  <div
                    className="mt-2"
                    //   onClick={onShelfClickHandle}
                  >
                    <b>{m.authorName}</b>
                  </div>
                  <div
                    className="mt-2"
                    //   onClick={onShelfClickHandle}
                  >
                    Books : {m.bookCount}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </Fragment>
  );
};

AuthorList.propTypes = {};

export default AuthorList;
