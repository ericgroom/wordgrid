import React from "react";
import styled from "styled-components";
import CreateGameButton from "./CreateGameButton";
import Spinner from "./styles/Spinner";

const Wrapper = styled.div`
  text-align: center;
  font-family: sans-serif;
  margin-top: 10%;
  color: #444;
`;

const Welcome = ({ loading }) => (
  <Wrapper>
    <h1>Welcome to WordGrid!</h1>
    <CreateGameButton disabled={loading} />
    {loading && <Spinner />}
  </Wrapper>
);

export default Welcome;
