import React from "react";
import {CardLink, Modal, ModalHeader, ModalFooter, ModalBody, Button } from "reactstrap"

export default class PayOrderModal extends React.Component {
  constructor(){
    super();
    this.state = {
      toggle: false,
    }
  }

  toggle() {
    this.setState({
      toggle: !this.state.toggle
    });
  }

  payBill(){
    //TODO: Store order for reference in the future.
    this.props.orderStore.deleteOrder(this.props._id, () => {}, (err) => { console.error(err)})
  }

  render() {
    const toggle = this.toggle.bind(this)
    const payBill = this.payBill.bind(this)

    return (
      <div class="pay-order-modal">
        <CardLink class='card-link' onClick={toggle}><i class="fa fa-eur success fa-2x"></i></CardLink>
        <Modal isOpen={this.state.toggle} toggle={toggle}>
          <ModalHeader toggle={toggle}>Confirm purchase</ModalHeader>
          <ModalBody>
            The Customer has payed {parseInt(this.props.amountPayed).toFixed(2)}€
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={payBill}>Pay Bill</Button>
            <Button color="secondary" onClick={toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
