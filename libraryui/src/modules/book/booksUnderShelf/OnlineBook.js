import React, { useState } from "react";
import PropTypes from "prop-types";
import "../book.scss";
import { useNavigate } from "react-router-dom";

const OnlineBook = (props) => {
  const [book, setBook] = useState({
    author: null,
    bookId: 0,
    bookName: null,
    description: null,
    detailsURL: null,
    format: null,
    genere: null,
    image: null,
    isbn: null,
    language: null,
    price: null,
    publicastion: null,
    publishigYear: null,
    shelfId: null,
    userId: null,
  });

  const navigate = useNavigate();

  const onDivClick = () => {
    console.log(props.data);
    let b = { ...book };
    let currentShelf = JSON.parse(sessionStorage.getItem("AddBookUnder"));
    b.shelfId = currentShelf.shelfId;
    b.userId = currentShelf.userId;
    b.author = props.data.author;
    b.bookName = props.data.bookName;
    b.detailsURL = props.data.detailsURL;
    b.publicastion = props.data.publicastion;
    navigate("/addBookToLibrary", { state: { book: b } });
  };

  return (
    <div className="col-sm-2 mb-2" title="add book" onClick={onDivClick}>
      <div className="col-sm-12 shelf p-2 text-center">
        <div>
          <img src={props.data.image} alt={props.data.image} width={"90%"} />
        </div>
        <div style={{ fontSize: "20px" }}>{props.data.bookName}</div>
        <div>{props.data.author}</div>
      </div>
    </div>
  );
};

OnlineBook.propTypes = {};

export default OnlineBook;
