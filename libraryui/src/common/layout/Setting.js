import React, { useContext } from "react";
import PropTypes from "prop-types";
import "./setting.scss";
import { ThemeContext } from "./ThemeContext";
import { useDispatch } from "react-redux";
import { changeTheme } from "../../store/slices/ThemeSlice";

const Setting = (props) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const handleThemeChange = () => {
    const isCurrentDark = theme === "dark";
    setTheme(isCurrentDark ? "light" : "dark");
    localStorage.setItem("default-theme", isCurrentDark ? "light" : "dark");
    dispatch(changeTheme(isCurrentDark ? "light" : "dark"));
  };
  return (
    <div
      className="settings d-flex justify-content-center align-items-center hand"
      onClick={handleThemeChange}
    >
      <div>
        {theme === "light" && (
          <i className="fa-solid fa-lightbulb text-dark fa-spin"></i>
        )}
        {theme === "dark" && (
          <i className="fa-regular fa-lightbulb text-white fa-spin"></i>
        )}
      </div>
    </div>
  );
};

Setting.propTypes = {};

export default Setting;
