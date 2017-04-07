import React from "react";
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, Input } from "reactstrap"
import { IndexLink, Link } from "react-router";
import { LinkContainer } from 'react-router-bootstrap';
import { inject } from "mobx-react"

@inject("orderStore")
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

  handleSearch(e){
    this.props.orderStore.filter = e.target.value
  }

  render() {
    return (
      <Navbar inverse toggleable fixed="top" color="primary">
        <NavbarToggler right onClick={this.toggle} />
        <NavbarBrand>
          <Link to="/orders" >
            <img src="assets/img/logo.png" width="40px"/>
          </Link>
          <Input name="search" id="searchText" placeholder="Search" onChange={ this.handleSearch.bind(this) } />
        </NavbarBrand>
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <Link to="/orders" class='nav-link' onClick={this.toggle}>Orders</Link>
            </NavItem>
            <NavItem>
              <Link to="/dishes" class='nav-link' onClick={this.toggle}>Dishes</Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}
