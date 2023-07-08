import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./book.scss";
import { Link, useNavigate } from "react-router-dom";

const ParentShelf = (props) => {
  const [width, setWidth] = useState("100%");
  useEffect(() => {
    if (window.screen.width < 600) {
      setWidth("50%");
    } else {
      setWidth("10%");
    }
  }, [props.count]);

  const [imageName, setImageName] = useState("shelf1.png");

  useEffect(() => {
    if (props.data.shelfImage === null) {
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
      setImageName(props.data.shelfImage);
    }
  }, []);

  const navigate = useNavigate();
  const onShelfClickHandle = () => {
    // console.log(props.data.shelfId);
    sessionStorage.setItem("shelfId", props.data.shelfId);
    if (props.fromChildPage) {
      sessionStorage.setItem("currentChildShelf", JSON.stringify(props.data));
      navigate("/childShelf");
    } else {
      sessionStorage.setItem("currentShelf", JSON.stringify(props.data));
      navigate("/shelfDetails");
    }
  };

  return (
    <div className="hand mb-4" style={{ width: width }}>
      <div className="col-sm-12 shelf text-center p-2 shadow">
        <div className="col-sm-12 text-center hand">
          <i
            className="fa fa-edit text-success float-end"
            title="Edit Shelf"
            style={{ position: "relative", top: "-5px" }}
            onClick={() =>
              navigate("/addShelf", {
                state: {
                  shelf: props.data,
                },
              })
            }
          ></i>
        </div>
        <img
          src={`${process.env.PUBLIC_URL}/assets/authorImage/${imageName}`}
          alt="library"
          width={"100%"}
          className="me-2"
          onClick={onShelfClickHandle}
        />
        <div className="mt-2" onClick={onShelfClickHandle}>
          <b>{props.data.shelfName}</b>
        </div>
      </div>
    </div>
  );
};

ParentShelf.propTypes = {};

export default ParentShelf;
