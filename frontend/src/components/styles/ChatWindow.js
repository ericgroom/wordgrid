import styled from "styled-components";
import posed from "react-pose";

/**
 * Transitions for <ChatWindow />
 */
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

/**
 * Styles for <ChatWindow />
 */
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

export default ChatWrapper;
