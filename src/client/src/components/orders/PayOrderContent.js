import React, {useState, useEffect} from 'react'
import {TextField} from '@rmwc/textfield';
import {Button, ButtonIcon} from '@rmwc/button';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
import {LinearProgress} from '@rmwc/linear-progress';
import {Grid, GridCell} from '@rmwc/grid';
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
import {useHistory} from 'react-router-dom';
import CreateReceipt from './CreateReciept';

const PAY = gql`
  mutation pay($id: ID!, $dishes: [orderDishMutation]!, $amountPayed: Float!){
    updateOrder(_id: $id, dishes: $dishes, amountPayed: $amountPayed){
      _id,
      dishes {
        hasPayed
      }
    }
  }`

function toggleSelection(i, dishes, setDishes, setSelectAll) {
  return () => {
    const newDishes = dishes.map((d, idx) => idx === i ? {...d, paying: !d.paying} : d)
    setDishes(newDishes)
    setSelectAll(newDishes.every(d => d.paying))
  }
}

function toggleAll(dishes, setDishes, selectAll, setSelectAll) {
  return () => {
    setDishes(dishes.map(d => ({...d, paying: !d.paying})))
    setSelectAll(selectAll)
  }
}

function changePayment(setPaying) {
  return (e) => {
    if (!isNaN(e.target.value))
      setPaying(!e.target.value ? "" : parseFloat(e.target.value))
  }
}

const PayOrderContent = (props) => {

  const [dishes, setDishes] = useState(props.dishesToPay)
  const [paying, setPaying] = useState(0)
  const [selectAll, setSelectAll] = useState(true)
  const [pay, {data, loading, error}] = useMutation(PAY)
  const history = useHistory()

  useEffect(() => {
    if (props.dishesToPay.length === 0) return
    if (props.dishesToPay.length === dishes.length && props.dishesToPay.every((d, idx) => d._id === dishes[idx]._id)) return

    setDishes(props.dishesToPay.map(m => ({
      ...m,
      paying: false
    })))
  }, [props.dishesToPay, props.dishesToPay.length, dishes.length, dishes])
  const {id} = props

  let total = 0

  let result = <Button onClick={() => {
    pay({
      variables: {
        id: props.id,
        dishes: dishes.map(d => {
          return {
            id: d.dish._id,
            made: d.made,
            hasPayed: d.paying,
            delivered: d.delivered,
            extras: d.extras.map(e => e._id)
          }
        }).concat(props.payedDishes.map(d => {
          return {
            id: d.dish._id,
            made: d.made,
            hasPayed: d.hasPayed,
            delivered: d.delivered,
            extras: d.extras.map(e => e._id)
          }
        })),
        amountPayed: paying
      }
    })
  }
  } disabled={!paying} > Pay </Button>

  if (loading)
    result =
      <React.Fragment>
        <LinearProgress />
        {result}
      </React.Fragment>
  if (error) {
    console.error(error);
  }
  if (data && data.updateOrder && data.updateOrder.dishes.reduce((a, c) => a && c.hasPayed, true)) {
    history.goBack()
  }

  return (
    <React.Fragment>
      <List className="no-print">
        <ListItem key={-1} onClick={toggleAll(dishes, setDishes, selectAll, setSelectAll)}>
          <ListItemGraphic icon={selectAll ? "radio_button_checked" : "radio_button_unchecked"} />
          <ListItemText>Everything</ListItemText>
        </ListItem>

        <ListDivider />
        {dishes.map((v, i) => {
          const extraCost = v.extras.reduce((a, e) => a + e.cost, 0);
          if (v.paying)
            total = v.dish.cost + total + extraCost

          return (
            <ListItem key={i} onClick={toggleSelection(i, dishes, setDishes, setSelectAll)}>
              <ListItemGraphic icon={v.paying ? "radio_button_checked" : "radio_button_unchecked"} />
              <ListItemText>
                <ListItemPrimaryText>{v.dish.name}</ListItemPrimaryText>
                <ListItemSecondaryText>{v.extras.map(e => e.name).join(", ")}</ListItemSecondaryText>
              </ListItemText>
              <ListItemMeta tag="span" basename="">{(v.dish.cost + extraCost).toFixed(2)}</ListItemMeta>
            </ListItem>)
        })}
      </List>
      < Grid className="no-print">
        <GridCell span="12">
          <TextField icon="euro_symbol" disabled label="Total" value={total.toFixed(2)} />
          <TextField icon="euro_symbol" label="Difference" value={(paying - total).toFixed(2)} onChange={() => {}} invalid={paying - total < 0} />
          <TextField icon="euro_symbol" label="Paying" type="number" inputMode="numeric" pattern="\d*.*,*\d*" value={paying} invalid={!paying} onChange={changePayment(setPaying)} />
        </GridCell>
      </Grid>
      <div className="no-print">
        {result}
        <Button theme="secondary" onClick={window.print}><ButtonIcon icon="receipt" />Print</Button>
      </div>
      <div className="print">{CreateReceipt(dishes.filter(d => d.paying), id)}</div>
    </React.Fragment>)
}

export default PayOrderContent