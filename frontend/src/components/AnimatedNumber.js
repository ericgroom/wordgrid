import React from "react";
import PropTypes from "prop-types";
import { tween } from "popmotion";

/**
 * "Animates" a number by counting up or down from the previous number passed
 * to this component. This component returns a span.
 */
class AnimatedNumber extends React.Component {
  static propTypes = {
    /** The number to be displayed */
    num: PropTypes.number.isRequired,
    /** The duration it takes to transition between two numbers in ms */
    duration: PropTypes.number
  };
  static defaultProps = {
    duration: 500
  };
  state = {
    num: 0
  };
  action = null;
  componentDidMount() {
    if (this.props.num !== this.state.num) {
      this.animate();
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.num !== this.props.num) {
      this.animate();
    }
  }
  /**
   * Starts a new animation from the previous number passed or the number reached
   * by a currently in-progress animation. Also cancels any animation in-progress.
   */
  animate = () => {
    if (this.action) {
      this.action.stop();
    }
    this.action = tween({
      from: this.state.num,
      to: this.props.num,
      duration: this.props.duration || 500
    }).start(v => this.setState({ num: Math.round(v) }));
  };
  render() {
    return <span>{this.state.num}</span>;
  }
}

export default AnimatedNumber;
