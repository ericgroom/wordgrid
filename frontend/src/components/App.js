import React, { Component } from "react";
import styled from "styled-components";
import WordGrid from "./WordGrid";
import Stats from "./Stats";
import Messages from "./Messages";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

class App extends Component {
  state = {
    grid: [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "c",
      "o",
      "o",
      "l"
    ]
  };

  render() {
    return (
      <>
        <p className="mobile-warning">
          This website may not work on your mobile device.
        </p>
        <Container>
          <WordGrid
            letters={this.state.grid}
            onWord={word => console.log(`<App /> onWord: ${word}`)}
          />
        </Container>
        <Stats />
        <Messages />
      </>
    );
  }
}

export default App;
