import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";

const Wrapper = styled.div`
  font-size: 1.2rem;
  white-space: nowrap;
  input {
    padding: 1.5rem;
    font-weight: 600;
    border: none;
    width: 60%;
  }
  button {
    border: none;
    padding: 1.5rem;
    background-color: lightgray;
    color: #222;
  }
`;

/**
 * Displays a url that is easy for the user to copy.
 */
class CopyableLink extends React.Component {
  static propTypes = {
    /** The url to display to the user */
    url: PropTypes.string.isRequired
  };
  input = React.createRef();
  copyUrl = () => {
    this.input.current.select();
    document.execCommand("copy");
  };
  render() {
    const { url } = this.props;
    return (
      <Wrapper>
        <input type="url" readOnly value={url} ref={this.input} />
        <button title="Copy link" onClick={this.copyUrl}>
          <FA icon={faCopy} />
        </button>
      </Wrapper>
    );
  }
}

export default CopyableLink;
