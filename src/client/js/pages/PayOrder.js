import React from "react";
import { Textfield, Dialog, IconButton, Button, DialogTitle, DialogContent, DialogActions } from 'react-mdl';
import { inject } from "mobx-react"

@inject('dishStore')
@inject('orderStore')
export default class PayOrder extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      amountPayed: "",
      openDialog: false,
      dishes:[]
    }
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
  }

   componentDidMount(){
    var dialog = document.querySelector('dialog');
    dialogPolyfill.registerDialog(dialog);

    this.setState({
      openDialog: true
    })
  }

  componentWillMount(){
    const id = this.props.match.params.id
    if (id){
      const order = this.props.orderStore.getOrder(id)
      if (order){
        this.setState({
          name: order.name,
          dishes: order.dishes.map(d => Object.assign({}, d)),
        })
      }
    }
  }

  handleCloseDialog() {
    this.setState({
      openDialog: false
    }, () => {
      this.props.history.goBack()
    });
  }

  setAmountPayed(e){
    this.setState({amountPayed : e.target.value})
  }

  payBill(){
    this.props.orderStore.remove(this.props.match.params.id, () => {this.handleCloseDialog()}, (err) => {console.error(err)})
  }

  render() {
    const total = this.state.dishes.reduce((acc, val) => {
      const dish = this.props.dishStore.getDish(val.id)
      return acc + (val.quantity * (dish ? dish.cost : 0))
    }, 0).toFixed(2);

    const amountPayed = this.state.amountPayed ? parseFloat(this.state.amountPayed.replace(',', '.')).toFixed(2) : undefined
    const isNumber = this.state.amountPayed && !isNaN(amountPayed)
    const change = isNumber ? (amountPayed - total).toFixed(2) : undefined
    const payedFull = change >= 0
    const className = payedFull ? "success" : "error"

    const changeLabel = payedFull ? "Change" : "Missing"
    return(
      <div class="orders">
        <Dialog open={this.state.openDialog} id={`pay${this.props.match.params.id}`}>
          <DialogTitle>Payment</DialogTitle>
          <DialogContent>
            <Textfield
              disabled
              label="Total"
              floatingLabel
              value={ total }
            />

            <div class={className}>
              <Textfield
                disabled
                onClick= {() => {}}
                label="Change"
                floatingLabel
                value={change}
              />
            </div> 
            <Textfield
              onChange={this.setAmountPayed.bind(this)}
              pattern="-?[0-9]*([\.,][0-9]+)?"
              error="Input is not a number!"
              label="Amount Payed"
              floatingLabel
              value={ this.state.amountPayed }
            />
          </DialogContent>
          <DialogActions>
            <Button type='button' onClick={this.payBill.bind(this)} accent>Pay</Button>
            <Button type='button' onClick={this.handleCloseDialog}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}