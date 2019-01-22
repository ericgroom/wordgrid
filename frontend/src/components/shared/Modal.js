import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styled from "styled-components/macro";
import posed from "react-pose";
import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Overlay = posed.div({
  show: {
    opacity: 1,
    beforeChildren: true,
    applyAtStart: { display: "block" }
  },
  hide: {
    opacity: 0,
    applyAtEnd: { display: "none" }
  }
});

const SlideDown = posed.div({
  show: {
    y: 0,
    opacity: 1
  },
  hide: {
    y: "-4rem",
    opacity: 0
  }
});

const SlideUp = posed.div({
  show: {
    y: 0,
    opacity: 1
  },
  hide: {
    y: "100%",
    opacity: 0
  }
});

const ModalWrapper = styled(Overlay)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;
  .content {
    margin: 1rem auto;
    max-width: 600px;
    background-color: #fff;
    color: #222;
    border-radius: 0.5rem;
    height: 90%;
    width: 100%;
    overflow: hidden;
  }
  .children {
    overflow: auto;
    max-height: 100%;
    padding: 1rem;
  }
  .heading {
    /* Match contents border radius on top of gradient */
    border-radius: 0.5rem 0.5rem 0 0;
    background-image: linear-gradient(#fff, #ddd);
    padding: 0.5rem;
    h1 {
      margin: 0;
      display: inline-block;
    }
  }
  .close-button {
    cursor: pointer;
    color: red;
    margin: 0 0.5rem;
  }
`;

/**
 * Reusable Modal component.
 */
class Modal extends React.Component {
  static defaultProps = {
    title: ""
  };
  static propTypes = {
    /** will display the modal if set to true */
    show: PropTypes.bool.isRequired,
    /** title shown in the heading of the modal */
    title: PropTypes.string,
    /** called when the modal closes to update state in parent if necessary */
    onClose: PropTypes.func
  };
  modalContainer = (function() {
    const el = document.createElement("div");
    el.id = "modal";
    return el;
  })();
  componentDidMount() {
    let portalDiv = document.getElementById("portal");
    if (!portalDiv) {
      portalDiv = document.createElement("div");
      portalDiv.id = "portal";
      document.getElementsByTagName("body")[0].appendChild(portalDiv);
    }
    portalDiv.appendChild(this.modalContainer);
  }
  componentWillUnmount() {
    document.removeChild(this.modalContainer);
  }
  /**
   * Checks if the element clicked was the modal background and closes the modal if it is
   */
  handleBackgroundClick = e => {
    e.preventDefault();
    if (e.target.getAttribute("data-is-background")) {
      this.close();
    }
  };
  /**
   * Closes the modal if the escape key is pressed
   */
  handleKeyUp = e => {
    if (e.keyCode === 27) {
      this.close();
    }
  };
  /**
   * Closes modal
   */
  close = () => {
    this.props.onClose && this.props.onClose();
  };
  render() {
    const { show = false } = this.props;
    return ReactDOM.createPortal(
      <ModalWrapper
        onClick={this.handleBackgroundClick}
        data-is-background
        aria-modal
        onKeyUp={this.handleKeyUp}
        tabIndex="-1"
        aria-hidden={!show}
        show={show}
        pose={show ? "show" : "hide"}
      >
        <div className="content">
          <SlideDown className="heading">
            <FA
              icon={faTimes}
              size="2x"
              onClick={this.close}
              className="close-button"
            />
            <h1>{this.props.title}</h1>
          </SlideDown>
          <SlideUp className="children">{this.props.children}</SlideUp>
        </div>
      </ModalWrapper>,
      this.modalContainer
    );
  }
}

export default Modal;
