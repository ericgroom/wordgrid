import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const ErrorWrapper = styled.div`
  text-align: center;
  margin: 1rem;
  .red {
    color: red;
  }
`;
class ErrorBoundry extends React.Component {
  state = {
    error: "",
    hasError: false
  };
  static getDerivedStateFromError(error) {
    if (typeof error !== "string") {
      error = error.toString();
    }
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.log("error in boundry: ", error, "info: ", info);
  }
  dismiss = () => {
    this.setState({ error: "", hasError: false });
  };
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

export default ErrorBoundry;
