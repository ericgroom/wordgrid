import React from "react";
import PropTypes from "prop-types";
import posed from "react-pose";
import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import ChatWrapper from "./styles/ChatWindow";

const ScaleUp = posed.div({
  show: {
    scale: 1.0
  },
  hide: {
    scale: 0.0
  }
});

/**
 * Manages the display and input of chat messages.
 */
class ChatWindow extends React.Component {
  static propTypes = {
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        sender: PropTypes.string,
        message: PropTypes.string
      })
    ),
    sendMessage: PropTypes.func.isRequired
  };
  state = {
    show: false,
    message: "",
    unreadMessages: 0
  };
  componentDidUpdate(prevProps, prevState) {
    if (!this.state.show && prevProps !== this.props) {
      const dMessages = this.props.messages.length - prevProps.messages.length;
      this.setState({ unreadMessages: prevState.unreadMessages + dMessages });
    }
  }
  /**
   * Toggles the display of the component
   */
  toggleShow = () => {
    this.setState(prevState => ({ show: !prevState.show, unreadMessages: 0 }));
  };
  handleChange = e => {
    this.setState({ message: e.target.value });
  };
  /**
   * Calls props.sendMessage with the user-inputted message
   */
  sendMessage = () => {
    this.props.sendMessage(this.state.message);
    this.setState({ message: "" });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.sendMessage(this.state.message);
  };
  /**
   * Changes the default behavior of textarea such that return submits
   * the current contents unless the shift key is held.
   */
  handleKeyPress = e => {
    if (e.which === 13 && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage(this.state.message);
    }
  };
  render() {
    const { show, unreadMessages } = this.state;
    const { messages } = this.props;
    return (
      <ChatWrapper
        className="chat"
        initialPose="exit"
        pose={show ? "visible" : "hidden"}
        show={show}
      >
        <div className="chat-header" onClick={this.toggleShow}>
          <ScaleUp
            className="badge"
            pose={unreadMessages > 0 ? "show" : "hide"}
          >
            {this.state.unreadMessages}
          </ScaleUp>
          Chat <FA icon={show ? faChevronDown : faChevronUp} />
        </div>
        <div className="chat-window-wrapper">
          <ul className="message-list">
            {messages &&
              messages.map(m => {
                return (
                  <li key={m.id}>
                    <span className="sender">{m.sender}:</span>
                    {m.message}
                  </li>
                );
              })}
            {(!messages || messages.length === 0) && (
              <p className="muted">There doesn't appear to be any messages</p>
            )}
          </ul>
          <form className="message-input" onSubmit={this.handleSubmit}>
            <textarea
              type="text"
              placeholder="Enter a message..."
              value={this.state.message}
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </ChatWrapper>
    );
  }
}

export default ChatWindow;
