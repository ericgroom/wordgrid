import React, { Component } from "react";
import styled from "styled-components";
import _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import { joinGame, completeWord, startGame, leaveGame } from "../actions";
import WordGrid from "./WordGrid";
import Stats from "./Stats";
import Chat from "./Chat";
import WordBank from "./WordBank";
import PreGame from "./PreGame";
import PostGame from "./PostGame";
import Spinner from "./styles/Spinner";
import Timer from "./Timer";
import Scoreboard from "./Scoreboard";

const Container = styled.div`
  display: grid;
  gap: 1rem;
  align-items: center;
  justify-items: center;
  text-align: center;

  @media (min-width: 800px) {
    grid-template-columns: repeat(2, minmax(400px, 1fr));
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, minmax(400px, 1fr));
    .scoreboard {
      order: 0;
    }
    .main {
      order: 1;
    }
    .wordbank {
      order: 2;
    }
  }

  /* @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  } */

  /* @media (min-width: 900px) {
    grid-template-columns: minmax(1rem, 1fr) 1fr minmax(200px, 1fr);
    .left {
      grid-column: 2 / 3;
    }
    .right {
      grid-column: 3 / 4;
    }
  } */
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
  componentWillUnmount() {
    this.props.leaveGame(this.props.gameId);
  }

  render() {
    if (this.props.loading) return <Spinner />;
    if (this.props.gameExists) {
      if (this.props.gameStarted && !this.props.gameEnded) {
        return (
          <Container>
            <div className="main">
              <p className="mobile-warning">
                This website may not work on your mobile device.
              </p>
              <Timer duration={this.props.gameDuration}>
                {remaining => (
                  <>
                    <h1>{remaining}</h1>
                    <Helmet>
                      <title>{`${remaining}`}</title>
                    </Helmet>
                  </>
                )}
              </Timer>
              {this.props.letters && (
                <WordGrid
                  letters={this.props.letters}
                  onWord={this.props.wordCompleted}
                />
              )}
              <Stats score={this.props.score} />
            </div>
            <Scoreboard
              users={this.props.connectedUsers}
              className="scoreboard"
            />
            <aside className="wordbank">
              <WordBank words={this.props.words} />
              <Chat />
            </aside>
          </Container>
        );
      } else if (this.props.gameEnded) {
        return <PostGame results={this.props.connectedUsers} />;
      } else {
        return (
          <PreGame
            startGame={this.props.startGame}
            users={this.props.connectedUsers}
            countdown={this.props.countdown}
            countdownDuration={this.props.countdownDuration}
          />
        );
      }
    } else {
      return <h1>This game doesn't exist</h1>;
    }
  }
}

const mapStateToProps = ({ game, user: { userId, nickname } }) => ({
  letters: game.grid,
  gameId: game.id,
  started: game.started,
  countdown: game.countdown,
  countdownDuration: game.countdownDuration,
  gameExists: game.exists,
  loading: game.created && !game.id,
  words: game.words,
  nickname: nickname,
  gameStarted: game.started,
  gameEnded: game.ended,
  connectedUsers: game.users,
  gameDuration: game.remainingDurationOnJoin
    ? game.remainingDurationOnJoin
    : game.duration,
  score:
    game.users.length > 0
      ? game.users
        ? _.get(game.users.find(user => user.id === userId), "score", 0)
        : 0
      : 0
});

const mapDispatchToProps = dispatch => ({
  joinGame: id => dispatch(joinGame(id)),
  wordCompleted: word => dispatch(completeWord(word)),
  startGame: () => dispatch(startGame()),
  leaveGame: id => dispatch(leaveGame(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Game));
