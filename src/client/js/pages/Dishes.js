import React from "react"
import DishCard from "../components/dish/DishCard"
import { inject, observer } from "mobx-react"
import { groupBy, map } from "lodash"
import { Link } from "react-router-dom"
import { FABButton, Icon } from "react-mdl"

@inject('dishStore')
@inject('dishTypeStore')
@observer
export default class Dishes extends React.Component {
  render() {
    let i = 0
    const dishes = map(groupBy(this.props.dishStore.filteredDishes, "type"), 
    (g, type) =>
      <DishCard key={i++} type={ this.props.dishTypeStore.getDishType(type) } dishGroup={ g } /> );

    return (
      <div class="dishes masonry-layout">
        { dishes }

        <Link to="/dishDetails">
          <FABButton colored ripple raised id="add-order">
              <Icon name="add" />
            </FABButton>
        </Link>
      </div>)
  }
}