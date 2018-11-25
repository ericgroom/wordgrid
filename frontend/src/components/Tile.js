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
  border-radius: 0.2rem;
  box-shadow: 0 2px 3px 1px darkgreen;
  pointer-events: auto;

  &:hover {
    transform: translate(0px, -5px);
    transition: transform 0.1s;
  }
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
