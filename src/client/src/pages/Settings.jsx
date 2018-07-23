import React, { Component } from 'react'

import { Elevation } from 'rmwc/Elevation';
import { Grid, GridCell } from 'rmwc/Grid';

import GlobalSettings from '../components/Settings/GlobalSettings'
import DishTypes from '../components/Settings/DishTypes'

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