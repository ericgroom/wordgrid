import React from "react";
import PropTypes from "prop-types";

class Timer extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    onTimerEnd: PropTypes.func,
    duration: PropTypes.number
  };
  state = {
    remaining: 0,
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
    clearInterval(this.intervalId);
  }
  render() {
    return this.props.children(this.state.remaining);
  }
}

export default Timer;
