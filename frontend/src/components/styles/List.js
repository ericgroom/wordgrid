import styled from "styled-components";

const List = styled.div`
  background-color: #fff;
  /* border-radius: 1rem; */
  box-shadow: 0px 4px 6px 0 lightgray;
  border-top: 4px solid darkgreen;
  padding: 1rem;
  text-align: center;
  margin-bottom: 2rem;
  h2 {
    color: rgba(0, 0, 0, 0.7);
  }
  ul {
    padding-left: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(4rem, 1fr));
    gap: 1rem;
    justify-items: center;
    list-style: none;
  }
`;

export default List;
