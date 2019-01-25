import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Wrapper = styled.ul`
  list-style: none;
  margin: 1rem;
  padding: 0.5rem;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(${props => props.size}, 4rem);
  justify-content: center;
  gap: 0.5rem;
`;

const ColorTile = styled.div`
  border-radius: 0.5rem;
  border: ${props => (props.selected ? "4px solid #0077EE" : "none")};
  background-color: ${props => props.color};
  height: 4rem;
  width: 4rem;
  box-shadow: 2px 2px 4px gray;
`;

class ColorPicker extends React.Component {
  static propTypes = {
    colors: PropTypes.arrayOf(PropTypes.string).isRequired
  };
  state = {
    selected: null
  };
  handleTileClick = index => {
    this.setState({ selected: index });
  };
  render() {
    const colors = this.props.colors;
    return (
      <Wrapper size={4}>
        {colors.map((color, index) => (
          <li>
            <ColorTile
              color={color}
              selected={index === this.state.selected}
              onClick={this.handleTileClick.bind(this, index)}
            />
          </li>
        ))}
      </Wrapper>
    );
  }
}

export default ColorPicker;
