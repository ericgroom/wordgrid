import React, { Component } from "react";
import WebSocketHello from "./components/WebSocketHello";

class App extends Component {
  render() {
    return (
      <div className="App">
        <WebSocketHello />
      </div>
    );
  }
}

export default App;
