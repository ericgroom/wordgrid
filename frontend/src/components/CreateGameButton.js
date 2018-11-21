import React from "react";
import { connect } from "react-redux";
import { createGame } from "../actions";
import { Redirect } from "react-router";
import BigButton from "./styles/BigButton";

class CreateGameButton extends React.Component {
  state = { clicked: false }; // used to prevent react router from automatically routing without user interaction
  createGame = () => {
    this.props.createGame();
    this.setState({ clicked: true });
  };
  render() {
    const { disabled, redirect, gameId } = this.props;
    if (this.state.clicked && redirect)
      return <Redirect to={`/game/${gameId}`} />;
    return (
      <BigButton disabled={disabled} onClick={this.createGame}>
        Create New Game
      </BigButton>
    );
  }
}

const mapStateToProps = ({ game }) => ({
  gameId: game.id,
  redirect: game.id && game.created
});

const mapDispatchToProps = dispatch => ({
  createGame: () => dispatch(createGame())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateGameButton);
