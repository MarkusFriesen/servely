import React, { Component } from 'react';
import { Elevation } from '@rmwc/elevation'; 
import {
  Toolbar,
  ToolbarRow,
  ToolbarSection,
  ToolbarTitle
} from '@rmwc/toolbar';
import {
  List
} from '@rmwc/list';
import DishDialog from './DishDialog';

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