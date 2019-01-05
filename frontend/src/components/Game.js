import React from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import Timer from "./Timer";
import Chat from "./Chat";
import WordGrid from "./WordGrid";
import Stats from "./Stats";
import Scoreboard from "./Scoreboard";
import WordBank from "./WordBank";

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
`;

class Game extends React.Component {
  render() {
    const {
      gameDuration,
      letters,
      onWordCompleted,
      score,
      connectedUsers,
      wordsPlayed
    } = this.props;
    return (
      <Container>
        <div className="main">
          <p className="mobile-warning">
            This website may not work on your mobile device.
          </p>
          <Timer duration={gameDuration}>
            {remaining => (
              <>
                <h1>{remaining}</h1>
                <Helmet>
                  <title>{`${remaining}`}</title>
                </Helmet>
              </>
            )}
          </Timer>
          {letters && <WordGrid letters={letters} onWord={onWordCompleted} />}
          <Stats score={score} />
        </div>
        <Scoreboard users={connectedUsers} className="scoreboard" />
        <aside className="wordbank">
          <WordBank words={wordsPlayed} />
          <Chat />
        </aside>
      </Container>
    );
  }
}

export default Game;
