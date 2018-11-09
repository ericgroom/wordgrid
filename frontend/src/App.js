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
      <div className="App">
        <Container>
          <WordGrid letters={this.state.grid} />
        </Container>
      </div>
    );
  }
}

export default App;
