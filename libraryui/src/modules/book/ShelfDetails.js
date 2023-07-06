import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { GET_CHILD_SHELF } from "../../queries/BookQueries";
import ParentShelf from "./ParentShelf";

const ShelfDetails = (props) => {
  const navigate = useNavigate();
  const [childShelfs, setChildSelfs] = useState(null);
  const [currentShelf, setCurrentShelf] = useState(null);
  const { productSlug } = useParams();
  const [getChildShelfs, { refetch }] = useLazyQuery(GET_CHILD_SHELF, {
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

  useEffect(() => {
    getChildShelfs();
    // setCurrentShelf(JSON.parse(sessionStorage.getItem("currentShelf")));
  }, []);

  useEffect(() => {
    console.log(productSlug);

    getChildShelfs();
  }, [productSlug]);

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
      </div>
    </Fragment>
  );
};

ShelfDetails.propTypes = {};

export default ShelfDetails;
