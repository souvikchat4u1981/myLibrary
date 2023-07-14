import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const BooksByAuthor = (props) => {
  const [width, setWidth] = useState("100%");
  useEffect(() => {
    if (window.screen.width < 600) {
      setWidth("50%");
    } else {
      setWidth("12.5%");
    }
  }, [props.count]);

  const navigate = useNavigate();

  return (
    <Fragment>
      <div className="container-fluid">
        <div className="p-2 pt-3 row col-sm-12">
          <div className="col-sm-4">
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                placeholder="Search By Book"
                value={props.bookSearchParam}
                onChange={props.onBookFilterChange}
              />
              <span class="input-group-text" id="basic-addon2">
                <i className="fa fa-search"></i>
              </span>
            </div>
          </div>
        </div>
        <div className="pt-3 row col-sm-12">
          <div className="justify-content-start">
            <div className="d-flex  pt-3 mb-3">
              <div>
                <i
                  className="fa fa-circle-left fa-2x hand golden-text"
                  onClick={() => props.setVisibleArea("main")}
                ></i>
              </div>
              <div
                className="badge rounded-pill bg-primary ms-2"
                style={{ fontSize: "15px", fontWeight: "normal" }}
              >
                Total books of {props.author} :{" "}
                {props.books ? props.books.length : 0}
              </div>
            </div>
            <div
              className="row"
              style={{
                width: "96%",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {props.books &&
                props.books.map((m) => {
                  return (
                    <div
                      className="hand mb-4"
                      key={props.books.bookId}
                      style={{ width: width }}
                      onClick={() =>
                        navigate("/borrow", {
                          state: {
                            book: {
                              bookId: m.bookId,
                              bookName: m.bookName,
                              authorName: m.author,
                              bookImage: m.bookImage,
                              shelfName:
                                m.parentShelfName + " -> " + m.shelfName,
                            },
                          },
                        })
                      }
                    >
                      <div className="col-sm-12 shelf text-center p-2 shadow">
                        <div
                          className="d-flex justify-content-center"
                          style={{ width: "100%" }}
                        >
                          <img
                            src={`${process.env.PUBLIC_URL}/assets/bookImages/${
                              m.bookImage !== "" ? m.bookImage : "book.png"
                            }`}
                            alt="library"
                            width={"100%"}
                            className="img-fluid rounded"
                            key={Math.random()}

                            //   onClick={onShelfClickHandle}
                          />
                        </div>
                        <div className="mt-2">
                          <b>{m.bookName}</b>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

BooksByAuthor.propTypes = {};

export default BooksByAuthor;
