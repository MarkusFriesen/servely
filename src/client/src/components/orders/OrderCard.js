import React from 'react';
import {
  Card,
  CardPrimaryAction,
  CardActionIcon,
  CardActions,
  CardActionButtons,
  CardActionButton,
  CardActionIcons
} from '@rmwc/card';
import {
  List,
  SimpleListItem
} from '@rmwc/list';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
import {Link} from 'react-router-dom';

import {observer, inject} from "mobx-react";
import {Typography} from '@rmwc/typography';

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

function handleDishClick(id, i, made, props) {
  return () => {
    const dishes = props.dishes.map(d => ({id: d.dish._id, made: d.made, hasPayed: d.hasPayed, delivered: d.delivered, extras: d.extras.map(e => e._id)}))

    if (props.store.kitchenMode) {
      if (dishes[i].delivered) return;
      dishes[i].made = !dishes[i].made;
    } else {
      if (!dishes[i].made) return;
      dishes[i].delivered = !dishes[i].delivered;
    }

    made({
      variables: {
        id: id,
        dishes: dishes
      }
    })
  }
}

function getDishes(props, made) {
  return props.dishes.map((v, i) => {
    const disabledKitchen = props.store.kitchenMode && v.delivered;
    const disabledServer = !props.store.kitchenMode && !v.made;
    return (
      <SimpleListItem key={i} className={v.delivered ? "done" : ""}
        graphic={
          v.made ? (v.delivered ? "done_all" : "done") : "radio_button_unchecked"
        }
        onClick={handleDishClick(props._id, i, made, props)}
        disabled={disabledKitchen || disabledServer}
        text={v.dish.name}
        secondaryText={v.extras.map(e => e.name).join(", ")}
        ripple={v.made} />)
  })
}

const OrderCard = (props) => {
  const [made] = useMutation(MADE);
  return (
    <Card>
      <Link to={`/orderDetails/${props._id}`}>
        <CardPrimaryAction>
          <div style={{padding: '0 1rem 1rem 1rem'}}>
            <Typography use="headline6" tag="h2" style={{}}>
              <span className="highlight">{props.table}</span> {props.name}
            </Typography>
          </div>
        </CardPrimaryAction>
      </Link>
      <div style={{padding: '0 1rem 1rem 1rem'}}>
        <Typography use="body1" tag="div" theme="textSecondaryOnBackground">
          <List className="extendSecondaryText">
            {getDishes(props, made)}
          </List>
        </Typography>
      </div>
      <Typography
        use="subtitle1"
        tag="div"
        style={{padding: '0.5rem 1rem'}}
        theme="textSecondaryOnBackground"
      >
        {props.notes}
      </Typography>
      <CardActions>
        <CardActionButtons>
          <CardActionButton onClick={_ => props.openJoinCard(props)} >
            Join
          </CardActionButton>
        </CardActionButtons>
        <CardActionIcons>
          <Link to={`/payOrder/${props._id}`}>
            <CardActionIcon icon="credit_card" />
          </Link>
        </CardActionIcons>
      </CardActions>
    </Card>)
}

export default inject("store")(observer(OrderCard))
