import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { useQuery } from "@apollo/client";
import { GET_ALL_PARENT_BOOKSHELFS } from "../../queries/BookQueries";
import ParentShelf from "./ParentShelf";
import { useNavigate } from "react-router-dom";

const Books = (props) => {
  const navigate = useNavigate();
  const [parentShelfs, setParentShelfs] = useState(null);

  const { refetch } = useQuery(GET_ALL_PARENT_BOOKSHELFS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (!data.getAllBookShelfs.failure) {
        setParentShelfs(data.getAllBookShelfs.bookShelfs);
      }
    },

    onError: (data) => {
      console.log(data);
    },
  });

  const onAddClick = () => {
    navigate("/addShelf");
  };

  return (
    <Fragment>
      <div className="p-2 pt-3 row">
        <i
          className="fa fa-plus-circle fa-2x hand golden-text"
          onClick={onAddClick}
        ></i>
      </div>
      <div className="p-2 row">
        {parentShelfs &&
          parentShelfs.map((m) => {
            return (
              <ParentShelf
                key={m.shelfId}
                data={m}
                count={parentShelfs.length}
              />
            );
          })}
      </div>
    </Fragment>
  );
};

Books.propTypes = {};

export default Books;
