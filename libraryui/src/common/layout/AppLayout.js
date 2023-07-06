import React, { Fragment, useState } from "react";
import { Provider } from "react-redux";
import PropTypes from "prop-types";
import store from "../../store/Store";
import AppContext from "../../utils/AppContext";
import Header from "./Header";
import Setting from "./Setting";
import "./appLayout.scss";
import Footer from "./Footer";

const AppLayout = (props) => {
  const [user, setuser] = useState([]);
  const context = {
    user,
    setuser,
  };

  return (
    <Fragment>
      <Provider store={store}>
        <AppContext.Provider value={context}>
          <main
            className="container-fluid p-0 body-font"
            id="main"
            style={{ height: "100%", overflow: "hidden" }}
          >
            <header>
              <Header />
            </header>

            <Setting />
            <main
              className="container-fluid p-0"
              style={{ height: "90%", marginTop: "57px", marginBottom: "24px" }}
            >
              <div style={{ height: "90%" }}>
                <div
                  className="container-fluid m-0 p-0"
                  style={{ minHeight: "90vh" }}
                >
                  {props.children}
                </div>
              </div>
            </main>
            <footer className="footer">
              <Footer></Footer>
            </footer>
          </main>
        </AppContext.Provider>
      </Provider>
    </Fragment>
  );
};

AppLayout.propTypes = {};

export default AppLayout;
