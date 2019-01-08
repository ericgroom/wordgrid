import React from "react";
import PropTypes from "prop-types";

/**
 * Listens for a touchend event and calls props.onTouchEnd
 */
class TouchListener extends React.Component {
  static propTypes = {
    /** called when a touchend event is detected */
    onTouchEnd: PropTypes.func.isRequired
  };
  state = {
    touchActive: false
  };
  componentDidMount() {
    document.addEventListener("touchmove", this.handleTouchMove, {
      passive: false
    });
  }
  componentWillUnmount() {
    document.removeEventListener("touchmove", this.handleTouchMove, {
      passive: false
    });
  }
  /**
   * Prevent scrolling if there is a current touch being tracked
   */
  handleTouchMove = e => {
    if (this.state.touchActive) {
      e.preventDefault();
    }
  };
  handleTouchStart = e => {
    e.preventDefault();
    this.setState({ touchActive: true });
  };
  handleTouchEnd = e => {
    e.preventDefault();
    this.setState({ touchActive: false });
    this.props.onTouchEnd(e);
  };
  render() {
    return (
      <div
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        /* Prevent <TouchListener /> from absorbing events */
        style={{ pointerEvents: "none" }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default TouchListener;
