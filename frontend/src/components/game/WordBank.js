import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Spinner from "../styles/Spinner";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";
import List from "../styles/List";

const Word = styled.div`
  text-decoration: ${props =>
    props.valid === false ? "line-through" : "none"};
  margin: 0;

  span {
    text-decoration: none;
    color: ${props =>
      props.valid === undefined
        ? "inherit"
        : props.valid
        ? "lightgreen"
        : "red"};
    margin: 0;
    margin-left: 0.2rem;
  }
`;

const SmallSpinner = styled(Spinner)`
  width: 10px;
  height: 10px;
  display: inline-block;
  margin: 0;
  margin-left: 0.2rem;
  border: 1px solid lightblue;
  border-top: 2px solid #222;
`;

const WordBank = props => (
  <List>
    <h2>Played Words</h2>
    <ul>
      {props.words.map(word => (
        <li key={word.id}>
          <Word valid={word.valid}>
            {word.word}
            <span>
              {word.valid === undefined && <SmallSpinner />}
              {word.valid && <FA icon={faCheck} />}
              {word.valid === false && <FA icon={faTimes} />}
            </span>
          </Word>
        </li>
      ))}
    </ul>
  </List>
);

WordBank.propTypes = {
  words: PropTypes.arrayOf(
    PropTypes.shape({
      word: PropTypes.string,
      id: PropTypes.number,
      valid: PropTypes.bool
    })
  ).isRequired
};

export default WordBank;
