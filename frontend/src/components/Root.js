import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";

const Hello = () => <p>Hi</p>;

const Root = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/" component={App} exact />
        <Route path="/hello" component={Hello} />
      </Switch>
    </Router>
  </Provider>
);

export default Root;
