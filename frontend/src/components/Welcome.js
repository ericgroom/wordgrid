import React from "react";
import styled from "styled-components";
import CreateGameButton from "./CreateGameButton";

const Wrapper = styled.div`
  text-align: center;
  font-family: sans-serif;
  margin-top: 10%;
  color: #444;
`;

const Welcome = () => (
  <Wrapper>
    <h1>Welcome to WordGrid!</h1>
    <CreateGameButton />
  </Wrapper>
);

export default Welcome;
