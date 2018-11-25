import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import BigButton from "./styles/BigButton";
import List from "./styles/List";
import Timer from "./Timer";

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

class PreGame extends React.Component {
  state = {
    clicked: false
  };
  handleButtonClick = () => {
    this.setState({ clicked: true });
    this.props.startGame();
  };
  render() {
    return (
      <Wrapper>
        <p>Pas encore commencée</p>
        <BigButton
          onClick={this.handleButtonClick}
          disabled={this.state.clicked}
        >
          {this.props.countdown ? (
            <Timer duration={this.props.countdownDuration}>
              {remaining => `Starting Game in ${remaining}...`}
            </Timer>
          ) : (
            "Start Game"
          )}
        </BigButton>
        <List>
          <h2>Connected Users</h2>
          {this.props.users.length > 0 ? (
            <ul>
              {this.props.users.map(user => (
                <li key={user.id}>{user.nickname}</li>
              ))}
            </ul>
          ) : (
            <p className="empty">There's nobody else here yet</p>
          )}
        </List>
      </Wrapper>
    );
  }
}

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
