import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  FILTER_BOOK_SHELFS,
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
  const [viewMode, setViewMode] = useState(
    localStorage.getItem("shelf-view-mode") || "grid"
  );
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
      if (searchParam !== "") {
        setLoad(true);
        filterShelfs({ variables: { searchParam: searchParam } });
      } else {
        getAllShelfs();
      }
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

  const clearSearch = () => {
    setSearchparam("");
    sessionStorage.setItem("ShelfFilterParam", "");
  };

  const switchView = (mode) => {
    setViewMode(mode);
    localStorage.setItem("shelf-view-mode", mode);
  };

  return (
    <Fragment>
      {load && <CustomLoader />}

      {/* ── Frosted Glass Hero Spotlight ── */}
      <div className="glass-hero">
        <div>
          <div className="glass-hero-eyebrow">
            <i className="fa-solid fa-sparkles"></i>
            Personal Collection
          </div>
          <h1 className="glass-hero-title">
            {window.Configs?.applicationName || "My Library"} Shelves
          </h1>
          <p className="glass-hero-sub">
            Browse your curated bookshelves, authors, and digital reads.
          </p>
        </div>

        <div className="d-flex flex-column align-items-stretch align-items-lg-end gap-3 flex-grow-1">
          <div className="glass-stat-row justify-content-lg-end">
            <div className="glass-stat-chip">
              <div className="stat-icon">
                <i className="fa-solid fa-layer-group"></i>
              </div>
              <div>
                <div className="stat-value">
                  {parentShelfs ? parentShelfs.length : 0}
                </div>
                <div className="stat-label">Shelves</div>
              </div>
            </div>

            <div className="glass-stat-chip">
              <div className="stat-icon">
                <i className="fa-solid fa-book"></i>
              </div>
              <div>
                <div className="stat-value">{totalBooks}</div>
                <div className="stat-label">Total Books</div>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap justify-content-lg-end w-100">
            <div className="glass-search-wrap">
              <i className="fa fa-search glass-search-icon"></i>
              <input
                type="text"
                className="form-control"
                placeholder="Search by author, book, or shelf..."
                value={searchParam}
                onChange={onFilterChange}
              />
              {searchParam && (
                <button
                  type="button"
                  className="glass-search-clear"
                  onClick={clearSearch}
                  title="Clear search"
                >
                  <i className="fa fa-times"></i>
                </button>
              )}
            </div>

            <div className="glass-view-switch" title="Switch layout">
              <button
                type="button"
                className={viewMode === "grid" ? "active" : ""}
                onClick={() => switchView("grid")}
                title="Grid View"
              >
                <i className="fa-solid fa-grip"></i>
              </button>
              <button
                type="button"
                className={viewMode === "list" ? "active" : ""}
                onClick={() => switchView("list")}
                title="Compact List View"
              >
                <i className="fa-solid fa-list"></i>
              </button>
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
      </div>

      <div className={viewMode === "list" ? "saas-list-grid" : "saas-grid"}>
        {parentShelfs &&
          parentShelfs.map((m) => (
            <ParentShelf
              key={m.bookShelfs.shelfId}
              data={m}
              count={parentShelfs.length}
              shelfRefetch={refetch}
              viewMode={viewMode}
            />
          ))}
      </div>
    </Fragment>
  );
};

Books.propTypes = {};

export default Books;
