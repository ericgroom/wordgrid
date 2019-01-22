import styled from "styled-components/macro";

const Form = styled.form`
  fieldset {
    border: none;
    label {
      input {
        padding: 0.5rem;
        margin-left: 1rem;
        font-size: 1rem;
      }
    }
    button {
      padding: 0.5rem;
      border: none;
      background-color: ${props => props.theme.darkBlue};
      color: white;
      font-size: 1rem;
    }
  }

  .success {
    color: green;
  }

  .row {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    input {
      flex-grow: 2;
    }
    button {
      align-self: stretch;
    }
  }
`;

export default Form;
