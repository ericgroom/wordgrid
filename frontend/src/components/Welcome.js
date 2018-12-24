import React from "react";
import styled from "styled-components";
import CreateGameButton from "./CreateGameButton";
import Spinner from "./styles/Spinner";

const Wrapper = styled.div`
  text-align: center;
  font-family: sans-serif;
  margin-top: 10%;
  color: #444;

  article {
    margin: 1rem auto;
    margin-top: 5rem;
    text-align: left;
    line-height: 1.5;
    max-width: 600px;
  }
`;

const Welcome = ({ loading }) => (
  <Wrapper>
    <h1>Welcome to WordGrid!</h1>
    <CreateGameButton loading={loading} />
    {loading && <Spinner />}

    <article>
      <h2>What is WordGrid?</h2>
      <p>
        WordGrid is a fun word-based game that you can play with your friends or
        alone. It's similar to a crossword puzzle but time-based and you can
        connect letters in any direction.
      </p>
      <h2>How do I play?</h2>
      <p>
        Simple! After clicking the Create Game button above, you will be
        presented with a grid of 16 letters. Similar to a crossword puzzle, you
        connect letters by tapping/clicking and dragging between them. However
        unlike a crossword puzzle where you must created a word in a straight
        line, in WordGrid you can go up, down, left, right and diagonal within a
        single word. Longer words are worth more points. Obtain the most points
        within the allotted time to win!
      </p>
    </article>
  </Wrapper>
);

export default Welcome;
