import React from "react"
import { Table } from "reactstrap"
import { observer, inject } from "mobx-react"

import DishTypeModal from "./DishTypeModal"

@inject('dishTypeStore')
@observer
export default class DishTypeSettings extends React.Component {
  constructor(){
    super()
    this.state = {
      "dishTypeId": undefined
    }
  }

  render() {
    const items = this.props.dishTypeStore.dishTypes.map(d =>
      <tr key={d._id}>
        <th>{d.name}</th>
        <th class="edit-dish-btn"><DishTypeModal id={d._id} /></th>
      </tr>
    )
    return (
      <div>
        <Table>
          <thead>
            <tr>
              <th>Dish Type</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { items }
          </tbody>
        </Table>
        <DishTypeModal />
      </div>
    )
  }
}
