import React from "react";
import { map, first, findIndex } from "lodash";
import { Modal, ModalHeader, ModalBody, ModalFooter, Input, Name, Label, Button, Table, CardLink } from "reactstrap"
import Griddle from "griddle-react";
import { inject, observer } from "mobx-react"
import { toJSON } from "mobx"

@inject('orderStore')
@inject('dishStore')
@observer
export default class OrderModal extends React.Component {
  constructor(){
    super();

    this.setOrder = this.setOrder.bind(this)
    this.state = {
      table: 1,
      name: "",
      dishes: [],
      open: false,
      modal: false
    }
  }

  componentWillMount(){
    this.setOrder()
  }

  setOrder(){
    if (this.props.id){
      const order = this.props.orderStore.getOrder(this.props.id)

      if (order){
        this.setState({
          table: order.table,
          name: order.name,
          dishes: order.dishes.map(d => Object.assign({}, d))
        })
      }
    }
    else{
      this.setState({
        table: 1,
        name: "",
        dishes: []
      })
    }
}

  toggle(){
    this.setState({
      modal: !this.state.modal
    })

    this.setOrder()
  }

  open(){
    this.setState({
      modal: true,
    })
  }

  close(){
    this.setState({
      modal: false
    })

    this.setOrder()
  }

  addOrder(){
    this.props.orderStore.createOrder(this.state.table, this.state.name, this.state.dishes, () => { this.close() }, (e) => { console.error(e) })
  }

  updateOrder(){
    this.props.orderStore.updateOrder(this.props.id, this.state.table, this.state.name, this.state.dishes, () => { this.close() }, (e) => { console.error(e) })
  }


  handleTable(e) {
    this.setState({ table: e.target.value });
  }

  handleName(e) {
    this.setState({ name: e.target.value });
  }

  handleClick(e){
    const dishes = this.state.dishes

    const i = findIndex(this.state.dishes, { id: e.props.data._id })
    if (i > -1){
      dishes[i].quantity += 1
    }
    else {
      dishes.push({id: e.props.data._id, quantity: 1})
    }

    this.setState(dishes: dishes)
  }

  removeDish(dish){
    return () => {
      const dishes = this.state.dishes
      const i = findIndex(this.state.dishes, { id: dish.id })
      if (i > -1){
        const quantity = dishes[i].quantity
        if (quantity == 1)
          dishes.splice(i, 1)
        else
          dishes[i].quantity -= 1
        this.setState(dishes: dishes)
      }
    }
  }

  addDish(dish){
    return () => {
      const dishes = this.state.dishes
      const i = findIndex(this.state.dishes, { id: dish.id })
      if (i > -1){
          dishes[i].quantity += 1
        this.setState(dishes: dishes)
      }
    }
  }

  render() {
    const toggle = this.toggle.bind(this)
    const addOrder = this.addOrder.bind(this)

    const allDishes = this.props.dishStore.dishes

    const selectedDishes = this.state.dishes.map((d, i) => {
      const id = findIndex(allDishes, {"_id" : d.id})
      if (id > -1){
        return (
          <tr key={i}><td>{d.quantity}</td><td class="quantityChange"> <Button class="remove-dish" onClick={this.removeDish(d).bind(this)}>-</Button><Button class="add-dish" onClick={this.addDish(d).bind(this)}>+</Button></td><td>{allDishes[id].name}</td></tr>
        )
      }
      return;
    }  )

    const metadata = [
      {
        "columnName": "name",
        "order": 1,
        "visible": true,
        "displayName": "Dish Name"
      },
      {
        "columnName": "cost",
        "order": 2,
        "visible": true,
        "displayName": "Cost"
      }
    ]

    return (
      <div class="order-details">
        { !this.props.id ? <Button color="primary" class='btn-rnd' onClick={this.open.bind(this)}>+</Button> : <CardLink onClick={this.open.bind(this)}><i class="fa fa-pencil primary fa-2x"></i></CardLink> }
        <Modal isOpen={this.state.modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Order</ModalHeader>
          <ModalBody>
            <Label>Table
              <Input type="number" name="table" placeholder="Table number" value={this.state.table} onChange={this.handleTable.bind(this)} />
            </Label><br/>
            <Label>Name
              <Input type="text" name="Name" placeholder="Customer name" value={this.state.name} onChange={this.handleName.bind(this)} />
            </Label>
            <div class="dishes">
              <Griddle tableClassName={'table'} useGriddleStyles={false} results={ map(allDishes, d => { return {name: d.name, _id: d._id, cost: d.cost.toFixed(2)}}) } showFilter={true} columnMetadata={metadata} columns={["name", "cost"]} onRowClick={this.handleClick.bind(this)}/>
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
            <Button color="primary" onClick={ !this.props.id ? this.addOrder.bind(this) : this.updateOrder.bind(this)}>Save</Button>
            <Button color="secondary" onClick={this.close.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
