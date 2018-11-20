import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { joinGame, completeWord } from "../actions";
import WordGrid from "./WordGrid";
import Stats from "./Stats";
import Messages from "./Messages";
import WordBank from "./WordBank";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const words = [
  { word: "apple", id: 0, valid: true },
  { word: "pinapple", id: 1 },
  { word: "level", id: 2, valid: true },
  { word: "asdf", id: 3, valid: false },
  { word: "apple", id: 0, valid: true },
  { word: "pinapple", id: 1 },
  { word: "level", id: 2, valid: true },
  { word: "apple", id: 0, valid: true },
  { word: "pinapple", id: 1 },
  { word: "level", id: 2, valid: true }
];

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
          <Container>
            <p className="mobile-warning">
              This website may not work on your mobile device.
            </p>
            {this.props.letters && (
              <WordGrid
                letters={this.props.letters}
                onWord={this.props.wordCompleted}
              />
            )}
            <Stats />
            <WordBank words={this.props.words} />
            <Messages />
          </Container>
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
  gameExists: game.exists,
  words: game.words,
  nickname: game.nickname
});
const mapDispatchToProps = dispatch => ({
  joinGame: id => dispatch(joinGame(id)),
  wordCompleted: word => dispatch(completeWord(word))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Game));
