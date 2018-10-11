import React from "react";

class WebSocketHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: [], socket: null };
  }
  componentDidMount() {
    const socket = new WebSocket("ws://localhost:3001/game");
    this.setState({ socket });
    socket.addEventListener("open", function(event) {
      socket.send("Hello Server!");
    });
    const that = this;
    socket.addEventListener("message", function(event) {
      that.setState(state => ({ messages: [...state.messages, event.data] }));
      console.log(`message: ${event.data}`);
    });
  }
  sendMessage() {
    if (this.state.socket) {
      this.state.socket.send("Hello?");
    }
  }
  render() {
    return (
      <React.Fragment>
        <button onClick={this.sendMessage.bind(this)}>Say Hello!</button>
        <ul>
          {this.state.messages.map(message => (
            <li>{message}</li>
          ))}
        </ul>
      </React.Fragment>
    );
  }
}

export default WebSocketHello;
