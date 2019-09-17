import React, { Component } from 'react'
import { TextField } from '@rmwc/textfield';
import { Button, ButtonIcon } from '@rmwc/button';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { LinearProgress } from '@rmwc/linear-progress';
import { Grid, GridCell } from '@rmwc/grid';

import CreateReceipt from './CreateReciept'

import {
  List,
  ListItem,
  ListItemText,
  ListItemGraphic,
  ListItemMeta,
  ListDivider,
  ListItemSecondaryText,
  ListItemPrimaryText
} from '@rmwc/list';

import FileSaver from "filesaver.js-npm"

const PAY = gql`
  mutation pay($id: ID!, $dishes: [orderDishMutation]!){
    updateOrder(_id: $id, dishes: $dishes){
      _id,
      dishes {
        hasPayed
      }
    }
  }`

export default class PayOrderContent extends Component {
  constructor(){
    super()

    this.changePayment = this.changePayment.bind(this)
    this.toggleSelection = this.toggleSelection.bind(this)
    this.toggleAll = this.toggleAll.bind(this)
    this.saveFile = this.saveFile.bind(this)
  }
  state = {
    dishes: [],
    paying: 0,
    selectAll: true
  }

  static getDerivedStateFromProps(prop, state) {
    if (prop.dishesToPay.length === 0) return null;
    if (prop.dishesToPay.length === state.dishes.length) return null;

    return({
      dishes: prop.dishesToPay.map(m => ({
        ...m,
        paying: false
      }))
    })
  }

  toggleSelection(i){
    return () => {
      const dishes = this.state.dishes
      dishes[i].paying = !dishes[i].paying
      this.setState({
        dishes: dishes,
        selectAll: dishes.every(d => d.paying)
      })
    }
  }

  toggleAll() {
    const selected = !this.state.selectAll
    const dishes = this.state.dishes

    for (const dish of dishes) {
      dish.paying = selected
    }

    this.setState({
      dishes: dishes,
      selectAll: selected
    })
  }

  changePayment(){
    return (e) => {
      if (!isNaN(e.target.value))
        this.setState({ paying: e.target.value})
    }
  }
  componentDidMount(){
    this.setState({
      dishes: this.props.dishesToPay
    })
  }

  saveFile(data){
    const blob = new Blob([CreateReceipt(data)], {
        type: "text/plain;charset=utf-8"
      })
    FileSaver.saveAs(blob, `Receipt ${new Date().toUTCString()}.html`, true)
  }

  render(){
    let total = 0
    return (
      <React.Fragment>
        <List>
          <ListItem key={-1} onClick={this.toggleAll}>
            <ListItemGraphic icon={this.state.selectAll ? "radio_button_checked" : "radio_button_unchecked"}/>
            <ListItemText>Everything</ListItemText>
          </ListItem>

          <ListDivider />
          {this.state.dishes.map((v, i) => {
            const extraCost = v.extras.reduce((a, e) => a + e.cost, 0);
            if (v.paying)
              total = v.dish.cost + total + extraCost
          
            return (
            <ListItem key={i} onClick={this.toggleSelection(i)}>
              <ListItemGraphic icon={v.paying ? "radio_button_checked" : "radio_button_unchecked"}/>
              <ListItemText>
                <ListItemPrimaryText>{v.dish.name}</ListItemPrimaryText>
                <ListItemSecondaryText>{v.extras.map(e => e.name).join(", ")}</ListItemSecondaryText>
              </ListItemText>
              <ListItemMeta tag="span" basename="">{(v.dish.cost + extraCost).toFixed(2)}</ListItemMeta>
            </ListItem>)
          })}
        
        </List>
        <Grid>
          <GridCell span="12">
            <TextField icon="euro_symbol" disabled label="Total" value={total.toFixed(2)} />
            <TextField icon="euro_symbol" label="Difference" value={(this.state.paying - total).toFixed(2)} onChange={() => {}} invalid={this.state.paying - total < 0} />
            <TextField icon="euro_symbol" label="Paying" type="number" inputMode="numeric" pattern="\d*.*,*\d*" value={this.state.paying} onChange={this.changePayment()}/>
          </GridCell>
        </Grid>
        <Mutation mutation={PAY}>
          {(pay, { data, loading, error }) => {
            let result = <Button onClick={() => {
              pay({
              variables: {
                id: this.props.id,
                dishes: this.state.dishes.map(d => {
                  return {
                    id: d.dish._id,
                    made: d.made,
                    hasPayed: d.paying,
                    delivered: d.delivered,
                    extras: d.extras.map(e => e._id)
                   }
                }).concat(this.props.payedDishes.map(d => {
                  return {
                    id: d.dish._id,
                    made: d.made,
                    hasPayed: d.hasPayed,
                    delivered: d.delivered,
                    extras: d.extras.map(e => e._id)
                  }
                }))
              }
            })}}>Pay</Button>

            if (loading)
              result =
                <React.Fragment>
                  <LinearProgress />
                  {result}
                </React.Fragment>
            if (error) console.error(error);
            if (data && data.updateOrder && data.updateOrder.dishes.reduce((a, c) => a && c.hasPayed, true)) {
               this.props.history.goBack()
            }

            return result
          }}
        </Mutation>
        <Button theme="secondary" onClick={() => this.saveFile(this.state.dishes.filter(d => d.paying).map(d => d.dish))}><ButtonIcon icon="cloud_download" />Download</Button>
    </React.Fragment>)
  }
}