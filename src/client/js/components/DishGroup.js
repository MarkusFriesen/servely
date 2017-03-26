import React from "react";
import { Link } from "react-router"
import { map } from "lodash";
import { Card, CardImg, CardBlock, CardTitle, CardFooter, CardLink } from "reactstrap"
import { observer } from "mobx-react"

import DishModal from "./DishModal"

@observer
export default class DishGroup extends React.Component {
  constructor(){
    super();
    this.state = {
      flipped: false,
      id:undefined
    }
  }

  flip(){
    this.setState({
      flipped: !this.state.flipped
    })
  }

  editItem(id){
    return () => {
      this.setState({
        id: id
      }, () => this.refs.editModal.open(this.state.id))
    }
  }

  render() {
    const { type, dishGroup } = this.props;
    const flip = this.flip.bind(this)

    const dishes = map(dishGroup, (d, i) =>
      <table key={i}>
        <tbody>
          <tr>
            <td class="name"><h6>{d.name}</h6></td>
            <td class="cost">{d.cost.toFixed(2)}</td>
          </tr>
          <tr class="description">
            <td>{ d.description }</td>
          </tr>
        </tbody>
      </table>)

      const editabledishes = map(dishGroup, (d, i) =>
        <table key={i}>
          <tbody>
            <tr>
              <td class="name"><h6>{d.name}</h6></td>
              <td class="cost">{d.cost.toFixed(2)}</td>
              <td class="edit"><DishModal id={ d._id } /></td>
            </tr>
            <tr class="description">
              <td>{ d.description }</td>
            </tr>
          </tbody>
        </table>)

    const images= {
      "Dessert" : <CardImg top width="100%" class="img" src="assets/img/dessert.jpg"/>,
      "Sandwiches" : <CardImg top width="100%" class="img" src="assets/img/sandwiches.jpg"/>,
      "Mains": <CardImg top width="100%" class="img" src="assets/img/mains.jpg"/>,
      "Pullman Burger": <CardImg top width="100%" class="img" src="assets/img/burger.jpg"/>,
      "Quick Eats": <CardImg top width="100%" class="img" src="assets/img/quick.jpg"/>,
    }
    const image = images[type]

    const front = <div>
      { image || <CardImg top width="100%" class="img" src="assets/img/default.jpg"/> }
      <CardBlock>
        <CardTitle>{ type }</CardTitle>
        { dishes }

        <CardLink onClick={flip}><i class="fa fa-pencil fa-2x"></i></CardLink>
      </CardBlock>
    </div>

    const back = <div>
      { image || <CardImg top width="100%" class="img" src="assets/img/default.jpg"/> }
      <CardBlock>
        <CardTitle>{ type }</CardTitle>
        { editabledishes }
        <CardLink onClick={flip}><i class="fa fa-undo error fa-2x"></i></CardLink>
      </CardBlock>
    </div>

    return (
      <div class="flip">
        <Card class={this.state.flipped ? "flipped" : ""}>
          <div class="face front ">
            {this.state.flipped ? undefined : front}
          </div>
          <div class="face back">
            {this.state.flipped ? back : undefined}
          </div>
        </Card>
      </div>
    );
  }
}
