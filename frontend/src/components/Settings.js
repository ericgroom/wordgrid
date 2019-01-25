import React from "react";
import styled from "styled-components";
import Form from "./styles/Form";
import { connect } from "react-redux";
import { setNickname } from "../actions";
import Spinner from "./styles/Spinner";
import ColorPicker from "./ColorPicker";

const Underline = styled.span`
  text-decoration: ${props => (props.underline ? "underline" : "inherit")};
`;

/**
 * Used to display user settings. Currently only used inside of a modal.
 */
class Settings extends React.Component {
  state = {
    nickname: "",
    nicknameSent: false
  };
  handleChange = e => {
    this.setState({ nicknameSent: false });
    this.setState({ nickname: e.target.value.slice(0, 16) });
  };
  handleSet = () => {
    this.setState({ nicknameSent: true });
    this.props.setNickname(this.state.nickname);
  };
  render() {
    return (
      <div className="settings">
        <Form>
          <fieldset disabled={this.props.loading}>
            <p>
              Change your nickname.{" "}
              <Underline underline={this.state.nickname.length >= 16}>
                Must be less than 16 characters
              </Underline>
            </p>
            <label htmlFor="nickname" className="row">
              Nickname:
              <input
                type="text"
                placeholder="Enter a nickname..."
                id="nickname"
                name="nickname"
                autoComplete="off"
                value={this.state.nickname}
                onChange={this.handleChange}
                onSubmit={this.handleSet}
              />
              <button onClick={this.handleSet}>Set</button>
              {this.props.loading && <Spinner />}
              {this.state.nicknameSent && !this.props.loading && (
                <p className="success">Nickname Changed!</p>
              )}
            </label>
          </fieldset>
          <fieldset>
            <p>Change the color your name is displayed as in chat.</p>
            <ColorPicker colors={["blue", "green", "red", "purple", "yellow", "orange", "pink", "gray"]}/>
          </fieldset>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  loading: user.nicknameRequested
});

const mapDispatchToProps = dispatch => ({
  setNickname: nickname => dispatch(setNickname(nickname))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
