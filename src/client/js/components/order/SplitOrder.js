import React from "react"
import { Dialog, Button, DialogTitle, DialogContent, DialogActions, DataTable, TableHeader, IconButton, Textfield } from "react-mdl"
import { inject, observer } from "mobx-react"

@inject('orderStore')
@inject('dishStore')
@observer
export default class SplitOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dishes: [],
      oldDishes: [],
      newName: ""
    };
    this.handleOpenDialog = this.handleOpenDialog.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.addDish = this.addDish.bind(this);
    this.removeDish = this.removeDish.bind(this);
    this.splitOrder = this.splitOrder.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this)
  }

  handleOpenDialog() {
    const oldDishes = this.props.orderStore.getOrder(this.props.id).dishes
    const dishes = oldDishes.map(d =>{return({id: d.id, quantity: 0})})
    this.setState({
      openDialog: true,
      dishes: dishes,
      oldDishes: oldDishes
    });
  }

  handleCloseDialog() {
    this.setState({
      openDialog: false
    });
  }

  addDish(id){
    return () => {
      const max = this.state.oldDishes.find(d => d.id == id).quantity
      const dish = this.state.dishes.find(d => d.id == id)

      if (dish.quantity === max)
        return
      dish.quantity += 1
      this.setState({dishes: this.state.dishes})
    }
  }

  removeDish(id){
    return () => {
      const dish = this.state.dishes.find(d => d.id == id)

      if (dish.quantity === 0)
        return
      dish.quantity -= 1
      this.setState({dishes: this.state.dishes})
    }
  }

  handleNameChange(e){
    this.setState({ newName: e.target.value })
  }

  splitOrder(){
    if (this.state.newName){
      const order = this.props.orderStore.getOrder(this.props.id)
      const { table, name, notes, made } = order
      
      const newDishes = []
      for (var i=0; i < this.state.dishes.length; i++){
        newDishes.push({id: this.state.dishes[i].id, quantity: this.state.oldDishes[i].quantity - this.state.dishes[i].quantity })
      }

      this.props.orderStore.add({table: table, name: this.state.newName, notes: notes, made: made, dishes: this.state.dishes.filter(d => d.quantity > 0)},
        () => {
          order.update({dishes: newDishes.filter(d => d.quantity > 0)}, 
            () => {this.handleCloseDialog()}, 
            (err) => {console.error(err)}
          )
        }, 
        (err) => { console.error(err) }
      )
    }
  }

  render() {
    const dishes = this.state.dishes.map((d, i) => {
      return ({id: d.id, 
        quantity: d.quantity, 
        name: this.props.dishStore.getDish(d.id).name, 
        add: <IconButton name="add" onClick={this.addDish(d.id)}/>,
        remove: <IconButton name="remove" onClick={this.removeDish(d.id)}/>})
    })
    return (
      <div class="in-line split">
        <Button colored onClick={this.handleOpenDialog} ripple>Split</Button>
        <Dialog open={this.state.openDialog}>
          <DialogTitle>Split Order</DialogTitle>
          <DialogContent>
            <Textfield
                label="Name"
                value={ this.state.newName }
                onChange={ this.handleNameChange }
                floatingLabel
            />
            <br/>
            <DataTable
              rowKeyColumn="id"
              rows={ dishes } >
              <TableHeader numeric name="remove"></TableHeader>
              <TableHeader numeric name="quantity"></TableHeader>
              <TableHeader numeric name="add" ></TableHeader>
              <TableHeader name="name"></TableHeader>
            </DataTable>
          </DialogContent>
          <DialogActions>
            <Button type='button' accent onClick={this.splitOrder}>Split</Button>
            <Button type='button' onClick={this.handleCloseDialog}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}