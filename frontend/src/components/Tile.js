import React from "react";
import styled from "styled-components";

const positions = {
  top: {
    left: "5px",
    top: "-25px",
    rotate: "90deg"
  },
  topright: {
    left: "25px",
    top: "-18px",
    rotate: "135deg"
  },
  right: {
    left: "25px",
    top: "9px",
    rotate: "180deg"
  },
  bottomright: {
    left: "20px",
    top: "26px",
    rotate: "-135deg"
  },
  bottom: {
    left: "-5px",
    top: "25px",
    rotate: "-90deg"
  },
  bottomleft: {
    left: "-22px",
    top: "18px",
    rotate: "-45deg"
  },
  left: {
    left: "-25px",
    top: "-3px",
    rotate: "0deg"
  },
  topleft: {
    left: "-18px",
    top: "-22px",
    rotate: "45deg"
  }
};

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
  }
`;

const Arrow = styled.p`
  position: absolute;
  left: ${props => props.left};
  top: ${props => props.top};
  transform: rotate(${props => props.rotate});
  font-weight: 100;
  text-shadow: 0 0 3px beige;
`;

const Tile = props => (
  <Background {...props}>
    <div className="container">
      {props.arrow && <Arrow {...positions[props.arrow]}>‹</Arrow>}
      <p className="letter">{props.letter}</p>
    </div>
  </Background>
);

export default Tile;
