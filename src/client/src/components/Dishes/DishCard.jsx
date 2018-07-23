import React, { Component } from 'react';
import { Elevation } from 'rmwc/Elevation'; 
import {
  Toolbar,
  ToolbarRow,
  ToolbarSection,
  ToolbarTitle
} from 'rmwc/Toolbar';
import {
  List
} from 'rmwc/List';
import DishDialog from './DishesDialog';

export default class DishCard extends Component {
  render(){
    return (
      <Elevation className="main-elevation" z={24} style={{margin: "1rem"}}>
        <Toolbar>
          <ToolbarRow>
            <ToolbarSection alignStart>
              <ToolbarTitle>{this.props.typeName}</ToolbarTitle>
            </ToolbarSection>
          </ToolbarRow>
        </Toolbar>
        <List twoLine>
          {this.props.dishes.map(d => 
            <DishDialog key={d._id} {...d} dishTypes={this.props.dishTypes}/>
          )}
        </List>
      </Elevation>
    )
  }
}