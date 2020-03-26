import React, {useState} from 'react'
import {useQuery} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import {Fab} from '@rmwc/fab';
import Masonry from 'react-masonry-component';
import {Link} from 'react-router-dom'

import OrderCard from '../components/orders/OrderCard'
import {observer, inject} from "mobx-react"
import {LinearProgress} from '@rmwc/linear-progress'
import JoinDialog from '../components/orders/JoinDialog'
const GET_ORDERS =
  gql`query order($hasPayed: Boolean) {
  orders(hasPayed: $hasPayed) {
    _id,
    name,
    table,
    notes,
    dishes {
      dish {
        _id,
        name,
        cost,
        type {
          _id,
          name
        }
      },
      made,
      delivered,
      hasPayed,
      extras {
        _id, 
        name
      }
    }
  }
}`

const getLoadingBar = (loading) => loading ? <LinearProgress /> : <></>;

const getFilteredOrders = (orders, filter, props, setJoinProps, setDialogState) => {

  const matchesFilter = new RegExp(filter, "i")

  return orders.filter(o =>
    (!filter || (o.table.toString() === filter) || matchesFilter.test(o.name) || o.dishes.some(d => matchesFilter.test(d.dish.type.name)))
    && (!props.store.kitchenMode || o.dishes.some(d => !d.made))
  ).map((order, i) => (
    <div
      key={i}
      style={{
        width: '-webkit-fill-available',
        maxWidth: '500px',
        minWidth: '320px'
      }}>
      <OrderCard key={order._id} {...order} {...props} openJoinCard={(joinProps) => {
        setJoinProps(joinProps)
        setDialogState(true)
      }}/>
    </div>))
}

const Order = inject("store")(observer((props) => {
  const filter = props.store.searchText

  const [joinProps, setJoinProps] = useState({table: -1})
  const [dialogOpen, setDialogState] = useState(false)

  const {loading, error, data = {orders: []}} = useQuery(GET_ORDERS, {variables: {hasPayed: false}, pollInterval: 500})

  if (error) {
    console.warn(error)
    return <><p>Error :(</p><span>{error.message}</span></>
  }

  return (
    <React.Fragment>
      {getLoadingBar(loading)}
      <Masonry id="masonry-layout">
        {getFilteredOrders(data.orders, filter, props, setJoinProps, setDialogState)}
      </Masonry>
      <JoinDialog dialogOpen={dialogOpen} closeDialog={() => {setDialogState(false)}} {...joinProps} />
      <Link to="/orderDetails">
        <Fab className="floating-right" icon="add" />
      </Link>
      <div className="bottomSpacer" />
    </React.Fragment>
  )
}))

export default Order