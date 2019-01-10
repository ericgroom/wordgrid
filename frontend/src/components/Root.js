import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider, connect } from "react-redux";
import { injectGlobal, ThemeProvider } from "styled-components";
import posed, { PoseGroup } from "react-pose";
import Game from "./game";
import Welcome from "./homepage";
import SetNickname from "./SetNickname";
import Nav from "./Nav";
import { Helmet } from "react-helmet";
import ErrorBoundary from "./shared/ErrorBoundary";

const theme = {
  darkBlue: "#2756c3"
};

const RouteContainer = posed.div({
  enter: {
    opacity: 1,
    delay: 100,
    beforeChildren: true
  },
  exit: {
    opacity: 0
  }
});

const Root = props => (
  <Provider store={props.store}>
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
            <Route
              render={({ location }) => (
                <PoseGroup>
                  <RouteContainer key={location.pathname}>
                    <Switch location={location}>
                      <Route
                        path="/"
                        exact
                        render={() => <Welcome loading={props.loading} />}
                        key="home"
                      />
                      <Route
                        path="/game/:id"
                        render={() => {
                          return props.needsNickname ? (
                            <SetNickname />
                          ) : (
                            <Game />
                          );
                        }}
                        key="game-id"
                      />
                      <Route path="/game" component={Game} key="game-no-id" />
                    </Switch>
                  </RouteContainer>
                </PoseGroup>
              )}
            />
          </ErrorBoundary>
        </>
      </ThemeProvider>
    </Router>
  </Provider>
);

injectGlobal`
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
  nickname: user.nickname,
  needsNickname: user.authConfirmed && !user.nickname
});

export default connect(mapStateToProps)(Root);
