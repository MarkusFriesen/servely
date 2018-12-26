import React, { Component } from 'react';
import {
  Card,
  CardPrimaryAction,
  CardAction,
  CardActions,
  CardActionButtons,
  CardActionIcons
} from '@rmwc/card';
import {
  List,
  ListItem,
  ListItemText,
  ListItemGraphic
} from '@rmwc/list';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { Link } from 'react-router-dom'

import { Typography } from 'rmwc/Typography';

import JoinOrder from './JoinDialog'

import './card.css'

const MADE = gql`
  mutation updateOrder($id: ID!, $dishes: [orderDishMutation]!){
    updateOrder(_id: $id, dishes: $dishes){
      _id,
      name,
      table,
      notes,
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

export default class OrderCard extends Component {
  constructor(){
    super()
    this.handleDishMade = this.handleDishMade.bind(this)
  }

  handleDishMade(id, i, made){
    return () => {
      const dishes = this.props.dishes.map(d => {return {id: d.dish._id, made: d.made, hasPayed: d.hasPayed}})
      dishes[i].made = !dishes[i].made
      made({variables: {
        id: id, 
        dishes: dishes
      }})
    }
  }

  render() {
    const props = this.props
    return (
      <Card>
        <Link to={`/orderDetails/${props._id}`}>
          <CardPrimaryAction>
            <div style={{ padding: '0 1rem 1rem 1rem' }}>
              <Typography use="headline6" tag="h2" style={{}}>
                <span className="highlight">{props.table}</span> {props.name}
              </Typography>
            </div>
          </CardPrimaryAction>
        </Link>
        <div style={{ padding: '0 1rem 1rem 1rem' }}>
          <Mutation mutation={MADE}>
            {(made) => 
                <Typography use="body1" tag="div" theme="text-secondary-on-background">
                <List>
                  {props.dishes.map((v, i) =>
                    <ListItem key={i} onClick={this.handleDishMade(props._id, i, made)}>
                      <ListItemGraphic icon={v.made ? "radio_button_checked" : "radio_button_unchecked"}/>
                      <ListItemText>{v.dish.name}</ListItemText>
                    </ListItem>
                  )}
                </List>
              </Typography>
            }
          </Mutation>
        </div>
        <Typography
          use="subtitle1"
          tag="div"
          style={{ padding: '0.5rem 1rem' }}
          theme="text-secondary-on-background"
        >
          {this.props.notes}
        </Typography>
        <CardActions>
          <CardActionButtons>
            <JoinOrder {...this.props}/>
          </CardActionButtons>
          <CardActionIcons>
            <Link to={`/payOrder/${props._id}`}>
              <CardAction icon="credit_card" />
            </Link>
          </CardActionIcons>
        </CardActions>
      </Card>)
  }
}