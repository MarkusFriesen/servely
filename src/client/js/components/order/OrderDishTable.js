import React from "react";
import { inject, observer } from "mobx-react"
import { DataTable, TableHeader } from "react-mdl"

@inject('orderStore')
@inject('dishStore')
@observer
export default class OrderDishTable extends React.Component {

  handleSelect(e){
    const order = this.props.orderStore.getOrder(this.props.orderId)
    if (e.length == order.dishes.length){
      order.update({made: true}, () => {}, (err) => {console.error(err)})
    }
  }

  render() {
    const order = this.props.orderStore.getOrder(this.props.orderId)
    const dishesOrdered = order.dishes.map((d, i) => {
      const dish = this.props.dishStore.getDish(d.id) 

      if (!dish)
        return ({name: "...", quantity: d.quantity, cost: -1})

      return ({name: dish.name, quantity: d.quantity, cost: dish.cost})
    })

    const kitchenMode = this.props.orderStore.kitchenMode
    const handleSelect = this.handleSelect.bind(this)
    return (
      <DataTable
          selectable={kitchenMode}
          onSelectionChanged={ kitchenMode ? handleSelect : undefined}
          rows={dishesOrdered}
      >
        <TableHeader name="name" tooltip="Dish Name">Dish</TableHeader>
        <TableHeader numeric name="quantity" tooltip="Number of dishes">Quantity</TableHeader>
        <TableHeader numeric name="cost" cellFormatter={(price) => `\€ ${price.toFixed(2)}`} tooltip="Price pet dish">Price</TableHeader>
      </DataTable>

     )
  }
}