import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";
import posed from "react-pose";

const SlideIn = posed.div({
  enter: {
    opacity: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    y: "-10%"
  }
});

const ErrorWrapper = styled(SlideIn)`
  background-color: #222;
  color: #eee;
  text-align: left;
  padding: 1rem;
  padding-left: 1.5rem;
  border-radius: 999rem;
  position: fixed;
  top: 2rem;
  left: 2rem;
  right: 2rem;
  margin: 1rem auto;
  max-width: 30rem;
  box-shadow: 2px 2px 3px black;
  p {
    margin: 0;
    margin-left: 1rem;
    display: inline-block;
  }
  .prefix {
    font-weight: 600;
    color: red;
  }
  .close:hover {
    color: red;
    transition: color 0.3s;
  }
`;

const Error = ({ error, dismiss }) => (
  <>
    {error && (
      <ErrorWrapper>
        <FA icon={faTimes} className="close" onClick={dismiss} />
        <p>
          <span className="prefix">Error: </span>
          {error}
        </p>
      </ErrorWrapper>
    )}
  </>
);

Error.propTypes = {
  error: PropTypes.string,
  dismiss: PropTypes.func.isRequired
};

export default Error;
