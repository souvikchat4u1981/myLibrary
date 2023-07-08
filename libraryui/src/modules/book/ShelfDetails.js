import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  GET_ALL_SHELF_WITH_RELATION,
  GET_CHILD_SHELF,
  LOAD_BOOK_BY_SHELF,
} from "../../queries/BookQueries";
import ParentShelf from "./ParentShelf";
import DisplayBook from "./DisplayBook";

const ShelfDetails = (props) => {
  const navigate = useNavigate();
  const [childShelfs, setChildSelfs] = useState(null);
  const [currentShelf, setCurrentShelf] = useState(null);
  const [allShelfs, setAllShelfs] = useState(null);
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

  const [getChildShelfs] = useLazyQuery(GET_CHILD_SHELF, {
    notifyOnNetworkStatusChange: true,
    variables: {
      parentId: JSON.parse(sessionStorage.getItem("currentShelf")).shelfId,
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setChildSelfs(null);
      if (!data.getChildBookShelfs.failure) {
        if (data.getChildBookShelfs.bookShelfs.length > 0) {
          setChildSelfs(data.getChildBookShelfs.bookShelfs);
        }
      }
    },

    onError: (data) => {
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
    },

    onError: (data) => {
      console.log(data);
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

  return (
    <Fragment>
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
