import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Table from "./styles/Table";
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

class PostGame extends React.Component {
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
          <h2>Game Over</h2>
          {results.length > 0 ? (
            <ListGrid>
              {results.map(user => (
                <List
                  key={user.id}
                  user-id={user.id}
                  showDetail={this.state.detailId === user.id}
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

PostGame.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      words: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          word: PropTypes.string,
          valid: PropTypes.boolean
        })
      ),
      score: PropTypes.number
    })
  ).isRequired
};

export default PostGame;
