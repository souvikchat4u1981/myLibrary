import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useLazyQuery } from "@apollo/client";
import { GET_FIRST_BOOK_BY_AUTHOR } from "../../../queries/BookQueries";

const MainListFolder = (props) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(props.data);
    if (props.data.authorImage === "") {
      generateThumbNail(props.data.authorName);
    }
  }, [props.data]);

  const [bookImage, setBookImage] = useState("");
  const [getBookImage] = useLazyQuery(GET_FIRST_BOOK_BY_AUTHOR, {
    notifyOnNetworkStatusChange: true,
    // variables: {
    //   shelfId: JSON.parse(sessionStorage.getItem("currentShelf")).shelfId,
    // },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      // setBooks(null);
      if (!data.getFirstBookInAuthor.failure) {
        if (data.getFirstBookInAuthor.book.image !== "") {
          setBookImage(data.getFirstBookInAuthor.book.image);
          setDynamicImage(data.getFirstBookInAuthor.book.image);
        }
      }
    },

    onError: (data) => {
      console.log(data);
    },
  });

  const generateThumbNail = (imageName) => {
    getBookImage({
      variables: {
        author: imageName,
      },
    });
  };

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

  const imgSrc =
    bookImage !== ""
      ? `${process.env.PUBLIC_URL}/assets/bookImages/${bookImage}`
      : `${process.env.PUBLIC_URL}/assets/authorImage/${
          data && data.authorImage && data.authorImage !== ""
            ? data.authorImage
            : "author.png"
        }`;
  const fallbackAuthor = `${process.env.PUBLIC_URL}/assets/authorImage/author.png`;

  return (
    <Fragment>
      {data && (
        <div
          className="shelf text-center"
          onClick={() => props.onClickAuthor(data)}
        >
          <div className="saas-card-media">
            <img
              src={imgSrc}
              alt=""
              aria-hidden="true"
              className="glass-cover-aura"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackAuthor;
              }}
            />
            <img
              src={imgSrc}
              alt={data.authorName}
              className="glass-cover-fg"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackAuthor;
              }}
            />
            <span className="glass-count-pill">
              <i className="fa-solid fa-book-open"></i>
              {data.bookCount}
            </span>
          </div>
          <div className="saas-card-title">{data.authorName}</div>
        </div>
      )}
    </Fragment>
  );
};

MainListFolder.propTypes = {};

export default MainListFolder;
