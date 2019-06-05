import React, { Component } from 'react';
import {
  Card,
  CardPrimaryAction,
  CardActionIcon,
  CardActions,
  CardActionButtons,
  CardActionIcons
} from '@rmwc/card';
import {
  List,
  SimpleListItem
} from '@rmwc/list';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { Link } from 'react-router-dom';

import { observer, inject } from "mobx-react";

import { Typography } from '@rmwc/typography';

import JoinOrder from './JoinDialog';

import './card.css';

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
        delivered,
        hasPayed
      }
    }
  }`

class OrderCard extends Component {
  constructor(){
    super()
    this.handleDishClick = this.handleDishClick.bind(this)
  }

  handleDishClick(id, i, made){
    return () => {
      const dishes = this.props.dishes.map(d => {return {id: d.dish._id, made: d.made, hasPayed: d.hasPayed, delivered: d.delivered, extras: d.extras.map(e => e._id)}})

      if (this.props.store.kitchenMode){
        if (dishes[i].delivered) return;
        dishes[i].made = !dishes[i].made;
      } else {
        if (!dishes[i].made) return;
        dishes[i].delivered = !dishes[i].delivered;
      }

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
                <Typography use="body1" tag="div" theme="textSecondaryOnBackground">
                <List className="extendSecondaryText">
                  {props.dishes.map((v, i) =>{
                    const disabledKitchen = this.props.store.kitchenMode && v.delivered;
                    const disabledServer = !this.props.store.kitchenMode && !v.made;
                    return (
                    <SimpleListItem key={i} className={v.delivered ? "done" : ""} 
                      graphic = {
                        v.made ? (v.delivered ? "done_all" : "done") : "radio_button_unchecked"
                      }
                      onClick={this.handleDishClick(props._id, i, made)} 
                      disabled = {disabledKitchen || disabledServer}
                      text={v.dish.name}
                      secondaryText={v.extras.map(e => e.name).join(", ")}
                      ripple={v.made} />)}
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
          theme="textSecondaryOnBackground"
        >
          {this.props.notes}
        </Typography>
        <CardActions>
          <CardActionButtons>
            <JoinOrder {...this.props}/>
          </CardActionButtons>
          <CardActionIcons>
            <Link to={`/payOrder/${props._id}`}>
              <CardActionIcon icon = "credit_card" />
            </Link>
          </CardActionIcons>
        </CardActions>
      </Card>)
  }
}

export default inject("store")(observer(OrderCard))
