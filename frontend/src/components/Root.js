import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider, connect } from "react-redux";
import { injectGlobal } from "styled-components";
import Game from "./Game";
import Welcome from "./Welcome";
import SetNickname from "./SetNickname";
import Nav from "./Nav";

const Root = props => (
  <Provider store={props.store}>
    <Router>
      <>
        <Nav />
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
    </Router>
  </Provider>
);

injectGlobal`
  body {
    background-color: #FFF8E7;
    font-family: sans-serif;
    margin: 0;
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
  /* https://stackoverflow.com/questions/29894997/prevent-ios-bounce-without-disabling-scroll-ability */
  /* html {
    position: fixed;
    height: 100%;
    overflow: hidden;
  } */

  body {
    width: 100vw;
    height: 100vh;
    /* overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch; */
  }
`;

const mapStateToProps = ({ game, user }) => ({
  gameActive: game.created && game.id,
  loading: game.created && !game.id,
  gameId: game.id,
  nickname: user.nickname
});

export default connect(mapStateToProps)(Root);
