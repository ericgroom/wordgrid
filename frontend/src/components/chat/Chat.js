import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ChatWindow from "./ChatWindow";

/**
 * Container component for chat. Interfaces with redux as well as mounts
 * ChatWindow as a portal
 */
export class Chat extends React.Component {
  static propTypes = {
    /** List of messages to display */
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        sender: PropTypes.string,
        message: PropTypes.string
      })
    ),
    /** Function to call when the user sends a message */
    sendMessage: PropTypes.func.isRequired
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
  /**
   * Calls props.sendMessage with message content.
   *
   * @param {string} message message text
   */
  sendMessage = message => {
    if (message && message.length > 0) {
      this.props.sendMessage(message);
    }
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
