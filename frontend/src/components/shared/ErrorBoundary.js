import React from "react";
import styled from "styled-components/macro";
import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const ErrorWrapper = styled.div`
  text-align: center;
  margin: 1rem;
  .red {
    color: red;
  }
`;

/**
 * Used to catch errors in child components and display an error
 * message to users.
 */
class ErrorBoundary extends React.Component {
  state = {
    error: "",
    hasError: false
  };
  /**
   * Docs sugggest making ui changes in this method, logging should be done
   * in componentDidCatch.
   *
   * @param {Error | string} error
   */
  static getDerivedStateFromError(error) {
    if (typeof error !== "string") {
      error = error.toString();
    }
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.log("error in boundry: ", error, "info: ", info);
  }
  render() {
    const { hasError } = this.state;
    if (hasError) {
      return (
        <ErrorWrapper>
          <h1>
            <FA icon={faExclamationCircle} className="red" />
            An unknown error has occurred
          </h1>
          <p>Please refresh the page and try again</p>
        </ErrorWrapper>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
