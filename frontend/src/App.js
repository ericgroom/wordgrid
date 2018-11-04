import React, { Component } from "react";
import styled from 'styled-components';
import WordGrid from "./components/WordGrid";

const Container = styled.div`
  margin: 10%;
  display: flex;
  justify-content: center;
`;

class App extends Component {
  state = {
    grid: ['a', 'b', 'c', 'd','e', 'f', 'g', 'h','i', 'j', 'k', 'l','m', 'n', 'o', 'p']
  }

  render() {
    return (
      <div className="App">
        <Container>
          <WordGrid letters={this.state.grid}></WordGrid>
        </Container>
      </div>
    );
  }
}

export default App;
