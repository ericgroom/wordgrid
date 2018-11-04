import React, { Component } from 'react'
import styled from 'styled-components'
import Tile from './Tile'


const Grid = styled.ul`
    display: grid;
    grid-template-columns: repeat(4, 4rem);
    grid-template-rows: repeat(4, 4rem);
    row-gap: 1rem;
    column-gap: 1rem;
`;

export default class WordGrid extends Component {
  handleMouseDown(index) {
    console.log(`mouseDown ${index}`);
  }
  handleMouseUp(index) {
    console.log(`mouseUp ${index}`);
  }
  render() {
    return (
      <div>
        <Grid>
        { this.props.letters.map((letter, index) => (
            
              <Tile 
              letter={letter} 
              onMouseDown={() => this.handleMouseDown(index)} 
              onMouseUp={() => this.handleMouseUp(index)}
              key={`${index}${letter}`} />
            
        ))}
        </Grid>
      </div>
    )
  }
}
