import React from "react"
import {Grid, Cell } from "react-mdl"

import DishTypeSettingsCard from "../components/settings/DishTypeSettingsCard"
import OrderSettingsCard from "../components/settings/OrderSettingsCard"

export default class Settings extends React.Component {
  render() {
    return (
      <Grid className="settings">
        <Cell col={12}>
          <OrderSettingsCard />
          <DishTypeSettingsCard />
        </Cell>
      </Grid>)
  }
}