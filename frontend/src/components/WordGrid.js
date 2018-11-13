import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import styled from "styled-components";
import Tile from "./Tile";
import MouseListener from "./MouseListener";
import TouchListener from "./TouchListener";

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, 4rem);
  grid-template-rows: repeat(4, 4rem);
  row-gap: 1rem;
  column-gap: 1rem;
  padding: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`;

const CurrentWord = styled.h2`
  text-align: center;
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
  gridRef = React.createRef();
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
    const directions = [
      "top",
      "topright",
      "right",
      "bottomright",
      "bottom",
      "bottomleft",
      "left",
      "topleft"
    ];
    return (
      <div>
        <TouchListener>
          <MouseListener onMouseUp={this.endPath.bind(this)}>
            <Grid ref={this.gridRef}>
              {this.props.letters.map((letter, index) => (
                <Tile
                  letter={letter}
                  onPointerDown={this.handleMouseDown.bind(this, index)}
                  onPointerEnter={this.handleMouseEnter.bind(this, index)}
                  onPointerLeave={this.handleMouseLeave.bind(this)}
                  key={index}
                  // arrow={directions[index % directions.length]}
                />
              ))}
            </Grid>
          </MouseListener>
        </TouchListener>
        <CurrentWord>{this.currentWord()}</CurrentWord>
      </div>
    );
  }
}
