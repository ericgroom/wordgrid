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
  componentDidMount() {
    const id = this.props.match.params.id;
    if (id) {
      this.props.joinGame(id);
    } else {
      this.props.history.push("/");
    }
  }

  render() {
    if (this.props.gameExists) {
      return (
        <>
          <p className="mobile-warning">
            This website may not work on your mobile device.
          </p>
          <Container>
            {this.props.letters && (
              <WordGrid
                letters={this.props.letters}
                onWord={word => console.log(`<App /> onWord: ${word}`)}
              />
            )}
          </Container>
          <Stats />
          <Messages />
        </>
      );
    } else {
      return <h1>This game doesn't exist</h1>;
    }
  }
}

const mapStateToProps = ({ game }) => ({
  letters: game.grid,
  started: game.started,
  gameExists: game.exists
});
const mapDispatchToProps = dispatch => ({
  joinGame: id => dispatch(joinGame(id))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
