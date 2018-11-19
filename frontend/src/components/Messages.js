import React from "react";
import { connect } from "react-redux";

class Messages extends React.Component {
  state = {
    message: ""
  };
  sendMessage = e => {
    e.preventDefault();
    const message = this.state.message;
    this.setState({ message: "" });
    this.props.sendMessage(message);
  };
  handleChange = e => {
    this.setState({ message: e.target.value });
  };
  render() {
    const { messages } = this.props;
    return (
      <>
        <form onSubmit={this.sendMessage}>
          <label htmlFor="message">
            Send a message:
            <input
              type="text"
              onChange={this.handleChange}
              value={this.state.message}
              name="message"
            />
          </label>
          <button type="submit">Send</button>
        </form>

        <div>
          {messages ? (
            messages.map(m => <p key={m.id}>{m.message}</p>)
          ) : (
            <p>No messages :(</p>
          )}
        </div>
      </>
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
)(Messages);
