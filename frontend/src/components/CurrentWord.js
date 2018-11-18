import { connect } from "react-redux";
import styled from "styled-components";

const Text = styled.h2`
  text-align: center;
  height: 1rem;
  visibility: ${({ show }) => (show ? "" : "hidden")};
`;

function currentWord() {
  if (this.state.currentPath === null) {
    return "";
  }
  const letters = this.state.currentPath.map(i => this.props.letters[i]);
  return letters.join("");
}

const CurrentWord = props => <Text>{props.currentWord}</Text>;

const mapStateToProps = state => ({
  currentWord: state.grid.currentPath.map(i => this.props.letters[i])
});

export default connect()(CurrentWord);
