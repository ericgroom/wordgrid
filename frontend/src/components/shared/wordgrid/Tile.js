import React from "react";
import styled from "styled-components/macro";
import posed from "react-pose";

const Growable = posed.div({
  normal: {
    scale: 1.0,
    boxShadow: "0px 0px 0px 0px darkgreen"
  },
  large: {
    scale: 1.1,
    boxShadow: "0px 2px 3px 1px darkgreen"
  }
});

const Background = styled(Growable)`
  background-color: #222;
  color: #fff;
  font-weight: bold;
  font-size: 2rem;
  font-family: sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.2rem;

  pointer-events: auto;

  p {
    margin: none;
    padding: none;
    user-select: none;
    width: 40px;
    height: 40px;
    line-height: 40px;
  }

  .container {
    position: relative;
    text-align: center;
    pointer-events: none;
  }
`;

const Tile = props => (
  <Background {...props}>
    <div className="container">
      <p className="letter">{props.letter}</p>
    </div>
  </Background>
);

export default Tile;
