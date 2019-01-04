import styled from "styled-components";

const Form = styled.form`
  fieldset {
    border: none;
    label {
      input {
        padding: 0.5rem;
        margin-left: 1rem;
      }
      button {
        padding: 0.5rem;
        border: none;
        background-color: ${props => props.theme.darkBlue};
        color: white;
        font-size: 1rem;
      }
    }
  }

  .success {
    color: green;
  }
`;

export default Form;