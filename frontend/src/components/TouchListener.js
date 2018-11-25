import React from "react";

class TouchListener extends React.Component {
  state = {
    touchActive: false
  };
  childRef = React.createRef();
  componentDidMount() {
    this.childRef.current.addEventListener("touchmove", this.handleTouchMove, {
      passive: false
    });
  }
  componentWillUnmount() {
    this.childRef.current.document.removeEventListener(
      "touchmove",
      this.handleTouchMove,
      {
        passive: false
      }
    );
  }
  handleTouchMove = e => {
    e.preventDefault();
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
        ref={this.childRef}
        style={{ pointerEvents: "none" }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default TouchListener;
