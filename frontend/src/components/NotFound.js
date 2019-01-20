import React from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { faHome, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";
import BigButton from "./styles/BigButton";

const Wrapper = styled.div`
  text-align: center;
  button {
    padding: 1rem;
    font-size: 1.2rem;
    margin: 1rem;
    border: none;
    box-shadow: 2px 2px 5px 2px gray;
    .icon {
      margin-right: 0.3rem;
    }
  }
`;

class NotFound extends React.Component {
  goHome = () => {
    this.props.history.push("/");
  };
  goBack = () => {
    this.props.history.goBack();
  };
  render() {
    return (
      <Wrapper className="404">
        <h1>404 Page not found:</h1>
        <p>{this.props.location.pathname}</p>
        <BigButton onClick={this.goBack}>
          <FA icon={faArrowLeft} className="icon" />
          Go Back
        </BigButton>
        <BigButton onClick={this.goHome}>
          <FA icon={faHome} className="icon" />
          Go Home
        </BigButton>
      </Wrapper>
    );
  }
}

export default withRouter(NotFound);
