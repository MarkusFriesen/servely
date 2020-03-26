import React, {useState, useEffect} from 'react'
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogButton
} from '@rmwc/dialog';
import {
  List,
  ListItem,
  ListItemText,
  ListItemGraphic,
} from '@rmwc/list';
import gql from "graphql-tag";
import {Mutation} from "react-apollo";

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
        hasPayed,
        extras {
          _id,
          name
        }
      }
    }
  }`

function handleJoin(i, people, setPeople) {
  const selected = people.map((p, idx) => idx === i ? {...p, selected: !p.selected} : p)
  setPeople(selected)
}

function joinOrders(join, people, id) {
  return () => {
    const ordersToJoin = people.filter(s => s.selected).map(s => s.id)
    join({variables: {id: id, ids: ordersToJoin}})
  }
}
const JoinOrderSurface = (props) => {

  const [people, setPeople] = useState(props.data.map(o => ({id: o._id, name: o.name, selected: false})))

  useEffect(() => {
    if (props.data.length !== people.length || props.data.some((p, idx) => p._id !== people[idx].id)) {
      setPeople(props.data.map((o, i) => {return {id: o._id, name: o.name, selected: (people.length > i ? people[i].selected : false)}}))
    }
  }, [props.data, people.length, people])

  return (
    <React.Fragment>
      <DialogTitle>Everyone at table {props.table}</DialogTitle>
      <DialogContent>
        <List>
          {
            people.map((p, i) =>
              <ListItem key={p.id} onClick={() => handleJoin(i, people, setPeople)}>
                <ListItemGraphic icon={p.selected ? "radio_button_checked" : "radio_button_unchecked"} />
                <ListItemText>{p.name}</ListItemText>
              </ListItem>
            )
          }
        </List>
      </DialogContent>
      <DialogActions>
        <DialogButton action="close">Cancel</DialogButton >
        <Mutation mutation={JOIN}>
          {(join) =>
            <DialogButton action="accept" onClick={joinOrders(join, people, props.id)} isDefaultAction>Join</DialogButton >
          }
        </Mutation>
      </DialogActions>
    </React.Fragment>)
}

export default JoinOrderSurface