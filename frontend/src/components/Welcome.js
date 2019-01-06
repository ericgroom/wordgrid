import React from "react";
import styled from "styled-components";
import posed from "react-pose";
import CreateGameButton from "./CreateGameButton";
import Spinner from "./styles/Spinner";
import WordGrid from "./WordGrid";

const transition = {
  exit: {
    opacity: 0,
    y: "-2rem"
  },
  enter: {
    opacity: 1,
    y: 0
  }
};

const PosedWrapper = posed.div({
  enter: {
    staggerChildren: 100,
    y: 0
  },
  exit: {
    y: "-2rem"
  }
});

const P = posed.p(transition);
const H2 = posed.h2(transition);

const Wrapper = styled(PosedWrapper)`
  text-align: center;
  margin-top: 1rem;
  color: #444;
  padding: 1rem;
  article {
    margin: 1rem auto;
    margin-top: 5rem;
    text-align: left;
    line-height: 1.5;
    max-width: 600px;
  }
`;

class Welcome extends React.Component {
  render() {
    const { loading } = this.props;
    return (
      <Wrapper initialPose="exit" pose="enter">
        <h1>Welcome to WordGrid!</h1>
        <CreateGameButton loading={loading} />
        {loading && <Spinner />}

        <article>
          <H2>What is WordGrid?</H2>
          <P>
            WordGrid is a fun word-based game that you can play with your
            friends or alone. It's similar to a crossword puzzle but time-based
            and you can connect letters in any direction.
          </P>
          <H2>How do I play?</H2>
          <P>
            Simple! After clicking the Create Game button above, you will be
            presented with a grid of 16 letters. Similar to a crossword puzzle,
            you connect letters by tapping/clicking and dragging between them.
            However unlike a crossword puzzle where you must created a word in a
            straight line, in WordGrid you can go up, down, left, right and
            diagonal within a single word. Longer words are worth more points.
            Obtain the most points within the allotted time to win!
          </P>
          <H2>Go ahead and try it!</H2>
          <P>
            You can either start a game above or play around with this example
            below. All you have to do is click/tap on the letter you want to
            start with and then drag across the rest of the tiles to form your
            word.
          </P>
        </article>
        <WordGrid letters={["w", "o", "r", "d", "g", "r", "i", "d", "w", "o", "r", "d", "g", "r", "i", "d"]} />
      </Wrapper>
    );
  }
}

export default Welcome;
