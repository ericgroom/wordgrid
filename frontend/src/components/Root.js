import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  Link
} from "react-router-dom";
import { Provider, connect } from "react-redux";
import { injectGlobal } from "styled-components";
import Game from "./Game";
import Welcome from "./Welcome";

const Root = props => (
  <Provider store={props.store}>
    <Router>
      <Switch>
        <Route
          path="/"
          exact
          render={() => {
            return props.gameActive ? (
              <Redirect to={`/game/${props.gameId}`} />
            ) : (
              <Welcome loading={props.loading} />
            );
          }}
        />
        <Route path="/game/:id" component={Game} />
        <Route path="/game" component={Game} />
      </Switch>
    </Router>
  </Provider>
);

injectGlobal`
  body {
    background-color: #FFF8E7;
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
  html {
    position: fixed;
    height: 100%;
    overflow: hidden;
  }

  body {
    width: 100vw;
    height: 100vh;
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }
`;

const mapStateToProps = ({ game }) => ({
  gameActive: game.created && game.id,
  loading: game.created && !game.id,
  gameId: game.id
});

export default connect(mapStateToProps)(Root);
