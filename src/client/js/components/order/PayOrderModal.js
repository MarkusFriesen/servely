import React from "react";
import {CardLink, Modal, ModalHeader, ModalFooter, ModalBody, Button } from "reactstrap"
import { inject, observer } from "mobx-react"

@inject('orderStore')
@observer
export default class PayOrderModal extends React.Component {
  constructor(){
    super();
    this.state = {
      toggle: false,
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState({
      toggle: !this.state.toggle
    });
  }

  payBill(){
    //TODO: Store order for reference in the future.
    this.props.orderStore.deleteOrder(this.props._id, () => { this.toggle() }, (err) => { console.error(err)})
  }

  render() {
    const payBill = this.payBill.bind(this)

    return (
      <div class="pay-order-modal">
        <CardLink class='card-link' onClick={this.toggle}><i class="fa fa-eur success fa-2x"></i></CardLink>
        <Modal isOpen={this.state.toggle} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Confirm purchase</ModalHeader>
          <ModalBody>
            The Customer has payed {parseFloat(this.props.amountPayed).toFixed(2)}€
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={payBill}>Pay Bill</Button>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
