import React from "react";
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap"
import { IndexLink, Link } from "react-router";
import { LinkContainer } from 'react-router-bootstrap';

export default class Navigation extends React.Component {
  constructor() {
    super()

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <Navbar inverse toggleable fixed="top" color="primary">
        <NavbarToggler right onClick={this.toggle} />
        <NavbarBrand href="/">OrderMe</NavbarBrand>
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <Link to="/orders" class='nav-link'>Orders</Link>
            </NavItem>
            <NavItem>
              <Link to="/dishes" class='nav-link'>Dishes</Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}
