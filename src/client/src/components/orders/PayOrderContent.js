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
  ListDivider
} from '@rmwc/list';

import FileSaver from "filesaver.js-npm"

const PAY = gql`
  mutation pay($id: ID!, $dishes: [orderDishMutation]!){
    updateOrder(_id: $id, dishes: $dishes){
      _id
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
            if (v.paying)
              total = v.dish.cost + total 
          
            return (
            <ListItem key={i} onClick={this.toggleSelection(i)}>
              <ListItemGraphic icon={v.paying ? "radio_button_checked" : "radio_button_unchecked"}/>
              <ListItemText>{v.dish.name}</ListItemText>
              <ListItemMeta tag="span" basename="">{v.dish.cost.toFixed(2)}</ListItemMeta>
            </ListItem>)
          })}
        
        </List>
        <Grid>
          <GridCell span="12">
            <TextField withLeadingIcon="euro_symbol" disabled label="Total" value={total.toFixed(2)} />
            <TextField withLeadingIcon="euro_symbol" label="Difference" value={(this.state.paying - total).toFixed(2)} onChange={() => {}} invalid={this.state.paying - total < 0} />
            <TextField withLeadingIcon="euro_symbol" label="Paying" type="number" inputMode="numeric" pattern="\d*.*,*\d*" value={this.state.paying} onChange={this.changePayment()}/>
          </GridCell>
        </Grid>
        <Mutation mutation={PAY}>
          {(pay, { data, loading, error }) => {
            let result = <Button onClick={() => {
              pay({
              variables: {
                id: this.props.id,
                  dishes: this.state.dishes.map(d => { return { id: d.dish._id, made: d.made, hasPayed: d.paying } }).concat(this.props.payedDishes.map(d => {return { id: d.dish._id, made: d.made, hasPayed: d.hasPayed }}))
              }
            })}}>Pay</Button>

            if (loading)
              result =
                <React.Fragment>
                  <LinearProgress determinate={false}></LinearProgress>
                  {result}
                </React.Fragment>
            if (error) console.error(error);

            if (data) this.props.history.goBack()

            return result
          }}
        </Mutation>
        <Button theme="secondary" onClick={() => this.saveFile(this.state.dishes.filter(d => d.paying).map(d => d.dish))}><ButtonIcon icon="cloud_download" />Download</Button>
    </React.Fragment>)
  }
}