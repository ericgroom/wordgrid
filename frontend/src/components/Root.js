import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider, connect } from "react-redux";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { Helmet } from "react-helmet";
import Nav from "./Nav";
import Footer from "./Footer";
import App from "./App";
import ErrorBoundary from "./shared/ErrorBoundary";

const theme = {
  darkBlue: "#2756c3"
};

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    height: 100%;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    position: relative;
    max-width: 100%;
    min-height: 100%;
    background-color: #FFF8E7;
    font-family: 'Lato', sans-serif;
    margin: 0;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }
  a {
    text-decoration: none;
    color: inherit;
  }
`;

const Root = ({ store, ...rest }) => (
  <Provider store={store}>
    <Router>
      <ThemeProvider theme={theme}>
        <>
          <Helmet defaultTitle="WordGrid" titleTemplate="WordGrid | %s">
            <link
              href="https://fonts.googleapis.com/css?family=Lato"
              rel="preload"
              as="style"
            />
          </Helmet>
          <Nav />
          <ErrorBoundary>
            <App {...rest} />
          </ErrorBoundary>
          <GlobalStyle />
          <Footer />
        </>
      </ThemeProvider>
    </Router>
  </Provider>
);

const mapStateToProps = ({ game, user }) => ({
  loading: game.created && !game.id,
  needsNickname: user.authConfirmed && !user.nickname
});

export default connect(mapStateToProps)(Root);
