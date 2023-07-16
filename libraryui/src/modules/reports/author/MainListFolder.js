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

  return (
    <Fragment>
      {data && (
        <div className="hand mb-4" style={{ width: "10%" }}>
          <div className="col-sm-12 shelf text-center p-2 shadow">
            {bookImage === "" && (
              //   <div style={{ position: "relative", height: "150px" }}>
              <img
                src={`${process.env.PUBLIC_URL}/assets/authorImage/${
                  data.authorImage !== "" ? data.authorImage : "author.png"
                }`}
                alt="library"
                width={"100%"}
                className="me-2"
                onClick={() => props.onClickAuthor(data)}
              />
              //   </div>
            )}
            {bookImage !== "" && (
              <div style={{ position: "relative", height: "170px" }}>
                <img
                  src={`${process.env.PUBLIC_URL}/assets/bookImages/${bookImage}`}
                  alt="library"
                  width={"60%"}
                  height={"70%"}
                  onClick={() => props.onClickAuthor(data)}
                  style={{
                    position: "relative",
                    left: "9%",
                    zIndex: "2",
                    top: "13%",
                  }}
                />
                <img
                  src={`${process.env.PUBLIC_URL}/assets/authorImage/book1.png`}
                  alt="library"
                  width={"100%"}
                  height={"100%"}
                  onClick={() => props.onClickAuthor(data)}
                  style={{
                    position: "relative",
                    left: "0%",
                    zIndex: "1",
                    top: "-125px",
                  }}
                />
              </div>
            )}
            <div className="mt-2" onClick={() => props.onClickAuthor(data)}>
              <b>{data.authorName}</b>
            </div>
            <div className="mt-2" onClick={() => props.onClickAuthor(data)}>
              Books : {data.bookCount}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

MainListFolder.propTypes = {};

export default MainListFolder;
