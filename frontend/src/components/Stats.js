import React from "react";
import styled from "styled-components";
import AnimatedNumber from "./AnimatedNumber";

const Wrapper = styled.div`
  text-align: center;
  h2 {
    height: 1rem;
  }
`;

const Stats = props => (
  <Wrapper>
    <h2>
      Score: <AnimatedNumber num={props.score} />
    </h2>
  </Wrapper>
);

export default Stats;
