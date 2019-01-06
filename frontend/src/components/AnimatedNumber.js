import React from "react";
import { tween } from "popmotion";

class AnimatedNumber extends React.Component {
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
    return (
      <span from={0} to={1000}>
        {this.state.num}
      </span>
    );
  }
}

export default AnimatedNumber;
