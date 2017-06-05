import React from "react"
import { inject, observer } from "mobx-react"
import { FABButton, Icon } from "react-mdl"
import { Link } from 'react-router-dom'

import OrderCard from "../components/order/OrderCard"

@inject('orderStore')
@observer
export default class Orders extends React.Component {
  render() {
    const orders = this.props.orderStore.filteredOrders.map((order, i) => <OrderCard key={order._id} {...order}/>)
    return (
      <div class="orders masonry-layout">
        { orders }
        
        <Link to="/orderDetails">
          <FABButton colored ripple raised id="add-order">
              <Icon name="add" />
            </FABButton>
        </Link>
      </div>)
  }
}