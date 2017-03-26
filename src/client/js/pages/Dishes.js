import React from "react";
import { CardColumns, Button } from "reactstrap"
import { groupBy, map } from "lodash"
import { inject, observer } from "mobx-react"

import DishGroup from "../components/DishGroup";
import DishModal from "../components/DishModal";

@inject('dishStore')
@observer
export default class Dishs extends React.Component {
  render() {
    let i = 0
    const disheComponent = map(groupBy(this.props.dishStore.dishes, "type"), (g, type) =><DishGroup key={i++} type={ type } dishGroup={ g } /> );
    return (
      <div class='dish-collection'>
        <CardColumns>
          { disheComponent }
        </CardColumns>
        <DishModal/>
      </div>
    );
  }
}
