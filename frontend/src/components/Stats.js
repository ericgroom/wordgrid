import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

const Wrapper = styled.div`
  text-align: center;
  h2 {
    height: 1rem;
    /* visibility: ${({ show }) => (show ? "" : "hidden")}; */
  }
`;

const Stats = props => (
  <Wrapper>
    <h2>Score: {props.score}</h2>
    <h2>{props.currentWord}</h2>
  </Wrapper>
);

const mapStateToProps = ({ grid: { path, score, letters } }) => {
  return {
    currentWord: path ? path.map(i => letters[i]).join("") : "",
    score
  };
};

export default connect(mapStateToProps)(Stats);
