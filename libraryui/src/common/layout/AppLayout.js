import React, { Fragment, useState } from "react";
import { Provider } from "react-redux";
import store from "../../store/Store";
import AppContext from "../../utils/AppContext";
import Header from "./Header";
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
          <div className="saas-shell body-font" id="main">
            <header>
              <Header />
            </header>

            <main className="saas-main container-fluid px-3 px-md-4">
              {props.children}
            </main>

            <Footer />
          </div>
        </AppContext.Provider>
      </Provider>
    </Fragment>
  );
};

AppLayout.propTypes = {};

export default AppLayout;
