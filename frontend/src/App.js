import React, { Component } from "react";
import styled, { injectGlobal } from "styled-components";
import WordGrid from "./components/WordGrid";

injectGlobal`
  body {
    background-color: #FFF8E7;
    .mobile-warning {
      display: none;
    }
    @media (hover:none) {
      .mobile-warning {
        display: block;
        color: red;
      }
    }
  }
  /* https://stackoverflow.com/questions/29894997/prevent-ios-bounce-without-disabling-scroll-ability */
  html {
    position: fixed;
    height: 100%;
    overflow: hidden;
  }

  body {
    width: 100vw;
    height: 100vh;
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }
`;

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
      "p",
      "o",
      "o",
      "p"
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
        <p>This should be scrollable content</p>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <p>I hope.</p>
      </>
    );
  }
}

export default App;
