import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import styled from "styled-components";
import LineTo from "react-lineto";
import Tile from "./Tile";
import PointerListener from "./PointerListener";

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, 4rem);
  grid-template-rows: repeat(4, 4rem);
  gap: 1rem;
  padding: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  pointer-events: none;

  .tile {
    z-index: 5;
  }
`;

const CurrentWord = styled.h2`
  text-align: center;
  height: 1rem;
  visibility: ${({ show }) => (show ? "" : "hidden")};
`;

export default class WordGrid extends Component {
  static propTypes = {
    letters: PropTypes.arrayOf(PropTypes.string).isRequired,
    onWord: PropTypes.func
  };
  state = {
    currentIndex: null,
    currentPath: null
  };
  handleMouseDown(index, e) {
    e.preventDefault();
    this.setState({ currentPath: [index] });
  }
  handleMouseEnter(index, e) {
    e.preventDefault();
    if (this.state.currentPath) {
      this.setState(({ currentPath }) => ({
        currentIndex: index,
        currentPath: [..._.takeWhile(currentPath, i => i !== index), index]
      }));
    } else {
      this.setState({ currentIndex: index });
    }
  }
  handleMouseLeave(e) {
    e.preventDefault();
    this.setState({ currentIndex: null });
  }
  currentWord() {
    if (this.state.currentPath === null) {
      return "";
    }
    const letters = this.state.currentPath.map(i => this.props.letters[i]);
    return letters.join("");
  }
  endPath() {
    this.props.onWord(this.state.currentPath);
    this.setState({ currentPath: null });
  }
  render() {
    return (
      <>
        <PointerListener onPointerUp={this.endPath.bind(this)}>
          <Grid>
            {this.props.letters.map((letter, index) => (
              <Tile
                letter={letter}
                onPointerDown={this.handleMouseDown.bind(this, index)}
                onPointerEnter={this.handleMouseEnter.bind(this, index)}
                onPointerLeave={this.handleMouseLeave.bind(this)}
                className={`tile tile-${index}`}
                key={index}
              />
            ))}
          </Grid>
          {this.state.currentPath &&
            this.state.currentPath.slice(1).map((node, i) => {
              const previous = this.state.currentPath[i]; // since we slice, it's not i - 1
              return (
                <LineTo
                  from={`tile-${previous}`}
                  to={`tile-${node}`}
                  borderColor="lightgreen"
                  borderWidth="10px"
                />
              );
            })}
        </PointerListener>
        <CurrentWord show={!!this.state.currentPath}>
          {this.currentWord()}
        </CurrentWord>
      </>
    );
  }
}
