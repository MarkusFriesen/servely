import React from "react";
import { Card, CardBlock, CardTitle, CardSubtitle, CardLink,  CardHeader, FormGroup, InputGroup, InputGroupAddon, Input, FormFeedback } from "reactstrap"
import { findIndex } from "lodash"
import { inject, observer } from "mobx-react"

import PayOrderModal from "./order/PayOrderModal"
import OrderDishes from "./order/OrderDishes"
import OrderModal from "./order/OrderModal"
import SplitOrderModal from "./order/SplitOrderModal"
import JoinOrdersModal from "./order/JoinOrdersModal"

@inject('dishStore')
@inject('orderStore')
@observer
export default class Order extends React.Component {
  constructor(){
    super();
    this.state = {
      flipped: false,
      amountPayed: 0
    };
  }

  flip(){
    this.setState({
      flipped: !this.state.flipped,
      amountPayed: 0
    })
  }

  setAmountPayed(e){
    this.setState({
      amountPayed: e.target.value
    })
  }

  render() {
    const { _id, table, name, timestamp, dishes, notes  } = this.props;
    const flip = this.flip.bind(this)

    const dishIds = dishes.filter(d => d).map(d => d.id)
    const orderDishes = this.props.dishStore.getDishesByIds(dishIds)

    const dishesHeader = ["Dish", "Quantity"]
    var dishesContent, total
    dishesContent = []
    total = 0
    orderDishes.forEach((d, i) => {
      const dish = dishes[findIndex(dishes, {"id" : d._id } )]

      let column = [d.name, dish.quantity]
      if (this.state.flipped){
        column.push(d.cost.toFixed(2))
      }

      dishesContent.push(column)
      total += d.cost*dish.quantity
    })

    if (this.state.flipped){
      dishesContent.push(["Total", null, total.toFixed(2)])
      dishesHeader.push("Cost")
    }

    const modalLink = this.state.flipped ? <SplitOrderModal _id={_id} /> : <OrderModal id={this.props._id} />
    const cardFooter = this.state.flipped ?
      <div class='card-footer-link'>
        <CardLink class='card-link' onClick={flip}><i class="fa fa-undo error fa-2x"></i></CardLink>
        <PayOrderModal amountPayed={this.state.amountPayed} _id={this.props._id} />
      </div> :
      <CardLink onClick={flip}><i class="fa fa-shopping-cart success fa-2x"></i></CardLink>

    return (
      <div class="flip">
        <Card>
          <CardHeader>
            <div class="cover">
              {
                this.state.flipped ? <JoinOrdersModal _id={_id}/> : undefined
              }
              <CardTitle>Table { table }</CardTitle>
              <CardSubtitle> { name }</CardSubtitle>
            </div>
          </CardHeader>
          <CardBlock>
            <OrderDishes columns={dishesHeader} dishes={dishesContent}/>
            { this.state.flipped ?
              <FormGroup color={this.state.amountPayed - total < 0 ? "danger" : "success"}>
                <InputGroup>
                  <InputGroupAddon><i class="fa fa-eur"></i></InputGroupAddon>
                  <Input state={this.state.amountPayed - total < 0 ? "danger" : "success"} placeholder="Amount" type="number" onChange={ this.setAmountPayed.bind(this) } />
                </InputGroup>
                <FormFeedback>{(this.state.amountPayed - total < 0 ? "Missing: " : "Change: ")} {Math.abs(this.state.amountPayed - total).toFixed(2)} <i class="fa fa-eur"></i> </FormFeedback>
              </FormGroup>
            : undefined }
            {
              this.props.orderStore.kitchenMode && !this.state.flipped  && notes ?
              <blockquote>
                <p>{notes}</p>
              </blockquote>
              : undefined
            }
            { modalLink }
            { cardFooter }
          </CardBlock>
        </Card>
      </div>
    );
  }
}
