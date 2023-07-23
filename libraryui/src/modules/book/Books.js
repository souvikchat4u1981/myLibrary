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
      <div className="p-2 pt-3 row col-sm-12">
        <div className="col-sm-4">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              placeholder="Search By Author or Book"
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
        <div>
          <i
            className="fa fa-plus-circle fa-2x hand golden-text"
            onClick={onAddClick}
          ></i>
        </div>
        <div
          className="badge rounded-pill bg-primary ms-2"
          style={{ fontSize: "15px", fontWeight: "normal" }}
        >
          Total Books {totalBooks}
        </div>
      </div>
      <div className="p-2 row">
        {parentShelfs &&
          parentShelfs.map((m) => {
            return (
              <ParentShelf
                key={m.bookShelfs.shelfId}
                data={m}
                count={parentShelfs.length}
                shelfRefetch={refetch}
              />
            );
          })}
      </div>
    </Fragment>
  );
};

Books.propTypes = {};

export default Books;
