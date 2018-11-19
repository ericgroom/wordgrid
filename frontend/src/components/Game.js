import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import WordGrid from "./WordGrid";
import Stats from "./Stats";
import Messages from "./Messages";
import { joinGame } from "../actions";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

class Game extends Component {
  state = {
    grid: [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "c",
      "o",
      "o",
      "l"
    ]
  };
  componentDidMount() {
    const id = this.props.match.params.id;
    if (id) {
      this.props.joinGame(id);
    } else {
      this.props.history.push("/");
    }
  }

  render() {
    return (
      <>
        <p className="mobile-warning">
          This website may not work on your mobile device.
        </p>
        <Container>
          <WordGrid
            letters={this.state.grid}
            onWord={word => console.log(`<App /> onWord: ${word}`)}
          />
        </Container>
        <Stats />
        <Messages />
      </>
    );
  }
}

const mapStateToProps = ({ game }) => ({});
const mapDispatchToProps = dispatch => ({
  joinGame: id => dispatch(joinGame(id))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
