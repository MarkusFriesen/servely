import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarActionItem,
  TopAppBarTitle,
  TopAppBarNavigationIcon
} from '@rmwc/top-app-bar'
import {
  List,
  ListItemGraphic,
  ListItem,
  ListItemText
} from '@rmwc/list';
import {
  Drawer,
  DrawerHeader,
  DrawerContent,
  DrawerTitle
} from '@rmwc/drawer';
import {
  Link
} from 'react-router-dom'

import './Nav.css'

class Nav extends Component {
  constructor(props){
    super(props)
    this.state = {
      searching: false,
      searchText: "",
      modalOpen: false
    }

    this.toggleSearch = this.toggleSearch.bind(this)
    this.handleSearchText = this.handleSearchText.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  
  onClick(){
    this.setState({ modalOpen: !this.state.modalOpen })
  }
  handleSearchText(){
    return (e)=>{
      this.setState({
        searchText: e.target.value
      })
      this.props.store.searchText = e.target.value
    }
  }

  toggleSearch(){
    this.setState({ searching: !this.state.searching, searchText: "" })
    this.props.store.searchText = ""
  }

  render(){
    const { toggleSearch, onClick } = this 
    if (this.state.searching)
      return (
        <TopAppBar dense fixed>
          <TopAppBarRow>
            <TopAppBarSection className="search-field" alignStart>
              <input placeholder="Search" autoFocus value={this.state.searchText} onChange={this.handleSearchText()}/>
              <TopAppBarActionItem aria-label="Search" icon="clear" alt="Search this Page" onClick={toggleSearch}/>
            </TopAppBarSection>          
          </TopAppBarRow>
       </TopAppBar>
      )

    return (
      <React.Fragment>
        <TopAppBar dense fixed className="no-print">
          <TopAppBarRow>
            <TopAppBarSection alignStart>
              <TopAppBarNavigationIcon icon="menu" onClick={onClick}/>
              <TopAppBarTitle>{this.props.store.kitchenMode ? "BIt's Kitchen" : "BIt"}</TopAppBarTitle>
            </TopAppBarSection>
            <TopAppBarSection alignEnd>
              <TopAppBarActionItem aria-label="Search" icon="search" alt="Search this Page" onClick={toggleSearch}/>
            </TopAppBarSection>
          </TopAppBarRow>
        </TopAppBar>

        <Drawer
            modal
            open={this.state.modalOpen}
            onClose={() => this.setState({ modalOpen: false })}
          >
            <DrawerHeader>
              <DrawerTitle>Menu</DrawerTitle>
            </DrawerHeader>
            <DrawerContent>
              <List>
                <Link to="/orders">
                  <ListItem onClick={onClick}>
                    <ListItemGraphic icon="shopping_cart" />
                    <ListItemText>Orders</ListItemText>
                  </ListItem>
                </Link>
                <Link to="/orderHistory">
                <ListItem onClick={onClick}>
                  <ListItemGraphic icon="history"/>
                  <ListItemText>History</ListItemText>
                  </ListItem>
                </Link>
                <Link to="/dishes">
                <ListItem onClick={onClick}>
                  <ListItemGraphic icon = "shopping_basket" />
                  <ListItemText>Dishes</ListItemText>
                  </ListItem>
                </Link>
                <Link to="/dishExtra">
                <ListItem onClick={onClick}>
                  <ListItemGraphic icon = "loyalty" />
                  <ListItemText>Extras</ListItemText>
                  </ListItem>
                </Link>
                <Link to="/settings">
                <ListItem onClick={onClick}>
                  <ListItemGraphic icon="settings" />  
                  <ListItemText>Settings</ListItemText>
                  </ListItem>
                </Link>
              </List>
            </DrawerContent>
          </Drawer>
      </React.Fragment>

    );
  }
}

export default inject("store")(observer(Nav))