import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { joinGame, completeWord, startGame, leaveGame } from "../actions";
import WordGrid from "./WordGrid";
import Stats from "./Stats";
import Messages from "./Messages";
import WordBank from "./WordBank";
import PreGame from "./PreGame";
import PostGame from "./PostGame";
import Spinner from "./styles/Spinner";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  align-items: center;
  justify-items: center;

  .left {
    grid-column: 2 / 3;
  }
  .right {
    grid-column: 3 / 4;
  }
`;

const mockResults = [
  {
    id: "id1",
    nickname: "user2",
    score: 20,
    words: [
      { id: 1, word: "hello" },
      { id: 2, word: "adsf" },
      { id: 3, word: "afsdjlasdj;" },
      { id: 4, word: "sfda" },
      { id: 5, word: "jlafsdldsfajl" },
      { id: 6, word: "afdsjlsacna;sdc" }
    ]
  },
  {
    id: "id2",
    nickname: "user1",
    score: 40,
    words: [
      { id: 1, word: "hello" },
      { id: 2, word: "adsf" },
      { id: 3, word: "afsdjlasdj;" },
      { id: 4, word: "sfda" },
      { id: 5, word: "jlafsdldsfajl" },
      { id: 6, word: "afdsjlsacna;sdc" }
    ]
  }
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
  componentWillUnmount() {
    this.props.leaveGame();
  }

  render() {
    if (this.props.loading) return <Spinner />;
    if (this.props.gameExists) {
      if (this.props.gameStarted && !this.props.gameEnded) {
        return (
          <Container>
            <div className="left">
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
            </div>
            <div className="right">
              <WordBank words={this.props.words} />
              <Messages />
            </div>
          </Container>
        );
      } else if (this.props.gameEnded) {
        return <PostGame results={mockResults} />;
      } else {
        return (
          <PreGame
            startGame={this.props.startGame}
            users={this.props.connectedUsers}
          />
        );
      }
    } else {
      return <h1>This game doesn't exist</h1>;
    }
  }
}

const mapStateToProps = ({ game, user }) => ({
  letters: game.grid,
  started: game.started,
  gameExists: game.exists,
  loading: game.created && !game.id,
  words: game.words,
  nickname: user.nickname,
  gameStarted: game.started,
  gameEnded: game.ended,
  connectedUsers: game.users
});

const mapDispatchToProps = dispatch => ({
  joinGame: id => dispatch(joinGame(id)),
  wordCompleted: word => dispatch(completeWord(word)),
  startGame: () => dispatch(startGame()),
  leaveGame: () => dispatch(leaveGame())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Game));
