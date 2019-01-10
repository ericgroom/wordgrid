import React from "react";
import PropTypes from "prop-types";

/**
 * Listens for pointerup event and calls props.onPointerUp
 */
class PointerListener extends React.Component {
  static propTypes = {
    onPointerUp: PropTypes.func.isRequired
  };
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

export default PointerListener;
