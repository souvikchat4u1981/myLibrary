import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const DisplayBook = (props) => {
  const [width, setWidth] = useState("100%");
  useEffect(() => {
    if (window.screen.width < 600) {
      setWidth("50%");
    } else {
      setWidth("10%");
    }
  }, [props.count]);

  const [imageName, setImageName] = useState("book.png");

  useEffect(() => {
    if (props.data.image !== "") {
      setImageName(props.data.image);
    }
  }, []);

  const navigate = useNavigate();
  return (
    <div className="hand mb-4" style={{ width: width }}>
      <div className="col-sm-12 shelf text-center p-2 shadow">
        <div className="col-sm-12 text-center hand">
          <i
            className="fa fa-edit text-success float-end"
            title="Edit Shelf"
            style={{ position: "relative", top: "-5px" }}
            onClick={() =>
              navigate("/addBookToLibrary", {
                state: {
                  book: props.data,
                  edit: true,
                },
              })
            }
          ></i>
        </div>
        <img
          src={`${process.env.PUBLIC_URL}/assets/bookImages/${imageName}`}
          alt="library"
          width={"100%"}
          className="me-2"
          //   onClick={onShelfClickHandle}
        />
        <div className="mt-2">
          <b>{props.data.bookName}</b>
        </div>
      </div>
    </div>
  );
};

DisplayBook.propTypes = {};

export default DisplayBook;
