import React from "react";

class MouseListener extends React.Component {
  componentDidMount() {
    document.addEventListener("mouseup", this.props.onMouseUp);
  }
  componentWillUnmount() {
    document.removeEventListener("mouseup", this.props.onMouseUp);
  }
  render() {
    return this.props.children;
  }
}

export default MouseListener;
