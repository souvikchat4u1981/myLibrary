import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  GET_ALL_SHELF_WITH_RELATION,
  LOAD_BOOK_BY_SHELF,
} from "../../queries/BookQueries";
import DisplayBook from "./DisplayBook";

const DisplayBooks = (props) => {
  const [books, setBooks] = useState(props.books);
  const [allShelfs, setAllShelfs] = useState(null);
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

  return (
    <Fragment>
      <div
        className="row"
        style={{ width: "96%", marginLeft: "auto", marginRight: "auto" }}
      >
        {!props.books && <div>No Book Present {JSON.parse(props.books)} </div>}
        {props.books &&
          props.books.map((m) => {
            return (
              <DisplayBook
                key={m.bookId}
                data={m}
                shelfs={allShelfs}
                refetch={props.refetch}
                shelfName={props.shelfName}
              />
            );
          })}
      </div>
    </Fragment>
  );
};

DisplayBooks.propTypes = {};

export default DisplayBooks;
