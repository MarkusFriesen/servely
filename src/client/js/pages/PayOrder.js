import React from "react";
import { Textfield, Card, IconButton, Button, CardTitle, CardText, CardMenu, Grid, Cell } from 'react-mdl';
import { inject } from "mobx-react"

@inject('dishStore')
@inject('orderStore')
export default class PayOrder extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      amountPayed: "",
      dishes:[],
      order: undefined
    }

    this.goBack = this.goBack.bind(this)
  }

  componentWillMount(){
    const id = this.props.match.params.id
    if (id){
      const order = this.props.orderStore.getOrder(id)
      if (order){
        this.setState({
          name: order.name,
          dishes: order.dishes.map(d => Object.assign({}, d)),
          order: order
        })
      }
    }
  }

  goBack(){
    this.props.history.goBack()
  }

  setAmountPayed(e){
    this.setState({amountPayed : e.target.value})
  }

  payBill(){
    this.props.orderStore.remove(this.props.match.params.id, () => {this.goBack()}, (err) => {console.error(err)})
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
      <Grid className="order-details center-card pay">
        <Cell col={12}>
          <Card shadow={1} >
            <CardTitle><IconButton name="close" onClick={this.goBack}/>Pay {this.state.order ? `${this.state.order.name}'s` : ""} Bill</CardTitle>
            <CardText>
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