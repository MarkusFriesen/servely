import React, { Component } from 'react'
import { observer, inject } from "mobx-react"

import { Checkbox } from 'rmwc/Checkbox';
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

        <Checkbox
          checked={this.props.store.kitchenMode}
          onChange={evt => this.props.store.kitchenMode = evt.target.checked}>
          Kitchen Mode
            </Checkbox>
        </React.Fragment>
    )
  }
}

export default inject("store")(observer(GlobalSettings))