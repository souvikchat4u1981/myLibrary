import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  FILTER_BOOK_SHELFS,
  GET_ALL_PARENT_BOOKSHELFS,
  GET_ALL_PARENT_BOOKSHELFS_WITH_COUNT,
  TOTAL_BOOKS_COUNT,
} from "../../queries/BookQueries";
import ParentShelf from "./ParentShelf";
import { useNavigate } from "react-router-dom";
import CustomLoader from "../../lib/customLoader/CustomLoader";

const Books = (props) => {
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);
  const [parentShelfs, setParentShelfs] = useState(null);
  const [totalBooks, setTotalBooks] = useState(0);
  const [searchParam, setSearchparam] = useState(
    sessionStorage.getItem("ShelfFilterParam")
      ? sessionStorage.getItem("ShelfFilterParam")
      : ""
  );
  sessionStorage.setItem("CurrentPage", "Home");

  const [getAllShelfs, { refetch }] = useLazyQuery(
    GET_ALL_PARENT_BOOKSHELFS_WITH_COUNT,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
      onCompleted: (data) => {
        if (!data.getAllBookShelfsWithCount.failure) {
          setParentShelfs(data.getAllBookShelfsWithCount.bookShelfList);
        }
        setLoad(false);
      },

      onError: (data) => {
        console.log(data);
        setLoad(false);
      },
    }
  );

  useQuery(TOTAL_BOOKS_COUNT, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setTotalBooks(data.totalBookCount);
    },

    onError: (data) => {
      console.log(data);
    },
  });

  const onAddClick = () => {
    navigate("/addShelf");
  };

  const [filterShelfs] = useLazyQuery(FILTER_BOOK_SHELFS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (!data.filterShelfByAuthorOrBook.failure) {
        setParentShelfs(data.filterShelfByAuthorOrBook.bookShelfList);
      }
      setLoad(false);
    },

    onError: (data) => {
      console.log(data);
      setLoad(false);
    },
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // console.log(searchBook);
      if (searchParam !== "") {
        setLoad(true);
        filterShelfs({ variables: { searchParam: searchParam } });
      } else {
        getAllShelfs();
      }
      // Send Axios request here
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchParam]);

  useEffect(() => {
    getAllShelfs();
  }, []);

  const onFilterChange = (e) => {
    setSearchparam(e.target.value);
    sessionStorage.setItem("ShelfFilterParam", e.target.value);
  };

  return (
    <Fragment>
      {load && <CustomLoader />}
      <div className="saas-page-header">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <h1 className="saas-page-title">
            <i className="fa-solid fa-layer-group golden-text"></i>
            My Shelves
          </h1>
          <span className="saas-badge">
            <i className="fa-solid fa-book"></i>
            {totalBooks} Books
          </span>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap flex-grow-1 justify-content-md-end">
          <div className="input-group saas-search-box">
            <input
              type="text"
              className="form-control"
              placeholder="Search by author or book..."
              value={searchParam}
              onChange={onFilterChange}
            />
            <span className="input-group-text" id="basic-addon2">
              <i className="fa fa-search"></i>
            </span>
          </div>

          <button
            type="button"
            className="saas-toolbar-btn primary"
            onClick={onAddClick}
          >
            <i className="fa fa-plus"></i>
            New Shelf
          </button>
        </div>
      </div>

      <div className="saas-grid">
        {parentShelfs &&
          parentShelfs.map((m) => (
            <ParentShelf
              key={m.bookShelfs.shelfId}
              data={m}
              count={parentShelfs.length}
              shelfRefetch={refetch}
            />
          ))}
      </div>
    </Fragment>
  );
};

Books.propTypes = {};

export default Books;
