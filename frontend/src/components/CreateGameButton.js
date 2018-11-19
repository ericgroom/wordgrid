import React from "react";
import { connect } from "react-redux";
import { createGame } from "../actions";
import BigButton from "./styles/BigButton";

const CreateGameButton = props => {
  return (
    <BigButton disabled={props.disabled} onClick={props.createGame}>
      Create New Game
    </BigButton>
  );
};

const mapDispatchToProps = dispatch => ({
  createGame: () => dispatch(createGame())
});

export default connect(
  null,
  mapDispatchToProps
)(CreateGameButton);
