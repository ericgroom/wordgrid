import React, { Component } from "react";
import styled, { injectGlobal } from "styled-components";
import WordGrid from "./components/WordGrid";

injectGlobal`
  body {
    background-color: #FFF8E7;
  }
`;

const Container = styled.div`
  margin: 10%;
  display: flex;
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
      "p",
      "o",
      "o",
      "p"
    ]
  };

  render() {
    return (
      <Container>
        <WordGrid
          letters={this.state.grid}
          onWord={word => console.log(`<App /> onWord: ${word}`)}
        />
      </Container>
    );
  }
}

export default App;
