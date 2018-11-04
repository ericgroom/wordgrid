import React from "react";
import styled from "styled-components";

const Background = styled.div`
  background-color: #222;
  color: #fff;
  font-weight: bold;
  font-size: 2rem;
  font-family: sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    margin: none;
    padding: none;
    user-select: none;
  }
`;

const Tile = props => (
  <Background {...props}>
    <p>{props.letter}</p>
  </Background>
);

export default Tile;
