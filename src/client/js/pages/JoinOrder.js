import React from "react"
import { Card, Button, CardTitle, CardText, CardMenu, DataTable, TableHeader, Grid, Cell, IconButton } from "react-mdl"
import { observer, inject } from "mobx-react"
import { findIndex } from "lodash"

@inject('orderStore')
@observer
export default class JoinOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      peopleAtTable: []
    };
    
    this.goBack = this.goBack.bind(this)
  }

  componentWillMount() {
    const order = this.props.orderStore.getOrder(this.props.match.params.id)

    if (order){
      const peopleAtTable = this.props.orderStore.orders.filter(o => o.table == order.table && o._id != this.props.match.params.id)

      this.setState({
        peopleAtTable: peopleAtTable,
        order: order,
        orderIds: []
      });
    }
  }

  handleChange(e){
    this.setState({
      orderIds: e
    })
  }

  joinOrders(){
    const orders = this.props.orderStore.getOrderByIds(this.state.orderIds)
    const allDishes = []
    orders.forEach( o => allDishes.push.apply(allDishes, o.dishes));

    const order = this.props.orderStore.getOrder(this.props.match.params.id)

    const newDishes = order.dishes

    allDishes.forEach( d => {
      const i = findIndex(newDishes, {id: d.id})
      if (i > -1){
        newDishes[i].quantity += d.quantity
      } else {
        newDishes.push(d)
      }
    })
    order.update({dishes: newDishes}, 
      () => {
        //TODO: Remove all or none
        this.state.orderIds.forEach( o => this.props.orderStore.remove(o, () => {}, (err) => {console.error(err)}));
      }, 
      (err) => {console.error(err)}
    )
    this.goBack()
  }

  goBack(){
    this.props.history.goBack()
  }

  render() {
    const handleChange = this.handleChange.bind(this)
    const joinOrders = this.joinOrders.bind(this)

    return (
      <Grid class="join center-card">
        <Cell col={12}>
          <Card shadow={1} >
              <CardTitle><IconButton name="close" onClick={this.goBack}/> Join Order</CardTitle>
              <CardText>
                <DataTable
                  selectable
                  rowKeyColumn="id"
                  rows={this.state.peopleAtTable.map(o => {return({id: o._id, name: o.name})})}
                  onSelectionChanged={handleChange}
              >
                <TableHeader name="name" tooltip="The customer with whom to join the bill">Everyone</TableHeader>
              </DataTable>
              </CardText>
              <CardMenu>
                <Button type='button' onClick={joinOrders} accent>Join</Button>
              </CardMenu>
          </Card>
        </Cell>
      </Grid>
    );
  }
}