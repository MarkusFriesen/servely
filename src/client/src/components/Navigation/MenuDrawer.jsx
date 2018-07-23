import React, { Component } from 'react';
import {
  Drawer,
  DrawerHeader,
  DrawerContent
} from 'rmwc/Drawer';
import {
  TopAppBarNavigationIcon,
} from 'rmwc/TopAppBar';
import {
  List,
  ListItemGraphic,
  ListItem,
  ListItemText
} from 'rmwc/List';
import { Link } from 'react-router-dom'


export default class MenuDrawer extends Component{
  constructor(props){
    super(props)
    this.state = {
      "tempOpen": false
    }

    this.onClick = this.onClick.bind(this)
  }

  onClick(){
    this.setState({ tempOpen: !this.state.tempOpen })
  }
  
  render(){
    const {onClick } = this
    return (
      <React.Fragment>
        <Drawer
          temporary
          open={this.state.tempOpen}
          onClose={() => this.setState({ tempOpen: false })}
        >
          <DrawerHeader>
            Menu
          </DrawerHeader>
          <DrawerContent>
            <List>
              <Link to="/orders">
                <ListItem onClick={onClick}>
                  <ListItemGraphic>shopping_cart</ListItemGraphic>
                  <ListItemText>Orders</ListItemText>
                </ListItem>
              </Link>
              <Link to="/orderHistory">
              <ListItem onClick={onClick}>
                <ListItemGraphic>history</ListItemGraphic>
                <ListItemText>History</ListItemText>
                </ListItem>
              </Link>
              <Link to="/dishes">
              <ListItem onClick={onClick}>
                <ListItemGraphic>shopping_basket</ListItemGraphic>
                <ListItemText>Dishes</ListItemText>
                </ListItem>
              </Link>
              <Link to="/settings">
              <ListItem onClick={onClick}>
                <ListItemGraphic>settings</ListItemGraphic>  
                <ListItemText>Settings</ListItemText>
                </ListItem>
              </Link>
            </List>
          </DrawerContent>
        </Drawer>

        <TopAppBarNavigationIcon use="menu" onClick={onClick}/>

      </React.Fragment>
  )
  }
  
}
