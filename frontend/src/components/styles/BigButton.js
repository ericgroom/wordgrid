import styled from "styled-components";

const BigButton = styled.button`
  font-size: 2rem;
  border: none;
  padding: 1rem;
  background-color: #2756c3;
  color: white;
  border-radius: 0.2rem;
  box-shadow: 4px 4px #0a2e82;
  &:hover {
    color: #ddd;
  }
  &:focus {
    outline: 0;
  }
  &:disabled {
    background-color: #999;
    box-shadow: 4px 4px #222;
    color: #eee;
  }
`;

export default BigButton;
