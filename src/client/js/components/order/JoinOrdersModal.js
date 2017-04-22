import React from "react";
import {Modal, ModalHeader, ModalFooter, ModalBody, Button, Table } from "reactstrap"
import { inject, observer } from "mobx-react"
import { find } from "lodash"

import Toast from "../Toast"

@inject('orderStore')
@observer
export default class PayOrderModal extends React.Component {
  constructor(){
    super();
    this.state = {
      toggle: false,
      orders: [],
      errorMessage: undefined,
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    const order = this.props.orderStore.getOrder(this.props._id)
    const orders = this.props.orderStore.orders.filter(o => o.table == order.table && o._id != order._id).map(o => { return { selected: true, name: o.name, _id: o._id }})

    this.setState({
      toggle: !this.state.toggle,
      orders: orders,
      errorMessage: undefined
    });
  }

  toggleDish(o){
      return () => {
        o.selected = !o.selected
        this.setState({
          orders: this.state.orders
        })
      }
  }

  joinOrders(){
    const ordersToJoin = this.state.orders.filter(o => o.selected)

    const order = this.props.orderStore.getOrder(this.props._id)
    const allDishes = order.dishes

    const allOrderDishes = this.props.orderStore.getOrdersByIds(ordersToJoin.map(o => o._id)).map(o => o.dishes)

    allOrderDishes.forEach(dishes => dishes.forEach( d => {
      const existingDish = find(allDishes, {id: d.id})
      if (existingDish){
        existingDish.quantity += d.quantity
      }
      else{
        allDishes.push(d)
      }
    }))

    this.props.orderStore.updateOrder(order, () => {
      //TODO:: DO a proper Check if everything was actually deleted.
      ordersToJoin.forEach( o => this.props.orderStore.deleteOrder(o._id, () => {}, ()=> {}))
      this.toggle()
    }, (e) => { this.setState({errorMessage: e.message}) })
  }

  render() {
    const joinOrders = this.joinOrders.bind(this)

    const rows = this.state.orders.map( o =>
      <tr key={o._id}>

        <th><input type="checkbox" onChange={this.toggleDish(o).bind(this)} checked={o.selected}/></th>
        <th>{o.name}</th>
      </tr>)

    return (
      <div class="join-order-modal">
        <Toast message={this.state.errorMessage} title="Error" />
        <i class="fa fa-compress fa-2x float-right white" onClick={this.toggle}></i>
        <Modal isOpen={this.state.toggle} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Join Orders</ModalHeader>
          <ModalBody>
            <Table>
              <thead>
                <tr>
                  <th/>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                { rows }
              </tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={joinOrders}>Join</Button>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
