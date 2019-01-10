import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import LineTo from "react-lineto";
import { extendAndReconcilePath } from "./utils";
import Tile from "./Tile";
import PointerListener from "./PointerListener";
import TouchListener from "./TouchListener";

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, 4rem);
  grid-template-rows: repeat(4, 4rem);
  gap: 1rem;
  padding: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  pointer-events: none;
  justify-content: center;

  .tile {
    z-index: 5;
  }
`;

/**
 * Displays a grid of letters and listens to various browser events to enable
 * the user to draw paths between them.
 */
class WordGrid extends Component {
  static propTypes = {
    /** 1d array of letters used in grid */
    letters: PropTypes.arrayOf(PropTypes.string).isRequired,
    /** called when a path is drawn with the word as a string and the path taken */
    onWord: PropTypes.func
  };
  state = {
    path: null
  };
  /**
   * Start tracking a path
   *
   * @param {number} index index of first tile
   */
  beginPath = index => {
    this.setState({ path: [index] });
  };
  /**
   * Extends a current path and preforms some reconciling to prevent users from
   * submitting non-walkable paths.
   * @param {number} index index of tile to add to current path
   */
  extendPath(index) {
    const path = this.state.path;
    const reconciledPath = extendAndReconcilePath(path, index);
    this.setState({ path: reconciledPath });
  }
  /**
   * Ends the current path being tracked, if one exists and handles related side effects.
   */
  endPath = () => {
    if (this.state.path) {
      const path = this.state.path;
      const letters = this.props.letters;
      const word = path ? path.map(i => letters[i]).join("") : "";
      this.props.onWord && this.props.onWord({ word, path });
      this.setState({ path: null });
    }
  };
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
  /**
   * Handles the starting and ending of paths for touch events.
   * Dependant on the tiles having a class of `tile` and a `data-tile-index` attribute.
   * Index is not passed here because continous touch events' target is always the first
   * element triggered, and isn't updated as the user moves their finger, so client position
   * of a touch is used instead.
   * @param {*} e touch event
   */
  handleTouchMove = e => {
    e.preventDefault();
    const { clientX, clientY } = e.touches[0];
    const elem = document.elementFromPoint(clientX, clientY);
    // make sure the element is a tile due to event bubbling
    if (elem && elem.classList.contains("tile")) {
      const index = parseInt(elem.getAttribute("data-tile-index"));
      if (this.state.path) {
        this.extendPath(index);
      } else {
        this.beginPath(index);
      }
    }
  };
  /**
   * Determines the pose for a tile based on its index.
   *
   * @param {number} index index of tile
   */
  tilePose = index => {
    if (this.state.path && this.state.path.includes(index)) {
      return "large";
    }
    return "normal";
  };
  render() {
    const { letters } = this.props;
    const { path } = this.state;
    return (
      <TouchListener onTouchEnd={this.endPath}>
        <PointerListener onPointerUp={this.endPath}>
          <Grid>
            {letters &&
              letters.map((letter, index) => (
                <Tile
                  letter={letter}
                  onPointerDown={this.handleMouseDown.bind(this, index)}
                  onMouseDown={this.handleMouseDown.bind(this, index)}
                  onPointerEnter={this.handleMouseEnter.bind(this, index)}
                  onMouseEnter={this.handleMouseEnter.bind(this, index)}
                  onPointerLeave={this.handleMouseLeave}
                  onMouseLeave={this.handleMouseLeave}
                  onTouchMove={this.handleTouchMove}
                  className={`tile tile-${index}`}
                  key={index}
                  data-tile-index={index}
                  pose={this.tilePose(index)}
                />
              ))}
          </Grid>
          {path &&
            path.slice(1).map((node, i) => {
              const previous = path[i]; // since we slice, it's not i - 1
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
    );
  }
}

export default WordGrid;
