import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Header = styled.header`
  padding: 1rem; 0.5rem;
  background-color: #444;
  a,
  a:visited {
    text-decoration: none;
    color: rgba(255, 255, 255, 0.9);
  }
  h1 {
    margin: 0;
  }
`;

const Nav = () => (
  <Header>
    <Link to="/">
      <h1>WordGrid</h1>
    </Link>
  </Header>
);

export default Nav;
