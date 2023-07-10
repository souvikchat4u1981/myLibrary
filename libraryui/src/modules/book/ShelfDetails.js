import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  FILTER_BOOK_BY_PARENT_SHELF,
  FILTER_BOOK_BY_SHELF,
  FILTER_CHILD_BOOK_SHELFS,
  GET_ALL_SHELF_WITH_RELATION,
  GET_CHILD_SHELF,
  GET_CHILD_SHELF_WITH_BOOK_COUNT,
  LOAD_BOOK_BY_SHELF,
} from "../../queries/BookQueries";
import ParentShelf from "./ParentShelf";
import DisplayBook from "./DisplayBook";
import CustomLoader from "../../lib/customLoader/CustomLoader";

const ShelfDetails = (props) => {
  const navigate = useNavigate();
  const [childShelfs, setChildSelfs] = useState(null);
  const [currentShelf, setCurrentShelf] = useState(null);
  const [allShelfs, setAllShelfs] = useState(null);
  const [load, setLoad] = useState(false);
  const [searchParam, setSearchparam] = useState(
    sessionStorage.getItem("ShelfFilterParam")
      ? sessionStorage.getItem("ShelfFilterParam")
      : ""
  );
  const refresh = () => window.location.reload(true);
  sessionStorage.setItem(
    "CurrentPage",
    "Shelf" + JSON.parse(sessionStorage.getItem("currentShelf")).shelfName
  );
  useQuery(GET_ALL_SHELF_WITH_RELATION, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setBooks(null);
      if (!data.getAllShelfWithRelation.failure) {
        if (data.getAllShelfWithRelation.shelfRelationModelList.length > 0) {
          setAllShelfs(data.getAllShelfWithRelation.shelfRelationModelList);
        }
      }
    },

    onError: (data) => {
      console.log(data);
    },
  });

  const [currentShelfId, setCurrentShelfId] = useState(0);

  const [getChildShelfs] = useLazyQuery(GET_CHILD_SHELF_WITH_BOOK_COUNT, {
    notifyOnNetworkStatusChange: true,
    variables: {
      parentId: JSON.parse(sessionStorage.getItem("currentShelf")).shelfId,
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setChildSelfs(null);
      if (!data.getChildBookShelfsWithCount.failure) {
        if (data.getChildBookShelfsWithCount.bookShelfList.length > 0) {
          setChildSelfs(data.getChildBookShelfsWithCount.bookShelfList);
        }
      }
      setLoad(false);
    },

    onError: (data) => {
      setLoad(false);
      console.log(data);
    },
  });

  const [books, setBooks] = useState(null);

  const [getBooks, { refetch }] = useLazyQuery(LOAD_BOOK_BY_SHELF, {
    notifyOnNetworkStatusChange: true,
    variables: {
      shelfId: JSON.parse(sessionStorage.getItem("currentShelf")).shelfId,
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      // setBooks(null);
      if (!data.loadBookByShelf.failure) {
        if (data.loadBookByShelf.bookList.length > 0) {
          setBooks(data.loadBookByShelf.bookList);
        }
      }
      setLoad(false);
    },

    onError: (data) => {
      console.log(data);
      setLoad(false);
    },
  });

  const [filterBooksByShelf] = useLazyQuery(FILTER_BOOK_BY_SHELF, {
    notifyOnNetworkStatusChange: true,
    variables: {
      shelfId: JSON.parse(sessionStorage.getItem("currentShelf")).shelfId,
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      // setBooks(null);
      if (!data.loadBookByShelfAndFilter.failure) {
        setBooks(data.loadBookByShelfAndFilter.bookList);
      }
      setLoad(false);
    },

    onError: (data) => {
      console.log(data);
      setLoad(false);
    },
  });

  useEffect(() => {
    // sessionStorage.removeItem("childreloadCount");
    getChildShelfs();
    setTimeout(() => {
      getBooks();
    }, 100);

    // setCurrentShelf(JSON.parse(sessionStorage.getItem("currentShelf")));
  }, []);

  const onFilterChange = (e) => {
    setSearchparam(e.target.value);
    sessionStorage.setItem("ShelfFilterParam", e.target.value);
  };

  const [filterShelfs] = useLazyQuery(FILTER_CHILD_BOOK_SHELFS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (!data.filterChildShelfByAuthorOrBook.failure) {
        setChildSelfs(data.filterChildShelfByAuthorOrBook.bookShelfs);
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
      setLoad(true);
      // console.log(searchBook);
      if (searchParam !== "") {
        setLoad(true);
        filterShelfs({
          variables: {
            searchParam: searchParam,
            parentId: JSON.parse(sessionStorage.getItem("currentShelf"))
              .shelfId,
          },
        });

        filterBooksByShelf({
          variables: {
            shelfId: JSON.parse(sessionStorage.getItem("currentShelf")).shelfId,
            filterParam: searchParam,
          },
        });
      } else {
        getChildShelfs();
        getBooks();
      }
      // Send Axios request here
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchParam]);
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
      <div className="p-2 pt-3 row d-flex">
        <div>
          <i
            className="fa fa-circle-left fa-2x hand golden-text"
            onClick={() => navigate("/")}
            title="back to home"
          ></i>
          <i
            className="fa fa-plus-circle fa-2x hand golden-text ms-2"
            onClick={() =>
              navigate("/addBook", {
                state: {
                  shelf: JSON.parse(sessionStorage.getItem("currentShelf")),
                },
              })
            }
            title="Add New Book"
          ></i>
        </div>
        <div className="col-sm-12 text-center fs-2">
          {JSON.parse(sessionStorage.getItem("currentShelf")).shelfName}
        </div>
        {childShelfs &&
          childShelfs.map((m) => {
            return (
              <ParentShelf
                key={m.shelfId}
                data={m}
                count={childShelfs.length}
                fromChildPage={true}
              />
            );
          })}
        <div className="row mt-2">
          {books &&
            books.map((m) => {
              return (
                <DisplayBook
                  key={m.bookId}
                  data={m}
                  shelfs={allShelfs}
                  refetch={refetch}
                />
              );
            })}
        </div>
      </div>
    </Fragment>
  );
};

ShelfDetails.propTypes = {};

export default ShelfDetails;
