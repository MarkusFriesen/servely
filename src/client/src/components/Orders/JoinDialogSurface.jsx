import React, { Component } from 'react'
import {
  DialogSurface,
  DialogHeader,
  DialogHeaderTitle,
  DialogBody,
  DialogFooter,
  DialogFooterButton
} from 'rmwc/Dialog';
import {
  List,
  ListItem,
  ListItemText,
  ListItemGraphic,
} from 'rmwc/List';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const JOIN = gql`
  mutation join($id: ID!, $ids: [ID]!){
    joinOrders(_id: $id, orderIds: $ids){
      _id,
      name,
      table,
      dishes {
        dish {
          _id,
          name,
          cost
        },
        made,
        hasPayed
      }
    }
  }`

export default class JoinOrderSurface extends Component {
  constructor(){
    super()

    this.handleJoin = this.handleJoin.bind(this)
    this.joinOrders = this.joinOrders.bind(this)
  }
  
  state = {
    people: []
  }

  componentWillReceiveProps(newProps, oldProps){
    if (JSON.stringify(newProps) !== JSON.stringify(oldProps))
      this.setState({
        people: newProps.data.map((o, i) => { return { id: o._id, name: o.name, selected: (this.state.people.length > i ? this.state.people[i].selected : false) } })
      })
  }

  componentDidMount(){
    this.setState({
      people: this.props.data.map(o => {return {id: o._id, name: o.name, selected: false}})
    })
  }

  handleJoin(i){
    return () => {
      const selected = this.state.people
      selected[i].selected = !selected[i].selected
      this.setState({
        people: selected
      })
      
    }
  }

  joinOrders(join){
    return () => {
      const ordersToJoin = this.state.people.filter(s => s.selected).map(s => s.id)
      join({variables: {id: this.props._id, ids: ordersToJoin}})
    }
  }

  render(){
    return (
      <DialogSurface>
        <DialogHeader>
          <DialogHeaderTitle>Everyone at table {this.props.table}</DialogHeaderTitle>
        </DialogHeader>
        <DialogBody>
          <List>
          {
            this.state.people.map((p, i) => 
                <ListItem key={p.id} onClick={this.handleJoin(i)}>
                <ListItemGraphic>{p.selected ? "radio_button_checked" : "radio_button_unchecked"}</ListItemGraphic>
                <ListItemText>{ p.name }</ListItemText>
              </ListItem>
            )
          }
          </List>
        </DialogBody>
        <DialogFooter>
          <DialogFooterButton theme="secondary" cancel>Cancel</DialogFooterButton>
          <Mutation mutation={JOIN}>
            {(join) => 
              <DialogFooterButton accept onClick={this.joinOrders(join)}>Join</DialogFooterButton>
            }
            </Mutation>
        </DialogFooter>
      </DialogSurface>)
  }
}