import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider, connect } from "react-redux";
import { injectGlobal, ThemeProvider } from "styled-components";
import Game from "./Game";
import Welcome from "./Welcome";
import SetNickname from "./SetNickname";
import Nav from "./Nav";
import { Helmet } from "react-helmet";
import Chat from "./Chat";

const theme = {
  darkBlue: "#2756c3"
};

const Root = props => (
  <Provider store={props.store}>
    <Router>
      <ThemeProvider theme={theme}>
        <>
          <Helmet defaultTitle="WordGrid" titleTemplate="WordGrid | %s" />
          <Nav />
          <Chat />
          <Switch>
            <Route
              path="/"
              exact
              render={() => <Welcome loading={props.loading} />}
            />
            <Route
              path="/game/:id"
              render={() => {
                return props.nickname ? <Game /> : <SetNickname />;
              }}
            />
            <Route path="/game" component={Game} />
          </Switch>
        </>
      </ThemeProvider>
    </Router>
  </Provider>
);

injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=Lato');
  body {
    background-color: #FFF8E7;
    font-family: 'Lato', sans-serif;
    margin: 0;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    .mobile-warning {
      display: none;
    }
    @media (hover:none) {
      .mobile-warning {
        display: block;
        color: red;
      }
    }
  }


  body {
    width: 100vw;
    height: 100vh;
    max-width: 100%;
  }
`;

const mapStateToProps = ({ game, user }) => ({
  gameActive: game.created && game.id,
  loading: game.created && !game.id,
  gameId: game.id,
  nickname: user.nickname
});

export default connect(mapStateToProps)(Root);
