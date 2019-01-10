import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";
import Settings from "./Settings";

const Header = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #444;
  a,
  a:visited {
    text-decoration: none;
    color: rgba(255, 255, 255, 0.9);
  }
  h1 {
    margin: 0;
  }

  button {
    background: none;
    border: none;
    color: #eee;
    font-size: 1.5rem;
    cursor: pointer;
  }
`;

class Nav extends React.Component {
  state = {
    showSettings: false
  };
  toggleSettings = () => {
    this.setState(prevState => ({ showSettings: !prevState.showSettings }));
  };
  render() {
    return (
      <Header>
        <Link to="/">
          <h1>WordGrid</h1>
        </Link>
        <button
          onClick={this.toggleSettings}
          name="settings"
          aria-label="open settings"
        >
          <FA icon={faCog} />
        </button>
        <Modal
          show={this.state.showSettings}
          title="Settings"
          onClose={this.toggleSettings}
        >
          <Settings />
        </Modal>
      </Header>
    );
  }
}

export default Nav;
