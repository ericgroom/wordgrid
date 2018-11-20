import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { setNickname } from "../actions";

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
    this.props.setNickname(this.state.nickname);
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
      </Page>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setNickname: nickname => dispatch(setNickname(nickname))
});

export default connect(
  null,
  mapDispatchToProps
)(SetNickname);
