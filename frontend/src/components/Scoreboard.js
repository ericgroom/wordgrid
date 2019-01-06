import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import posed, { PoseGroup } from "react-pose";
import ListContainer from "./styles/ListContainer";

const Li = posed.li();

const OrderedList = styled.ol`
  margin: 0;
  padding-left: 1rem;
  text-align: center;
`;

const Scoreboard = ({ users }) => (
  <aside>
    <ListContainer>
      <OrderedList>
        <PoseGroup>
          {users &&
            users.map(user => (
              <Li key={user.id}>
                <p>
                  {user.nickname} &ndash; {user.score}
                </p>
              </Li>
            ))}
        </PoseGroup>
      </OrderedList>
    </ListContainer>
  </aside>
);

Scoreboard.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      nickname: PropTypes.string,
      id: PropTypes.number,
      score: PropTypes.number
    })
  )
};

export default Scoreboard;
