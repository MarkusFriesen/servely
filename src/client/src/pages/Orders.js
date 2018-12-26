import React, { Component } from 'react'
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Fab } from '@rmwc/fab';
import Masonry from 'react-masonry-component';
import { Link } from 'react-router-dom'

import OrderCard from '../components/orders/OrderCard'
import { observer, inject } from "mobx-react"
import { LinearProgress } from '@rmwc/linear-progress'

class Order extends Component {
  render() {
    const filter = this.props.store.searchText
    const matchesFilter = new RegExp(filter, "i")

    return (
      <React.Fragment>
        <Query
          query={gql`query order($hasPayed: Boolean) {
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
                  hasPayed
                }
              }
            }`}
          variables={{ hasPayed: false }}
          pollInterval={500}>
          {({ loading, error, data }) => {
            if (!data || !data.orders)
              data = {orders: []}
            let result = <Masonry id="masonry-layout">
              {
                data.orders.filter(o => {
                  return (!filter || (o.table.toString() === filter) || matchesFilter.test(o.name) || o.dishes.some(d => matchesFilter.test(d.dish.type.name))) &&
                    (!this.props.store.kitchenMode || o.dishes.some(d => !d.made))
                }).map((order, i) => {

                  return (<div
                    key={i}
                    style={{
                      width: '-webkit-fill-available',
                      maxWidth: '500px',
                      minWidth: '320px'
                    }}>
                    <OrderCard key={order._id} {...order} {...this.props} />
                    
                  </div>)
                })
              }
            </Masonry>

            if (loading) result = 
              <React.Fragment>
                <LinearProgress determinate={false}></LinearProgress>
                {result}
              </React.Fragment>
            if (error){
              console.warn(error)
              return <p>Error :(</p>;
            } 

            return result
            
          }}
        </Query>

        <Link to="/orderDetails">
          <Fab className="floating-right" icon="add" />
        </Link>
        <div className="bottomSpacer"/>
      </React.Fragment>
    )
  }
}

export default inject("store")(observer(Order))