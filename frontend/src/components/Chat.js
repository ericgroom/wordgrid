import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import ChatWindow from "./ChatWindow";

class Chat extends React.Component {
  state = {
    message: "",
    show: false
  };
  chatContainer = (function() {
    const el = document.createElement("div");
    el.id = "chat";
    return el;
  })();
  componentDidMount() {
    let portalDiv = document.getElementById("portal");
    if (!portalDiv) {
      portalDiv = document.createElement("div");
      portalDiv.id = "portal";
      document.getElementsByTagName("body")[0].appendChild(portalDiv);
    }
    portalDiv.appendChild(this.chatContainer);
  }
  componentWillUnmount() {
    const portalDiv = document.getElementById("portal");
    portalDiv.removeChild(this.chatContainer);
  }
  sendMessage = message => {
    this.props.sendMessage(message);
  };
  handleChange = e => {
    this.setState({ message: e.target.value });
  };
  render() {
    const { messages } = this.props;
    return ReactDOM.createPortal(
      <ChatWindow sendMessage={this.sendMessage} messages={messages} />,
      this.chatContainer
    );
  }
}

const mapStateToProps = state => ({
  messages: state.messages.messages
});

const mapDispatchToProps = dispatch => ({
  sendMessage: message => dispatch({ type: "SEND_MESSAGE", message })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat);
