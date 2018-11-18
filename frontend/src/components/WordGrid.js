import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import LineTo from "react-lineto";
import Tile from "./Tile";
import PointerListener from "./PointerListener";
import { appendOrRevert, bfs, gridNeighbors } from "../utils";

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
      this.setState(({ currentPath }) => {
        // only allows including an index once
        let simplifiedPath = appendOrRevert(currentPath, index);
        // make sure the path is walkable and fill in any gaps
        if (simplifiedPath.length > 1) {
          const current = simplifiedPath[simplifiedPath.length - 1];
          const previous = simplifiedPath[simplifiedPath.length - 2];
          const expandedPath = bfs(previous, current, gridNeighbors(4));
          simplifiedPath = [...simplifiedPath.slice(0, -2), ...expandedPath];
        }
        return { currentIndex: index, currentPath: simplifiedPath };
      });
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
                  borderWidth={10}
                  key={`line-${previous}-${node}`}
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
