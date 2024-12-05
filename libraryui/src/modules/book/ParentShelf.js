import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./book.scss";
import { Link, useNavigate } from "react-router-dom";
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
  const [width, setWidth] = useState("100%");
  useEffect(() => {
    if (window.screen.width < 600) {
      setWidth("50%");
    } else {
      setWidth("12.5%");
    }
  }, [props.data]);

  const [imageName, setImageName] = useState("shelf1.png");

  useEffect(() => {
    if (props.data.bookShelfs.shelfImage === null) {
      let min = 1;
      let max = 10;
      const rand = min + Math.random() * (max - min);
      // let r = Math.round(rand);
      // if (sessionStorage.getItem("prevRand")) {
      //   if (r === +sessionStorage.getItem("prevRand")) {
      //     r = r + 1;
      //     if (r > max) {
      //       r = 1;
      //     }
      //   }
      // }
      let r = 1;
      if (sessionStorage.getItem("prevRand")) {
        r = +sessionStorage.getItem("prevRand") + 1;

        if (r > 10) {
          r = 1;
        }
        sessionStorage.setItem("prevRand", r);
      } else {
        sessionStorage.setItem("prevRand", r);
      }

      // console.log(r);
      setImageName("shelf" + r + ".png");
    } else {
      setImageName(props.data.bookShelfs.shelfImage);
      if (sessionStorage.getItem("currentShelf") !== null)
        generateThumbNail(props.data.bookShelfs.shelfImage);
    }
  }, [props.data]);

  const navigate = useNavigate();
  const onShelfClickHandle = () => {
    // console.log(props.data.shelfId);
    sessionStorage.setItem("shelfId", props.data.bookShelfs.shelfId);
    if (props.fromChildPage) {
      sessionStorage.setItem(
        "currentChildShelf",
        JSON.stringify(props.data.bookShelfs)
      );
      navigate("/childShelf");
    } else {
      sessionStorage.setItem(
        "currentShelf",
        JSON.stringify(props.data.bookShelfs)
      );
      navigate("/shelfDetails");
    }
  };

  const [bookImage, setBookImage] = useState("");

  const [getBookImage] = useLazyQuery(GET_FIRST_BOOK_BY_SHELF, {
    notifyOnNetworkStatusChange: true,
    // variables: {
    //   shelfId: JSON.parse(sessionStorage.getItem("currentShelf")).shelfId,
    // },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      // setBooks(null);
      if (!data.getFirstBookInShelf.failure) {
        if (data.getFirstBookInShelf.book.image !== "") {
          setBookImage(data.getFirstBookInShelf.book.image);
          setDynamicImage(data.getFirstBookInShelf.book.image);
        }
      }
    },

    onError: (data) => {
      console.log(data);
    },
  });

  const generateThumbNail = (imageName) => {
    if (imageName === "") {
      getBookImage({
        variables: {
          shelfId: props.data.bookShelfs.shelfId
            ? props.data.bookShelfs.shelfId
            : 0,
        },
      });
    }
  };

  useEffect(() => { }, [imageName]);

  const setDynamicImage = (imageName) => {
    return (
      <div>
        <img
          src={`${process.env.PUBLIC_URL}/assets/bookImages/${imageName}`}
          alt="library"
          width={"100%"}
        />
      </div>
    );
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

    onError: (data) => {
      console.log(data);
    },
  });

  const onDeleteShelf = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div
            className="p-2"
            style={{ border: "1px solid black", borderRadius: "8px" }}
          >
            <h1>Confirm to delete</h1>
            <p>You want to delete this Shelf?</p>
            <Button onClick={onClose} extraClass={"btn-warning me-2"}>
              No
            </Button>
            <Button
              buttonType="loss"
              extraClass={"btn-danger"}
              onClick={() => {
                deleteShelf({ variables: { shelf: id } });
                onClose();
              }}
            >
              Yes, Delete it!
            </Button>
          </div>
        );
      },
    });
  };

  return (
    <div className="hand mb-2" style={{ width: width }}>
      <div className="col-sm-12 shelf text-center p-2 shadow">
        <div className="col-sm-12 text-center hand">
          <i
            className="fa fa-times-circle hand text-danger float-end ps-2"
            style={{ position: "relative", top: "-5px", zIndex: "3" }}
            onClick={() => onDeleteShelf(props.data.bookShelfs.shelfId)}
            title={"Delete Shelf"}
          ></i>
          <i
            className="fa fa-edit text-success float-end"
            title="Edit Shelf"
            style={{ position: "relative", top: "-5px", zIndex: "3" }}
            onClick={() => {
              console.log("Book Shelf", props.data.bookShelfs);
              navigate("/addShelf", {
                state: {
                  shelf: props.data.bookShelfs,
                },
              });
            }}
          ></i>
        </div>
        {bookImage === "" && (
          <img
            src={`${process.env.PUBLIC_URL}/assets/authorImage/${imageName !== "" ? imageName : "author.png"
              }`}
            alt="library"
            width={"100%"}
            className="me-2"
            onClick={onShelfClickHandle}
          />

        )}
        {bookImage !== "" && (
          <div style={{ position: "relative", height: "200px" }}>
            <img
              src={`${process.env.PUBLIC_URL}/assets/bookImages/${bookImage}`}
              alt="library"
              width={"58%"}
              height={"70%"}
              onClick={onShelfClickHandle}
              style={{
                position: "relative",
                left: "18%",
                zIndex: "2",
                top: "24%",
              }}
            />
            <img
              src={`${process.env.PUBLIC_URL}/assets/authorImage/book1.png`}
              alt="library"
              width={"100%"}
              height={"100%"}
              onClick={onShelfClickHandle}
              style={{
                position: "relative",
                left: "0%",
                zIndex: "1",
                top: "-125px",
              }}
            />
          </div>
        )}
        <div className="mt-2" onClick={onShelfClickHandle}>
          <b>{props.data.bookShelfs.shelfName}</b>
        </div>
        <div className="mt-2" onClick={onShelfClickHandle}>
          Books : {props.data.bookCount}
        </div>
      </div>
    </div>
  );
};

ParentShelf.propTypes = {};

export default ParentShelf;
