import React, { Component } from "react";
import _ from "lodash";
import styled from "styled-components";
import Tile from "./Tile";

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
  state = {
    currentIndex: null,
    currentPath: null
  };
  handleMouseDown(index) {
    console.log(`mouseDown ${index}`);
    this.setState({ currentPath: [index] });
  }
  handleMouseUp(index) {
    console.log(`mouseUp ${index}`);
    console.log(this.state.currentPath);
    this.setState({ currentPath: null });
  }
  handleMouseEnter(index) {
    if (this.state.currentPath) {
      this.setState(({ currentPath }) => ({
        currentIndex: index,
        currentPath: [..._.takeWhile(currentPath, i => i !== index), index]
      }));
    } else {
      this.setState({ currentIndex: index });
    }
  }
  handleMouseLeave() {
    this.setState({ currentIndex: null });
  }
  currentWord() {
    if (this.state.currentPath === null) {
      return "";
    }
    const letters = this.state.currentPath.map(i => this.props.letters[i]);
    return letters.join("");
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
        <Grid>
          {this.props.letters.map((letter, index) => (
            <Tile
              letter={letter}
              onPointerDown={this.handleMouseDown.bind(this, index)}
              onPointerUp={this.handleMouseUp.bind(this, index)}
              onPointerEnter={this.handleMouseEnter.bind(this, index)}
              onPointerLeave={this.handleMouseLeave.bind(this)}
              touch-action="none"
              key={index}
              arrow={directions[index % directions.length]}
            />
          ))}
        </Grid>
        <CurrentWord>{this.currentWord()}</CurrentWord>
      </div>
    );
  }
}
