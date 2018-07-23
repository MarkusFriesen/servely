import React, { Component } from 'react'
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarActionItem,
  TopAppBarTitle
} from 'rmwc/TopAppBar';

import MenuDrawer from "./MenuDrawer"
import { inject, observer } from "mobx-react"

class Nav extends Component {
  constructor(props){
    super(props)
    this.state = {
      searching: false,
      searchText: ""
    }

    this.toggleSearch = this.toggleSearch.bind(this)
    this.handleSearchText = this.handleSearchText.bind(this)
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
    const { toggleSearch } = this 
    if (this.state.searching)
      return (
        <TopAppBar className="mdc-top-app-bar--fixed-scrolled app__searchHeader" dense fixed>
          <TopAppBarRow>
            <TopAppBarSection alignStart>
              <input placeholder="Search" autoFocus value={this.state.searchText} onChange={this.handleSearchText()}/>
            </TopAppBarSection>          
            <TopAppBarSection alignEnd>
              <TopAppBarActionItem aria-label="Search" alt="Search this Page" onClick={toggleSearch}>
                clear
            </TopAppBarActionItem>
            </TopAppBarSection>
          </TopAppBarRow>
       </TopAppBar>
      )

    return (
      <TopAppBar className="mdc-top-app-bar--fixed-scrolled" dense fixed>
        <TopAppBarRow>
          <TopAppBarSection alignStart>
            <MenuDrawer />
            <TopAppBarTitle>{this.props.store.kitchenMode ? "BIt's Kitchen" : "BIt"}</TopAppBarTitle>
          </TopAppBarSection>
          <TopAppBarSection alignEnd>
            <TopAppBarActionItem aria-label="Search" alt="Search this Page" onClick={toggleSearch}>
              search
            </TopAppBarActionItem>
          </TopAppBarSection>
        </TopAppBarRow>
      </TopAppBar>
    );
  }
}

export default inject("store")(observer(Nav))