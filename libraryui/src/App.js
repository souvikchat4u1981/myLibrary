import logo from "./logo.svg";
import AppContext from "./utils/AppContext";
import { ToastContainer } from "react-toastify";
import RouterProvider from "./routes/RouterProvider";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "./common/layout/ThemeContext";
import { useState } from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import "./styles.scss";
function App() {
  const isBrowserDefaulDark = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const getDefaultTheme = () => {
    const localStorageTheme = localStorage.getItem("default-theme");
    const browserDefault = isBrowserDefaulDark() ? "dark" : "light";
    return localStorageTheme || browserDefault;
  };
  const [theme, setTheme] = useState(getDefaultTheme());
  const client = new ApolloClient({
    uri: window.Configs.graphqlAddress,
    cache: new InMemoryCache({ addTypename: false }),
  });

  return (
    <div className="app">
      <ApolloProvider client={client}>
        <AppContext.Provider value={AppContext}>
          <ToastContainer autoClose={3000} position="top-right" />
          <ThemeContext.Provider value={{ theme, setTheme }}>
            <div className={`theme-${theme}`}>
              <div className="app">
                <RouterProvider />
              </div>
            </div>
          </ThemeContext.Provider>
        </AppContext.Provider>
      </ApolloProvider>
    </div>
  );
}

export default App;
