import React from "react";
import { map, first, findIndex } from "lodash";
import { Table,  } from "reactstrap"

export default class OrderDishes extends React.Component {
  render() {
    const header = this.props.columns
    const dishes = this.props.dishes

    return (
      <Table>
        <thead>
          <tr>
          { header.map((h, i) => <th key={i}>{h}</th>) }
          </tr>
        </thead>
        <tbody>
          { dishes.map((dishItem, i) => <tr key={i}>{dishItem.map((d, ix) => <td key={ix}>{d}</td>)}</tr>)}
        </tbody>
      </Table>
    );
  }
}
