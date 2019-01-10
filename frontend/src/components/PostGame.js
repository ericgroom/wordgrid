import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import ListContainer from "./styles/ListContainer";
import Container from "./styles/Container";

const ListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  justify-content: center;
  justify-items: center;
  align-items: flex-start;
`;

const List = styled.div`
  .main {
    margin-bottom: 1rem;
  }
  @media (max-width: 400px) {
    .detail {
      display: ${props => (props.showDetail ? "inherit" : "none")};
    }
  }
  ul {
    list-style: none;
    padding-left: 0;
    margin-top: 0;
  }
  h3 {
    margin-bottom: 0;
  }
  li {
    padding-bottom: 0.2rem;
  }
`;

/**
 * Displays a list of users, their score acheived, and list of words played.
 */
class PostGame extends React.Component {
  static propTypes = {
    /** array of users */
    results: PropTypes.arrayOf(
      PropTypes.shape({
        /** user's id */
        id: PropTypes.string,
        /** words the user played */
        words: PropTypes.arrayOf(
          PropTypes.shape({
            /** id of word */
            id: PropTypes.number,
            /** the actual word as a string */
            word: PropTypes.string
          })
        ),
        /** the score the user acheived */
        score: PropTypes.number
      })
    ).isRequired
  };
  state = {
    detailId: null
  };
  handleMainClick = (id, e) => {
    console.log(id);
    this.setState(prevState => ({
      detailId: id === prevState.detailId ? null : id
    }));
  };
  render() {
    const { results } = this.props;
    return (
      <Container>
        <ListContainer>
          <Helmet>
            <title>Game Over!</title>
          </Helmet>
          <h2>Game Over</h2>
          {results && results.length > 0 ? (
            <ListGrid>
              {results.map((user, index) => (
                <List
                  key={user.id}
                  user-id={user.id}
                  showDetail={
                    this.state.detailId === user.id ||
                    (this.state.detailId === null && index === 0)
                  }
                  onClick={this.handleMainClick.bind(this, user.id)}
                >
                  <h3 className="main">
                    {user.nickname} &ndash; {user.score}
                  </h3>
                  <div className="detail">
                    <ul>
                      {user.words &&
                        user.words.map(word => (
                          <li key={word.id}>{word.word}</li>
                        ))}
                    </ul>
                  </div>
                </List>
              ))}
            </ListGrid>
          ) : (
            <p>No Results</p>
          )}
        </ListContainer>
      </Container>
    );
  }
}

export default PostGame;
