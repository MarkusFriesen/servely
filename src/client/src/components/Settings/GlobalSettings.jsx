import React, { Component } from 'react'
import { observer, inject } from "mobx-react"
import {
  List,
  ListItem, 
  ListItemGraphic,
  ListItemText
} from 'rmwc/List';
import {
  Toolbar,
  ToolbarRow,
  ToolbarSection,
  ToolbarTitle
} from 'rmwc/Toolbar';

class GlobalSettings extends Component {
  render(){
    return(
      <React.Fragment>
        <Toolbar>
          <ToolbarRow>
            <ToolbarSection alignStart>
              <ToolbarTitle>Global Settings</ToolbarTitle>
            </ToolbarSection>
          </ToolbarRow>
        </Toolbar>
        
        <List>
          <ListItem onClick={() => this.props.store.kitchenMode = !this.props.store.kitchenMode}>
            <ListItemGraphic>{this.props.store.kitchenMode ? "radio_button_checked" : "radio_button_unchecked"}</ListItemGraphic>
            <ListItemText>Kitchen Mode</ListItemText>
          </ListItem>
        </List>
        </React.Fragment>
    )
  }
}

export default inject("store")(observer(GlobalSettings))