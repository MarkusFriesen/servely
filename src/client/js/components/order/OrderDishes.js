import React from "react";
import { map, first, findIndex } from "lodash";
import { Table,  } from "reactstrap"
import { inject } from "mobx-react"

@inject('orderStore')
export default class OrderDishes extends React.Component {
  render() {
    const header = this.props.columns
    const dishes = this.props.dishes
    const kitchenMode = this.props.orderStore.kitchenMode
    
    return (
      <Table>
        <thead>
          <tr>
            {  kitchenMode ? <th/> : undefined }
            { header.map((h, i) => <th key={i}>{h}</th>) }
          </tr>
        </thead>
        <tbody>
          { dishes.map((dishItem, i) => <tr key={i}>{ kitchenMode ? <td class="checkbox-column"><input type="checkbox"/></td> : undefined }{dishItem.map((d, ix) => <td key={ix}>{d}</td>)}</tr> )}
        </tbody>
      </Table>
    );
  }
}
