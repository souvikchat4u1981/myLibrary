import React, { useContext } from "react";
import "./header.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { menuList } from "../../config/AppConfig";
import { ThemeContext } from "./ThemeContext";
import { useDispatch } from "react-redux";
import { changeTheme } from "../../store/slices/ThemeSlice";

const Header = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useContext(ThemeContext);
  const dispatch = useDispatch();

  const handleThemeChange = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("default-theme", nextTheme);
    dispatch(changeTheme(nextTheme));
  };

  return (
    <nav className="navbar navbar-expand-lg nav-back fixed-top">
      <div className="container-fluid px-3 px-md-4">
        <span
          className="navbar-brand hand d-flex align-items-center gap-2"
          onClick={() => navigate("/")}
        >
          <span className="brand-logo-wrap">
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/Books.png`}
              alt="library"
              width="24"
              height="24"
            />
          </span>
          <span className="brand-title">
            {window.Configs?.applicationName || "My Library"}
          </span>
        </span>

        <div className="d-flex align-items-center gap-2 order-lg-3">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={handleThemeChange}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <i className="fa-solid fa-sun"></i>
            ) : (
              <i className="fa-solid fa-moon"></i>
            )}
          </button>

          <button
            className="navbar-toggler saas-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>

        <div className="collapse navbar-collapse order-lg-2" id="navbarNav">
          <ul className="navbar-nav ms-lg-4 gap-1">
            {menuList.map((menu, index) => (
              <li className="nav-item" key={index}>
                <NavLink
                  to={menu.routerLink}
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  <i className={`${menu.icon} me-2`}></i>
                  <span>{menu.menuName}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

Header.propTypes = {};

export default Header;
