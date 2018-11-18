import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import LineTo from "react-lineto";
import { connect } from "react-redux";
import { extendPath, beginPath, endPath } from "../actions";
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

class WordGrid extends Component {
  static propTypes = {
    letters: PropTypes.arrayOf(PropTypes.string).isRequired,
    onWord: PropTypes.func
  };
  handleMouseDown(index, e) {
    e.preventDefault();
    this.props.beginPath(index);
  }
  handleMouseEnter(index, e) {
    e.preventDefault();
    if (this.props.currentPath) {
      console.log(this.props.currentPath);
      this.props.extendPath(index);
    }
  }
  handleMouseLeave(e) {
    e.preventDefault();
  }
  endPath() {
    this.props.onWord(this.props.currentPath);
    this.props.endPath();
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
          {this.props.currentPath &&
            this.props.currentPath.slice(1).map((node, i) => {
              const previous = this.props.currentPath[i]; // since we slice, it's not i - 1
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
      </>
    );
  }
}

const mapStateToProps = state => ({
  currentPath: state.grid.path
});

const mapDispatchToProps = dispatch => ({
  extendPath: index => dispatch(extendPath(index)),
  beginPath: index => dispatch(beginPath(index)),
  endPath: () => dispatch(endPath())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WordGrid);
