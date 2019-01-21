import React from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import posed, { PoseGroup } from "react-pose";
import Welcome from "./homepage";
import SetNickname from "./SetNickname";
import Spinner from "./styles/Spinner";
import NotFound from "./NotFound";

const Game = React.lazy(() => import("./game"));

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

const App = props => (
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
                  <React.Suspense fallback={<Spinner />}>
                    <Game />
                  </React.Suspense>
                );
              }}
              key="game-id"
            />
            <Route component={NotFound} />
          </Switch>
        </RouteContainer>
      </PoseGroup>
    )}
  />
);

App.propTypes = {
  loading: PropTypes.bool.isRequired,
  needsNickname: PropTypes.bool.isRequired
};

export default App;
