import React from "react";
import styled from "styled-components";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";

const Wrapper = styled.footer`
  background-color: #222;
  color: white;
  width: 100%;
  margin: 0;
  margin-bottom: -6rem;
  padding: 0.5rem;
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  justify-content: center;
  align-items: center;
  .item {
    margin: 0 0.5rem;
  }
  .icon {
    margin-right: 0.2rem;
  }
  a {
    padding: 0.2rem;
    border-radius: 0.2rem;
  }
  a:hover {
    background-color: #555;
    transition: background-color 0.2s ease-in;
  }
`;

const Footer = () => (
  <Wrapper>
    <p className="item">Created by Eric Groom</p>
    <a href="https://www.github.com/ericgroom/wordgrid" className="item">
      <FA icon={faGithub} className="icon" />
      Source
    </a>
  </Wrapper>
);

export default Footer;
