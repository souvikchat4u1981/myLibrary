import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./book.scss";
import { Link, useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { GET_FIRST_BOOK_BY_SHELF } from "../../queries/BookQueries";

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
      let max = 6;
      const rand = min + Math.random() * (max - min);
      let r = Math.round(rand);
      if (sessionStorage.getItem("prevRand")) {
        if (r === +sessionStorage.getItem("prevRand")) {
          r = r + 1;
          if (r > max) {
            r = 1;
          }
        }
      }
      sessionStorage.setItem("prevRand", r);

      // console.log(r);
      setImageName("shelf" + r + ".png");
    } else {
      setImageName(props.data.bookShelfs.shelfImage);
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
    variables: {
      shelfId: JSON.parse(sessionStorage.getItem("currentShelf")).shelfId,
    },
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
      getBookImage({ variables: { shelfId: props.data.bookShelfs.shelfId } });
    }
  };

  useEffect(() => {}, [imageName]);

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

  return (
    <div className="hand mb-4" style={{ width: width }}>
      <div className="col-sm-12 shelf text-center p-2 shadow">
        <div className="col-sm-12 text-center hand">
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
            src={`${process.env.PUBLIC_URL}/assets/authorImage/${
              imageName !== "" ? imageName : "author.png"
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
              width={"60%"}
              height={"70%"}
              onClick={onShelfClickHandle}
              style={{
                position: "relative",
                left: "13%",
                zIndex: "2",
                top: "23%",
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
                top: "-130px",
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
