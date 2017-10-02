import React from "react";
import { Textfield, Card, IconButton, Button, CardTitle, CardText, CardMenu, Grid, Cell } from 'react-mdl';
import { inject } from "mobx-react"

@inject('dishStore')
@inject('orderStore')
export default class PayOrder extends React.Component {
  constructor(props){
    super(props)

    const { id } = this.props.match.params
    let order = undefined
    let total = 0

    if (id){
      order = this.props.orderStore.getOrder(id)
      if (order){
          total = order.dishes.reduce((acc, val) => {
            const dish = this.props.dishStore.getDish(val.id)
            return acc + (val.quantity * (dish ? dish.cost : 0))
          }, 0).toFixed(2)
      }
    }

    this.state = {
      amountPayed: "",
      order: order,
      total: total
    }

    this.goBack = this.goBack.bind(this)
  }

  goBack(){
    this.props.history.goBack()
  }

  setAmountPayed(e){
    this.setState({amountPayed : e.target.value})
  }

  setTotal(e){
    this.setState({total : e.target.value})
  }

  payBill(){
    this.state.order.update({hasPayed: true},
      () => {
        this.goBack(); 
        this.props.orderStore.undoText = `Payed ${this.state.order.name}'s bill`
        this.props.orderStore.undoAction = () => {this.state.order.update({hasPayed: false}, () => {}, () => {})}  
      }, 
      (err) => {console.error(err)})
  }

  render() {
    const { total } = this.state
    const amountPayed = this.state.amountPayed ? parseFloat(this.state.amountPayed.replace(',', '.')).toFixed(2) : undefined
    const isNumber = this.state.amountPayed && !isNaN(amountPayed)
    const change = isNumber ? (amountPayed - total).toFixed(2) : undefined
    const payedFull = change >= 0
    const className = payedFull ? "success" : "error"

    const changeLabel = payedFull ? "Change" : "Missing"
    return(
      <Grid className="order-details center-card pay">
        <Cell col={12}>
          <Card shadow={1} >
            <CardTitle><IconButton name="close" onClick={this.goBack}/>Pay {this.state.order ? `${this.state.order.name}'s` : ""} Bill</CardTitle>
            <CardText>
              <Textfield
                label="Total"
                floatingLabel
                value={ total }
                onChange={this.setTotal.bind(this)}
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
            </CardText>
            <CardMenu>
              <Button type='button' onClick={this.payBill.bind(this)} accent>Pay</Button>
            </CardMenu>
          </Card>
        </Cell>
      </Grid>
    )
  }
}