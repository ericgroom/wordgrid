import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import App from "./App";
import rootReducer from "./reducers";
import socketMiddleware from "./socketMiddleware";
import { composeWithDevTools } from "redux-devtools-extension";
import * as serviceWorker from "./serviceWorker";

const composeEnhancers = composeWithDevTools({
  shouldHotReload: false
});
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(socketMiddleware("localhost:3001/chat")))
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
