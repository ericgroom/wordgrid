import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

const ChatWrapper = styled.div`
  position: fixed;
  bottom: 0;
  right: 1rem;
  margin: 0;
  padding: 0;
  .chat-header {
    color: #eee;
    background-color: #222;
    font-weight: 600;
    padding: 0.5rem;
    font-size: 1rem;
    border-radius: 0.3rem 0.3rem 0 0;
    cursor: pointer;
  }
  .chat-window-wrapper {
    width: 20rem;
    height: 15rem;
    display: ${props => (props.show ? "inherit" : "none")};
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
    message: ""
  };
  toggleShow = () => {
    this.setState(prevState => ({ show: !prevState.show }));
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
    const { show } = this.state;
    const { messages } = this.props;
    return (
      <ChatWrapper className="chat" show={show}>
        <div className="chat-header" onClick={this.toggleShow}>
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
