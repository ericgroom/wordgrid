import React from "react";

class MouseListener extends React.Component {
  componentDidMount() {
    document.addEventListener("pointerup", this.props.onPointerUp);
  }
  componentWillUnmount() {
    document.removeEventListener("pointerup", this.props.onPointerUp);
  }
  render() {
    return this.props.children;
  }
}

export default MouseListener;