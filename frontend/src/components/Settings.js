import React from "react";
import Form from "./styles/Form";
import { connect } from "react-redux";
import { setNickname } from "../actions";
import Spinner from "./styles/Spinner";
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
            <p>Change your nickname. Must be less than 16 characters</p>
            <label htmlFor="nickname">
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
