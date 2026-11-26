import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./book.scss";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  DELETE_SHELF,
  GET_FIRST_BOOK_BY_SHELF,
} from "../../queries/BookQueries";
import {
  ErrorMessage,
  SuccessMessage,
} from "../../lib/toastMessage/Toastmessage";
import Button from "../../lib/button/Button";

const ParentShelf = (props) => {
  const [imageName, setImageName] = useState("shelf1.png");
  const [bookImage, setBookImage] = useState("");

  const [getBookImage] = useLazyQuery(GET_FIRST_BOOK_BY_SHELF, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (
        data?.getFirstBookInShelf &&
        !data.getFirstBookInShelf.failure &&
        data.getFirstBookInShelf.book?.image
      ) {
        setBookImage(data.getFirstBookInShelf.book.image);
      }
    },
    onError: (data) => { console.log(data); },
  });

  useEffect(() => {
    setBookImage("");
    const shelfImg = props.data.bookShelfs.shelfImage;
    const hasShelfImg =
      shelfImg &&
      shelfImg.trim() !== "" &&
      shelfImg.trim().toLowerCase() !== "null";
    if (!hasShelfImg) {
      // Pick a sequential shelf placeholder
      let r = 1;
      if (sessionStorage.getItem("prevRand")) {
        r = +sessionStorage.getItem("prevRand") + 1;
        if (r > 10) r = 1;
        sessionStorage.setItem("prevRand", r);
      } else {
        sessionStorage.setItem("prevRand", r);
      }
      setImageName("shelf" + r + ".png");

      // Try to get first book cover
      getBookImage({
        variables: { shelfId: props.data.bookShelfs.shelfId || 0 },
      });
    } else {
      setImageName(shelfImg);
    }
  }, [props.data]);

  const navigate = useNavigate();

  const onShelfClickHandle = () => {
    sessionStorage.setItem("shelfId", props.data.bookShelfs.shelfId);
    if (props.fromChildPage) {
      sessionStorage.setItem("currentChildShelf", JSON.stringify(props.data.bookShelfs));
      navigate("/childShelf");
    } else {
      sessionStorage.setItem("currentShelf", JSON.stringify(props.data.bookShelfs));
      navigate("/shelfDetails");
    }
  };

  const [deleteShelf] = useMutation(DELETE_SHELF, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (!data.deleteShelfs.failure) {
        SuccessMessage("Shelf Deleted Successfully.");
        props.shelfRefetch();
      } else {
        ErrorMessage(data.deleteShelfs.message);
      }
    },
    onError: (data) => { console.log(data); },
  });

  const onDeleteShelf = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="saas-confirm-dialog">
          <h4>Delete Shelf?</h4>
          <p>Are you sure you want to delete this shelf?</p>
          <div className="d-flex justify-content-end gap-2">
            <Button onClick={onClose} extraClass="btn-light border">Cancel</Button>
            <Button
              buttonType="loss"
              extraClass="btn-danger"
              onClick={() => { deleteShelf({ variables: { shelf: id } }); onClose(); }}
            >
              Delete
            </Button>
          </div>
        </div>
      ),
    });
  };

  /* Decide which image to show */
  const fallbackSrc = `${process.env.PUBLIC_URL}/assets/authorImage/${imageName || "shelf1.png"}`;
  const imgSrc = bookImage
    ? `${process.env.PUBLIC_URL}/assets/bookImages/${bookImage}`
    : fallbackSrc;

  const isList = props.viewMode === "list";

  return (
    <div className={`shelf ${isList ? "shelf-list-item" : ""}`}>
      {/* Floating frosted action dock */}
      <div className="saas-card-actions justify-content-end">
        <span
          className="saas-action-icon text-success hand"
          title="Edit Shelf"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/addShelf", { state: { shelf: props.data.bookShelfs } });
          }}
        >
          <i className="fa fa-pen"></i>
        </span>
        <span
          className="saas-action-icon text-danger hand"
          title="Delete Shelf"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteShelf(props.data.bookShelfs.shelfId);
          }}
        >
          <i className="fa fa-trash"></i>
        </span>
      </div>

      {/* Cover image with ambient color aura + 3D cover */}
      <div className="saas-card-media" onClick={onShelfClickHandle}>
        <img
          src={imgSrc}
          alt=""
          aria-hidden="true"
          className="glass-cover-aura"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackSrc;
          }}
        />
        <img
          src={imgSrc}
          alt={props.data.bookShelfs.shelfName}
          className="glass-cover-fg"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackSrc;
          }}
        />
        {!isList && (
          <span className="glass-count-pill">
            <i className="fa-solid fa-book-open"></i>
            {props.data.bookCount}
          </span>
        )}
      </div>

      <div
        className={isList ? "flex-grow-1 min-w-0" : ""}
        onClick={onShelfClickHandle}
      >
        <div className="saas-card-title">
          {props.data.bookShelfs.shelfName}
        </div>
        {isList && (
          <div className="saas-card-meta">
            <i className="fa-solid fa-book-open"></i>
            <span>{props.data.bookCount} Books</span>
          </div>
        )}
      </div>
    </div>
  );
};

ParentShelf.propTypes = {};

export default ParentShelf;
