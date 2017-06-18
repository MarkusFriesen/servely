import React from "react"
import { Card, Button, Cell, CardTitle, CardText, CardMenu, DataTable, TableHeader, IconButton, Textfield, Grid } from "react-mdl"
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
    
    this.addDish = this.addDish.bind(this);
    this.removeDish = this.removeDish.bind(this);
    this.splitOrder = this.splitOrder.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this)
    this.goBack = this.goBack.bind(this)
  }

  componentWillMount() {
    const order = this.props.orderStore.getOrder(this.props.match.params.id)

    if (order){
      const oldDishes = order.dishes
      const dishes = oldDishes.map(d =>{return({id: d.id, quantity: 0})})
      this.setState({
        openDialog: true,
        dishes: dishes,
        oldDishes: oldDishes,
        order: order
      });
    }
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
      const { table, name, notes, made } = this.state.order
      
      const newDishes = []
      for (var i=0; i < this.state.dishes.length; i++){
        newDishes.push({id: this.state.dishes[i].id, quantity: this.state.oldDishes[i].quantity - this.state.dishes[i].quantity })
      }

      this.props.orderStore.add({table: table, name: this.state.newName, notes: notes, made: made, dishes: this.state.dishes.filter(d => d.quantity > 0)},
        () => {
          this.state.order.update({dishes: newDishes.filter(d => d.quantity > 0)}, 
            () => {this.goBack()}, 
            (err) => {console.error(err)}
          )
        }, 
        (err) => { console.error(err) }
      )
    }
  }

  goBack(){
    this.props.history.goBack()
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
      <Grid class="order-details center-card split">
        <Cell col={12}>
          <Card shadow={1} >
            <CardTitle><IconButton name="close" onClick={this.goBack}/> Split {this.state.order ? `${this.state.order.name}'s` : ""} Order</CardTitle>
            <CardText>
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
            </CardText>
            <CardMenu>
              <Button type='button' accent onClick={this.splitOrder}>Split</Button>
            </CardMenu>
          </Card>
        </Cell>
      </Grid>
    );
  }
}