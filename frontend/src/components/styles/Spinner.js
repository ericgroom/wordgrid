import styled from "styled-components";

const Spinner = styled.div`
  width: 30px;
  height: 30px;
  margin: 1rem auto;
  border: 3px solid #ddd;
  border-top: 5px solid #222;
  border-radius: 50%;
  animation: spin 2s linear infinite;
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export default Spinner;
