import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  DELETE_SHELF,
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
import {
  ErrorMessage,
  SuccessMessage,
} from "../../lib/toastMessage/Toastmessage";

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
      //setBooks(null);
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

  const [getChildShelfs, { refetch: shelfRefetch }] = useLazyQuery(
    GET_CHILD_SHELF_WITH_BOOK_COUNT,
    {
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
    }
  );

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

      console.log("Books", JSON.stringify(data.loadBookByShelf.bookList));
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
      setBooks(null);
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
        setChildSelfs(data.filterChildShelfByAuthorOrBook.bookShelfList);
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
      <div className="saas-page-header">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button
            type="button"
            className="saas-toolbar-btn"
            onClick={() => navigate("/")}
            title="Back to Shelves"
          >
            <i className="fa fa-arrow-left"></i>
            Back
          </button>
          <h1 className="saas-page-title ms-1">
            {JSON.parse(sessionStorage.getItem("currentShelf")).shelfName}
          </h1>
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
            className="saas-toolbar-btn"
            onClick={() =>
              navigate("/addShelf", {
                state: {
                  shelf: {
                    parentShelfId: JSON.parse(
                      sessionStorage.getItem("currentShelf")
                    ).shelfId,
                    shelfId: 0,
                    shelfImage: "",
                    shelfName: "",
                    userId: null,
                  },
                },
              })
            }
          >
            <i className="fa fa-folder-plus golden-text"></i>
            Child Shelf
          </button>

          <button
            type="button"
            className="saas-toolbar-btn primary"
            onClick={() =>
              navigate("/addBook", {
                state: {
                  shelf: JSON.parse(sessionStorage.getItem("currentShelf")),
                },
              })
            }
          >
            <i className="fa fa-plus"></i>
            Add Book
          </button>
        </div>
      </div>

      {childShelfs && childShelfs.length > 0 && (
        <div className="mb-4 pb-4 border-bottom golden-border-color">
          <div className="saas-grid">
            {childShelfs.map((m) => (
              <ParentShelf
                key={m.bookShelfs.shelfName}
                data={m}
                count={childShelfs.length}
                fromChildPage={true}
                shelfRefetch={shelfRefetch}
              />
            ))}
          </div>
        </div>
      )}

      <div className="saas-grid">
        {books &&
          books.map((m, index) => (
            <DisplayBook
              key={m.bookId}
              data={m}
              shelfs={allShelfs}
              refetch={refetch}
              index={index + 1}
              shelfName={
                JSON.parse(sessionStorage.getItem("currentShelf")).shelfName
              }
            />
          ))}
      </div>
    </Fragment>
  );
};

ShelfDetails.propTypes = {};

export default ShelfDetails;
