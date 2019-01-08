import React from "react";
import ReactDOM from "react-dom";
import Root from "./components/Root";
import * as serviceWorker from "./serviceWorker";
import { createAndConfigureStore } from "./store";

const store = createAndConfigureStore();

ReactDOM.render(<Root store={store} />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
