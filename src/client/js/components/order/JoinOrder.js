import React from "react"
import { Dialog, Button, DialogTitle, DialogContent, DialogActions, DataTable, TableHeader } from "react-mdl"
import { observer, inject } from "mobx-react"
import { findIndex } from "lodash"

@inject('orderStore')
@observer
export default class JoinOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOpenDialog() {
    this.setState({
      openDialog: true
    });
  }

  handleCloseDialog() {
    this.setState({
      openDialog: false
    });
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

    const order = this.props.orderStore.getOrder(this.props.id)

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
    this.handleCloseDialog()
  }

  render() {
    const handleOpenDialog = this.handleOpenDialog.bind(this);
    const handleCloseDialog = this.handleCloseDialog.bind(this);
    const handleChange = this.handleChange.bind(this)
    const joinOrders = this.joinOrders.bind(this)

    const peopleAtTable = this.props.orderStore.orders.filter(o => o.table == this.props.table && o._id != this.props.id)

    return (
      <div class="in-line">
        <Button colored onClick={handleOpenDialog} ripple>Join</Button>
        <Dialog open={this.state.openDialog}>
          <DialogTitle>Join Order</DialogTitle>
          <DialogContent>
            <DataTable
              selectable
              rowKeyColumn="id"
              rows={peopleAtTable.map(o => {return({id: o._id, name: o.name})})}
              onSelectionChanged={handleChange}
          >
            <TableHeader name="name" tooltip="The customer with whom to join the bill">Everyone</TableHeader>
          </DataTable>
          </DialogContent>
          <DialogActions>
            <Button type='button' onClick={joinOrders} accent>Join</Button>
            <Button type='button' onClick={handleCloseDialog}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}