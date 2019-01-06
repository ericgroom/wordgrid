import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { setNickname } from "../actions";
import Spinner from "./styles/Spinner";

const Page = styled.div`
  text-align: center;
`;

class SetNickname extends React.Component {
  state = {
    nickname: ""
  };
  handleChange = e => {
    this.setState({ nickname: e.target.value.slice(0, 16) });
  };
  handleSubmit = e => {
    e.preventDefault();
    if (this.state.nickname.length > 0) {
      this.props.setNickname(this.state.nickname);
      this.setState({ nickname: "" });
    }
  };
  render() {
    return (
      <Page>
        <h1>To join please enter a nickname</h1>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="nickname">
            Nickname:
            <input
              type="text"
              value={this.state.nickname}
              onChange={this.handleChange}
              name="nickname"
              placeholder="nickname"
            />
          </label>
          <button type="submit">Set</button>
        </form>
        {this.props.loading && <Spinner />}
      </Page>
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
)(SetNickname);
