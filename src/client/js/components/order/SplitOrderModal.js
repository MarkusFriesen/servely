import React from "react";
import { map, first, findIndex, remove, update } from "lodash";
import { Modal, ModalHeader, ModalBody, ModalFooter, Input, Name, Label, Button, Table, CardLink } from "reactstrap"
import { inject, observer } from "mobx-react"
import { toJSON } from "mobx"

@inject('orderStore')
@inject('dishStore')
@observer
export default class SplitOrderModal extends React.Component {
  constructor(){
    super();
    this.state = {
        name: "",
        newDishes: [],
        order: undefined,
        oldDishes: [],
        modal: false
      }
  }

  componentWillMount(){
    const order = this.props.orderStore.getOrder(this.props._id)

    this.setState({ newDishes: order.dishes.map(d => {return ({id: d.id, quantity: 0})}),
                    oldDishes: order.dishes,
                    order: order })
  }

  removeDish(dish){
    return () => {
      const dishes = this.state.newDishes
      const i = findIndex(dishes, { id: dish.id })
      if (i > -1){
        const quantity = dishes[i].quantity
        if (quantity > 0)
          dishes[i].quantity -= 1
        this.setState(dishes: dishes)
      }
    }
  }

  addDish(dish){
    return () => {
      const dishes = this.state.newDishes
      const oldDishes = this.state.order.dishes

      const i = findIndex(dishes, { id: dish.id })

      if (i > -1){
        const quantity = dishes[i].quantity
        const oldQuantity = oldDishes[i].quantity
        if (quantity < oldQuantity)
          dishes[i].quantity += 1
        this.setState(dishes: dishes)
      }
    }
  }

  splitOrder(){

    this.props.orderStore.createOrder(
      {
        table: this.state.order.table,
        name: this.state.name,
        dishes: this.state.newDishes.filter(d => d.quantity > 0),
        notes: this.state.order.notes,
        made: this.state.order.made
      }, () =>
      {
        const dishes = this.state.order.dishes.map(d => Object.assign({}, d))
        dishes.forEach((d, i) => {
          update(d, 'quantity', q => q - this.state.newDishes[i].quantity)
        })
        remove(dishes, d => d.quantity <= 0)

        this.props.orderStore.updateOrder(
          {
            _id: this.props._id,
            table: this.state.order.table,
            name: this.state.order.name,
            dishes: dishes,
            made: this.state.order.made,
            hasPayed: this.state.order.hasPayed,
            amountPayed: this.state.order.amountPayed,
            notes: this.state.order.notes
          },
          () => this.toggle(),
          (err) => console.error(err))
          //TODO: rollback on fail!
      },
      (err) => console.error("Split Failed: ", err))
  }

  open(){
    this.setState({
      modal: true,
    })
  }

  toggle(){
    this.setState({
      modal: !this.state.modal
    })
  }

  handleName(e){
    this.setState({ name: e.target.value })
  }

  render(){
    const toggle = this.toggle.bind(this)

    const allDishes = this.props.dishStore.dishes

    const selectedDishes = this.state.newDishes.map((d, i) => {
      const id = findIndex(allDishes, {"_id" : d.id})
      if (id > -1){
        return (
          <tr key={i}><td>{d.quantity}</td><td class="quantityChange"> <Button class="remove-dish" onClick={this.removeDish(d).bind(this)}>-</Button><Button class="add-dish" onClick={this.addDish(d).bind(this)}>+</Button></td><td>{allDishes[id].name}</td></tr>
        )
      }
      return;
    })

    return (
      <div>
        <CardLink class='card-link float-right' onClick={this.open.bind(this)}><i class="fa fa-chain-broken fa-2x"></i></CardLink>
        <Modal isOpen={this.state.modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Split Order</ModalHeader>
          <ModalBody>
            <Label>Name
              <Input type="text" name="Name" placeholder="Customer name" value={this.state.name} onChange={this.handleName.bind(this)} />
            </Label>
            <div class="dishes">
              <Table responsive>
                <thead>
                  <tr>
                    <th class="quantity">Quantity</th>
                    <th class="quantityChange"></th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  { selectedDishes }
                </tbody>
              </Table>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={ this.splitOrder.bind(this)}>Split Order</Button>
            <Button color="secondary" onClick={ toggle }>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )

  }
}
