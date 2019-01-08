import React from "react";
import PropTypes from "prop-types";

/**
 * Render props component that counts down from a give time and passes
 * the remaining duration to children in seconds. If a new duration is passed, the timer will restart
 * at the new time.
 */
class Timer extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    /** duration to count down from */
    duration: PropTypes.number
  };
  state = {
    remaining: this.props.duration || 0,
    intervalId: null
  };
  setup = () => {
    const intervalId = setInterval(() => {
      this.setState(({ remaining: pRemaining }) => ({
        remaining: pRemaining > 0 ? pRemaining - 1 : pRemaining
      }));
    }, 1000);
    this.setState({ remaining: this.props.duration, intervalId });
  };
  componentDidUpdate(prevProps) {
    if (prevProps.duration !== this.props.duration) {
      if (this.state.intervalId) {
        clearInterval(this.state.intervalId);
      }
      this.setup();
    }
  }
  componentDidMount() {
    this.setup();
  }
  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }
  render() {
    return this.props.children(this.state.remaining);
  }
}

export default Timer;
