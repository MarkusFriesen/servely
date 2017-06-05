import React from "react";
import { Card, CardTitle, CardText, Checkbox } from 'react-mdl';
import { inject, observer } from "mobx-react"

@inject('orderStore')
@observer
export default class OrderSettingsCard extends React.Component {

  toggleKitchenMode(){
    this.props.orderStore.setKitchenMode(!this.props.orderStore.kitchenMode)
  }

  render(){
    return (
      <Card shadow={2}>
        <CardTitle>Order Settings</CardTitle>
        <CardText>
          <Checkbox label="Kitchen Mode" ripple  onChange={this.toggleKitchenMode.bind(this)} checked={this.props.orderStore.kitchenMode} />
        </CardText>
      </Card>
    )
  }
}