import React from "react"
import { inject, observer } from "mobx-react"
import { DataTable, TableHeader, Grid, Textfield, FABButton, Icon } from "react-mdl"
import moment from 'moment'

import { DateRangePicker } from "react-dates"

@inject('orderHistoryStore')
@inject('dishStore')
@inject('dishTypeStore')
@observer
export default class OrderHistory extends React.Component {
  constructor(){
    super()

    this.state = {
      focusedInput: undefined
    }
  }

  render() {
    const { payedOrders } = this.props.orderHistoryStore

    const allPayedDishes = []

    payedOrders.forEach(o => {
      o.dishes.forEach(d => {
        const dish = this.props.dishStore.getDish(d.id)
        if (dish){
          const dishType = this.props.dishTypeStore.getDishType(dish.type)
          if (dishType){
            allPayedDishes.push({
              id: `${o.id}${d.id}`, 
              quantity: d.quantity,
              name: dish.name,
              costs: dish.cost,
              type: dishType.name,
              timestamp: moment(o.timestamp).format("ll") })
          }
        }
      })
    })

    return(
      <Grid class="order-history">
        <DateRangePicker
          startDate={this.state.startDate} 
          endDate={this.state.endDate} 
          onDatesChange={({ startDate, endDate }) => {
            this.setState({startDate, endDate})
            if (startDate)
             this.props.orderHistoryStore.startDate = startDate;
            if (endDate)
             this.props.orderHistoryStore.endDate = endDate;
            this.props.orderHistoryStore.fetchOrders() 
          }}
          focusedInput={this.state.focusedInput} 
          onFocusChange={focusedInput => this.setState({ focusedInput })}
          isOutsideRange={() => false}
        />
       
        <DataTable
          sortable
          shadow={1}
          rowKeyColumn="id"
          rows={allPayedDishes}
        >
          <TableHeader name="timestamp">When</TableHeader>
          <TableHeader name="name">Name</TableHeader>
          <TableHeader name="type">Type</TableHeader>
          <TableHeader numeric name="quantity" >Quantity</TableHeader>
          <TableHeader numeric name="costs" cellFormatter={(cost) => `\$${cost.toFixed(2)}`} >Price</TableHeader>
        </DataTable>

        <FABButton colored ripple raised id="add-order">
          <Icon name="file_download" />
        </FABButton>

      </Grid>
    )
  }
}