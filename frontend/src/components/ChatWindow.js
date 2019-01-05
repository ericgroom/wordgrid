import React from "react";
import styled from "styled-components";
import posed from "react-pose";
import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

const Posed = posed.div({
  exit: {
    y: "18rem"
  },
  visible: {
    y: 0,
    transition: {
      type: "tween",
      duration: 200,
      ease: "easeInOut"
    }
  },
  hidden: {
    y: "15rem",
    transition: {
      type: "tween",
      duration: 200,
      ease: "easeInOut"
    }
  }
});

const ScaleUp = posed.div({
  show: {
    scale: 1.0
  },
  hide: {
    scale: 0.0
  }
});

const ChatWrapper = styled(Posed)`
  position: fixed;
  bottom: 0;
  right: 1rem;
  margin: 0;
  padding: 0;
  z-index: 998;
  .chat-header {
    display: ${props => (props.show ? "inherit" : "inline-block")};
    color: #eee;
    background-color: #222;
    font-weight: 600;
    padding: 0.5rem;
    font-size: 1rem;
    border-radius: 0.3rem 0.3rem 0 0;
    cursor: pointer;
    .badge {
      position: absolute;
      top: -0.5rem;
      left: -0.5rem;
      background-color: red;
      border-radius: 999em;
      padding: 0.1rem;
      font-size: 0.75rem;
      line-height: 1rem;
      min-width: 1rem;
      height: 1rem;
      white-space: nowrap;
      vertical-align: baseline;
      text-align: center;
    }
  }
  .chat-window-wrapper {
    width: 20rem;
    height: 15rem;
    background-color: white;
  }
  .message-list {
    margin: 0;
    padding-left: 0;
    padding: 0.5rem;
    overflow-wrap: break-word;
    overflow: auto;
    /* Dirty hack to allow message-input to be position absolute but not have message list underlap */
    height: calc(100% - 3.3rem);
    list-style: none;
    .muted {
      text-align: center;
    }
  }
  .message-input {
    display: flex;
    justify-content: stretch;
    align-items: stretch;
    position: absolute;
    bottom: 0;
    width: 100%;
    border-top: 1px solid gray;
    textarea {
      padding: 0.2rem;
      margin: 0;
      resize: none;
      width: 100%;
      height: 2.5rem;
      border: none;
      font-family: inherit;
      font-size: inherit;
    }
    button {
      border: none;
      color: #eee;
      background: ${props => props.theme.darkBlue};
    }
  }
  .muted {
    color: gray;
  }
  .sender {
    color: ${props => props.theme.darkBlue};
    white-space: nowrap;
  }
`;

class ChatWindow extends React.Component {
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
  toggleShow = () => {
    this.setState(prevState => ({ show: !prevState.show, unreadMessages: 0 }));
  };
  handleChange = e => {
    this.setState({ message: e.target.value });
  };
  sendMessage = message => {
    if (message && message.length > 0) {
      this.props.sendMessage(this.state.message);
      this.setState({ message: "" });
    }
  };
  handleSubmit = e => {
    e.preventDefault();
    this.sendMessage(this.state.message);
  };
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
