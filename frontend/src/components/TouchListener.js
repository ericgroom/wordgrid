import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Box = styled.div`
  touch-action: none;
`;

class TouchListener extends Component {
  static propTypes = {
    elem: PropTypes.element
  };
  state = {
    event: "none",
    pageX: 0,
    pageY: 0
  };
  componentDidMount() {
    window.addEventListener("touchmove", e => {
      e.preventDefault();
      e.stopPropagation();
    });
  }
  componentWillUnmount() {
    window.removeEventListener("touchmove", e => {
      e.preventDefault();
      e.stopPropagation();
    });
  }
  onTouchStart = e => {
    e.preventDefault();
    this.setState({ event: "start" });
  };
  onTouchEnd = e => {
    e.preventDefault();
    this.setState({ event: "end" });
  };
  onTouchMove = e => {
    const { pageX, pageY } = e.touches[0];
    e.preventDefault();
    this.setState({ event: "move", pageX, pageY });
  };
  render() {
    return (
      <Box
        onTouchStart={this.onTouchStart}
        onTouchEnd={this.onTouchEnd}
        onTouchMove={this.onTouchMove}
      >
        <p>event: {this.state.event}</p>
        <p>pageX: {this.state.pageX}</p>
        <p>pageY: {this.state.pageY}</p>
        {this.props.children}
      </Box>
    );
  }
}

export default TouchListener;
