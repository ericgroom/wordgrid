import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import BigButton from "./styles/BigButton";
import List from "./styles/List";

const Wrapper = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  button {
    margin-bottom: 1rem;
  }
  .empty {
    color: rgba(0, 0, 0, 0.7);
  }
`;

const PreGame = props => (
  <Wrapper>
    <p>Pas encore commencée</p>
    <BigButton onClick={props.startGame}>Start Game</BigButton>
    <List>
      <h2>Connected Users</h2>
      {props.users.length > 0 ? (
        <ul>
          {props.users.map(user => (
            <li key={user.id}>{user.nickname}</li>
          ))}
        </ul>
      ) : (
        <p className="empty">There's nobody else here yet</p>
      )}
    </List>
  </Wrapper>
);

PreGame.propTypes = {
  startGame: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      nickname: PropTypes.string
    })
  ).isRequired
};

export default PreGame;
