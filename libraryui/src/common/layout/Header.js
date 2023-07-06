import React, { useEffect, useState } from "react";
import "./header.scss";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { menuList } from "../../config/AppConfig";
import { useSelector } from "react-redux";
import API from "../../utils/API";
import { postCall } from "../../utils/RestCalls";

const Header = (props) => {
  const [user, setUser] = useState(null);
  const [pl, setPL] = useState(0);
  const navigate = useNavigate();
  const profitLoss = useSelector((state) => {
    if (typeof state.profit != "undefined" && state.profit.value !== 0) {
      return state.profit.value;
    }
  });

  useEffect(() => {
    let ploss = sessionStorage.getItem("pl");

    //console.log("PL:", pl);
    setPL(+ploss);
  }, [profitLoss]);

  useEffect(() => {
    var u = sessionStorage.getItem("user");
    setUser(JSON.parse(u));
  }, []);

  const logout = () => {
    let user = JSON.parse(sessionStorage.getItem("user"));
    let url = "authentication/logout";
    //console.log(url);

    postCall({
      endpoint: url,
      body: {
        username: user.userName,
        broker: user.broker,
      },
    }).then((data) => {
      //console.log(data);
      if (!data.failure) {
        navigate("/login");
      }
    });

    // //console.log(response);
    // API.post(url, {
    //   username: user.userName,

    //   headers: {},
    // }).then((response) => {
    //   if (response.status === 200) {
    //     //console.log(response.data);
    //     navigate("/login");
    //   }
    // });
  };

  const goto = (page) => {
    navigate(page);
  };

  const isActive = true;
  return (
    <nav className="navbar navbar-expand-lg navbar-light nav-back fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand">
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/Books.png`}
            alt="library"
            width={"32px"}
            className="me-2"
          />
          My Library
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {menuList.map((menu, index) => {
              return (
                <li className="nav-item " key={index}>
                  <NavLink
                    to={menu.routerLink}
                    // exact={true}
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    <i className={menu.icon}></i> {menu.menuName}
                  </NavLink>
                </li>
              );
            })}
            {/* <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                Dashboard
              </a>
            </li> */}
            {/*<li className="nav-item">
              <a className="nav-link" href="#">
                Features
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Pricing
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link disabled"
                href="#"
                tabindex="-1"
                aria-disabled="true"
              >
                Disabled
              </a>
            </li> */}
          </ul>
        </div>
        {/* <form className="d-flex me-4">
          <div className="d-flex dropdown">
            <div
              className="btn btn-sm dropdown-toggle user-panel"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fa fa-user-circle me-2"></i>
              {user && user.userName}
             
            </div>
            <ul
              className="dropdown-menu dropdown-menu-theme dropdown-menu-end"
              aria-labelledby="dropdownMenuButton1"
            >
              <li>
                <span
                  className="dropdown-item headerTextColor"
                  style={{ cursor: "pointer" }}
                  onClick={() => goto("/profile")}
                >
                  <i className="fa fa-user me-2"></i>
                  Profile
                </span>
              </li>
              <li>
                <span
                  className="dropdown-item headerTextColor"
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-gear me-2"></i>
                  Setting
                </span>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <span
                  className="dropdown-item headerTextColor"
                  style={{ cursor: "pointer" }}
                  onClick={logout}
                >
                  <i className="fa fa-right-from-bracket me-2"></i>
                  Logout
                </span>
              </li>
            </ul>
          </div>
        </form> */}
      </div>
    </nav>
  );
};

Header.propTypes = {};

export default Header;
