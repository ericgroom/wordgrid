import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { PoseGroup } from "react-pose";
import { joinGame, completeWord, startGame, leaveGame } from "../../actions";
import { getScoreOfCurrentUser, getGameState } from "../../reducers";
import PreGame from "./PreGame";
import Game from "./Game";
import PostGame from "./PostGame";
import Spinner from "../styles/Spinner";
import ToTheLeft from "../styles/ToTheLeft";
import Chat from "../chat";

class GameController extends Component {
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
    const { gameState } = this.props;
    switch (gameState) {
      case "loading":
        return <Spinner />;
      case "non-existant":
        return <h1>This game doesn't exist</h1>;
      case "active":
      case "pregame":
      case "ended":
        return (
          <div className="game">
            <PoseGroup>
              {gameState === "pregame" && (
                <ToTheLeft key={1}>
                  <PreGame {...this.props} users={this.props.connectedUsers} />
                </ToTheLeft>
              )}
              {gameState === "active" && (
                <ToTheLeft key={2}>
                  <Game {...this.props} />
                </ToTheLeft>
              )}
              {gameState === "ended" && (
                <ToTheLeft key={3}>
                  <PostGame results={this.props.connectedUsers} />
                </ToTheLeft>
              )}
            </PoseGroup>
            <Chat />
          </div>
        );
      default:
        throw new Error("unknown game state passed to <GameController />");
    }
  }
}

const mapStateToProps = state => {
  const {
    game,
    user: { nickname }
  } = state;
  return {
    letters: game.grid,
    gameId: game.id,
    gameState: getGameState(state),
    countdown: game.countdown,
    countdownDuration: game.countdownDuration,
    wordsPlayed: game.words,
    nickname: nickname,
    connectedUsers: game.users,
    gameDuration: game.duration,
    score: getScoreOfCurrentUser(state)
  };
};

const mapDispatchToProps = {
  joinGame,
  onWordCompleted: completeWord,
  startGame,
  leaveGame
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(GameController));
