import styled from "styled-components";
import ListContainer from "./ListContainer";

const List = styled(ListContainer)`
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
