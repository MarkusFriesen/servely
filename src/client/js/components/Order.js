import React from "react";
import { Card, CardImgOverlay, CardImg, CardBlock, CardTitle, CardSubtitle, CardText, Table, CardColumns, CardLink,  CardHeader, CardFooter, FormGroup, InputGroup, InputGroupAddon, Input, Modal, ModalHeader, ModalFooter, ModalBody, Button, FormFeedback, Label, FormText} from "reactstrap"
import { take, map, pick,findIndex } from "lodash"
import { inject, observer } from "mobx-react"

import OrderModal from "./OrderModal"
import SplitOrderModal from "./SplitOrderModal"

@inject('dishStore')
@inject('orderStore')
@observer
export default class Order extends React.Component {
  constructor(){
    super();
    this.state = {
      flipped: false,
      amountPayed: 0,
      payModal: false,
      detailModal: false,
      id:undefined
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      payModal: !this.state.payModal
    });
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

  editItem(){
      this.refs.editModal.open(this.props._id)
  }

  payBill(){
    //TODO: Store order for reference in the future.
    this.props.orderStore.deleteOrder(this.props._id, () => {}, (err) => { console.error(err)})
  }

  render() {
    const { _id, table, name, timestamp, dishes  } = this.props;
    const flip = this.flip.bind(this)
    const setAmountPayed = this.setAmountPayed.bind(this)
    const payBill = this.payBill.bind(this)
    const toggle = this.toggle.bind(this)

    const dishIds = dishes.filter(d => d).map(d => d.id)
    const orderDishes = this.props.dishStore.getDishesByIds(dishIds)

    var dishesToShow, dishesToPay, total
    dishesToShow= []
    dishesToPay = []
    total = 0
    orderDishes.forEach((d, i) => {
      const dish = dishes[findIndex(dishes, {"id" : d._id } )]
      dishesToShow.push(<tr key={i}><td>{ d.name }</td><td>{ dish.quantity }</td></tr>)
      dishesToPay.push(<tr key={i}><td>{ d.name }</td><td>{ dish.quantity }</td><td>{ d.cost.toFixed(2) }</td></tr>)
      total += d.cost*dish.quantity
    })

    const front =
    <div>
      <CardHeader>
        <div class="cover">
          <CardTitle>Table { table }</CardTitle>
          <CardSubtitle> { name }</CardSubtitle>
        </div>
      </CardHeader>
      <CardBlock>
        <Table>
          <thead>
            <tr>
              <th>Dish</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            { dishesToShow }
          </tbody>
        </Table>
        <OrderModal id={this.props._id} />
        <CardLink onClick={flip}><i class="fa fa-shopping-cart success fa-2x"></i></CardLink>
      </CardBlock>
    </div>

    const back =
      <div>
        <CardHeader>
          <div class="cover">
            <CardTitle>Table { table }</CardTitle>
            <CardSubtitle> { name }</CardSubtitle>
          </div>
        </CardHeader>
        <CardBlock>
          <Table>
            <thead>
              <tr>
                <th>Dish</th>
                <th>Quantity</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              { dishesToPay }
              <tr>
                <th>Total</th>
                <th/>
                <th>{total.toFixed(2)}</th>
              </tr>
            </tbody>
          </Table>
          <FormGroup color={this.state.amountPayed - total < 0 ? "danger" : "success"}>
            <InputGroup>
              <InputGroupAddon><i class="fa fa-eur"></i></InputGroupAddon>
              <Input state={this.state.amountPayed - total < 0 ? "danger" : "success"} placeholder="Amount" type="number" onChange={ setAmountPayed } />
            </InputGroup>
            <FormFeedback>{(this.state.amountPayed - total < 0 ? "Missing: " : "Change: ")} {Math.abs(this.state.amountPayed - total).toFixed(2)} <i class="fa fa-eur"></i> </FormFeedback>
          </FormGroup>
          <SplitOrderModal _id={_id} />
          <CardLink class='card-link' onClick={flip}><i class="fa fa-undo error fa-2x"></i></CardLink>
          <CardLink class='card-link' onClick={toggle}><i class="fa fa-eur success fa-2x"></i></CardLink>
        </CardBlock>
        <Modal isOpen={this.state.payModal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Confirm purchase</ModalHeader>
          <ModalBody>
            The Customer has payed {parseInt(this.state.amountPayed).toFixed(2)}€
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={payBill}>Pay Bill</Button>
            <Button color="secondary" onClick={toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    return (
      <div class="flip">
        <Card>
          { this.state.flipped ? undefined : front }
          { this.state.flipped ? back : undefined }
        </Card>
      </div>
    );
  }
}
