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

import { SimpleListItem } from '@rmwc/list';

export default class DishCard extends Component {
  state = {
    device : {},
    openDialog: false
  }
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
            <SimpleListItem key={d._id} onClick={() => this.setState({device: d, openDialog: true})} text={d.name} secondaryText={`€ ${d.cost.toFixed(2)}`} metaIcon="edit" />
          )}
        </List>
        <DishDialog {...this.state.device} open={this.state.openDialog} dishTypes={this.props.dishTypes} onClose={() => {this.setState({openDialog: false})}}/>
      </Elevation>
    )
  }
}