import React, { Component } from 'react'

import { Elevation } from '@rmwc/elevation';
import { Grid, GridCell } from '@rmwc/grid';

import GlobalSettings from '../components/settings/GlobalSettings'
import DishTypes from '../components/settings/DishTypes'

export default class Settings extends Component {
  render(){
    return(
      <Grid>
        <GridCell span="12">
          <Elevation className="main-elevation" z={24}>
            <GlobalSettings />

          </Elevation>
        </GridCell>
        <GridCell span="12">
          <Elevation className="main-elevation" z={24}>
            <DishTypes />
          </Elevation>
        </GridCell>
      </Grid>
    )
  }
}