import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import LineTo from "react-lineto";
import { appendOrRevert, bfs, gridNeighbors } from "../utils";
import Tile from "./Tile";
import PointerListener from "./PointerListener";
import TouchListener from "./TouchListener";

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, 4rem);
  grid-template-rows: repeat(4, 4rem);
  gap: 0.75rem;
  padding: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  pointer-events: none;
  justify-content: center;

  .tile {
    z-index: 5;
  }
`;

class WordGrid extends Component {
  static propTypes = {
    letters: PropTypes.arrayOf(PropTypes.string).isRequired,
    onWord: PropTypes.func
  };
  state = {
    path: null
  };
  beginPath = index => {
    this.setState({ path: [index] });
  };
  extendPath(index) {
    const path = this.state.path;
    // only allows including an index once
    let simplifiedPath = appendOrRevert(path, index);
    // make sure the path is walkable and fill in any gaps
    if (simplifiedPath.length > 1) {
      const current = simplifiedPath[simplifiedPath.length - 1];
      const previous = simplifiedPath[simplifiedPath.length - 2];
      const expandedPath = bfs(previous, current, gridNeighbors(4));
      simplifiedPath = [...simplifiedPath.slice(0, -2), ...expandedPath];
    }
    this.setState({ path: simplifiedPath });
  }
  handleMouseDown(index, e) {
    e.preventDefault();
    this.beginPath(index);
  }
  handleMouseEnter(index, e) {
    e.preventDefault();
    if (this.state.path) {
      this.extendPath(index);
    }
  }
  handleMouseLeave(e) {
    e.preventDefault();
  }
  handleTouchMove(i, e) {
    e.preventDefault();
    const { clientX, clientY } = e.touches[0];
    const elem = document.elementFromPoint(clientX, clientY);
    if (elem && elem.classList.contains("tile")) {
      const index = parseInt(elem.getAttribute("data-tile-index"));
      if (this.props.currentPath) {
        this.props.extendPath(index);
      } else {
        this.props.beginPath(index);
      }
    }
  }
  endPath() {
    if (this.state.path) {
      const path = this.state.path;
      const letters = this.props.letters;
      const word = path ? path.map(i => letters[i]).join("") : "";
      this.props.onWord && this.props.onWord({ word, path });
      this.setState({ path: null });
    }
  }
  render() {
    return (
      <>
        <TouchListener onTouchEnd={this.endPath.bind(this)}>
          <PointerListener onPointerUp={this.endPath.bind(this)}>
            <Grid>
              {this.props.letters.map((letter, index) => (
                <Tile
                  letter={letter}
                  onPointerDown={this.handleMouseDown.bind(this, index)}
                  onPointerEnter={this.handleMouseEnter.bind(this, index)}
                  onPointerLeave={this.handleMouseLeave.bind(this)}
                  onTouchMove={this.handleTouchMove.bind(this, index)}
                  className={`tile tile-${index}`}
                  key={index}
                  data-tile-index={index}
                />
              ))}
            </Grid>
            {this.state.path &&
              this.state.path.slice(1).map((node, i) => {
                const previous = this.state.path[i]; // since we slice, it's not i - 1
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
        </TouchListener>
      </>
    );
  }
}

export default WordGrid;
