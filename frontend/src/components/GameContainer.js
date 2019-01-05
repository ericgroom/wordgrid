import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { PoseGroup } from "react-pose";
import { joinGame, completeWord, startGame, leaveGame } from "../actions";
import PreGame from "./PreGame";
import Game from "./Game";
import PostGame from "./PostGame";
import Spinner from "./styles/Spinner";
import ToTheLeft from "./styles/ToTheLeft";

class GameContainer extends Component {
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
    const { gameStarted, gameActive, gameEnded } = this.props;
    if (this.props.loading) return <Spinner />;
    if (this.props.gameExists) {
      return (
        <div className="game">
          <PoseGroup>
            {!gameStarted && (
              <ToTheLeft key={1}>
                <PreGame {...this.props} users={this.props.connectedUsers} />
              </ToTheLeft>
            )}
            {gameActive && (
              <ToTheLeft key={2}>
                <Game {...this.props} />
              </ToTheLeft>
            )}
            {gameEnded && (
              <ToTheLeft key={3}>
                <PostGame results={this.props.connectedUsers} />
              </ToTheLeft>
            )}
          </PoseGroup>
        </div>
      );
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
  wordsPlayed: game.words,
  nickname: nickname,
  gameStarted: game.started,
  gameEnded: game.ended,
  gameActive: game.started && !game.ended,
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
  onWordCompleted: word => dispatch(completeWord(word)),
  startGame: () => dispatch(startGame()),
  leaveGame: id => dispatch(leaveGame(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(GameContainer));
