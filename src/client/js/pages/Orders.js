import React from "react"
import { observer, inject } from "mobx-react"
import { Button, Glyphicon, Row, CardColumns } from "reactstrap";

import Order from "../components/Order";
import OrderModal from "../components/order/OrderModal";

@inject('orderStore')
@observer
export default class Orders extends React.Component {
  render() {
    return (
      <div class="orders">
        <CardColumns>
          { this.props.orderStore.filteredOrders.map((order, i) => <Order key={order._id} { ...order}/>) }
        </CardColumns>
        <OrderModal ref="modal" />
      </div>)
  }
}
