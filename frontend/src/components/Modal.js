import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import posed from "react-pose";
import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Overlay = posed.div({
  show: {
    opacity: 1,
    delayChildren: 50,
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
      margin-left: 1rem;
      display: inline-block;
    }
  }
  .close-button {
    cursor: pointer;
    color: red;
    padding: 0 0.5rem;
  }
`;

class Modal extends React.Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    title: PropTypes.string,
    close: PropTypes.func.isRequired
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
  handleClose = e => {
    e.preventDefault();
    if (e.target.getAttribute("data-is-background")) {
      this.props.close();
    }
  };
  handleKeyUp = e => {
    if (e.keyCode === 27) {
      this.props.close();
    }
  };
  render() {
    const { show = false } = this.props;
    // if (show) {
    return ReactDOM.createPortal(
      <ModalWrapper
        onClick={this.handleClose}
        data-is-background
        aria-modal
        onKeyUp={this.handleKeyUp}
        tabIndex="-1"
        show={show}
        pose={show ? "show" : "hide"}
      >
        <div className="content">
          <SlideDown className="heading">
            <FA
              icon={faTimes}
              size="2x"
              onClick={this.props.close}
              className="close-button"
            />
            <h1>{this.props.title}</h1>
          </SlideDown>
          <SlideUp className="children">{this.props.children}</SlideUp>
        </div>
      </ModalWrapper>,
      this.modalContainer
    );
    // } else {
    //   return null;
    // }
  }
}

export default Modal;
