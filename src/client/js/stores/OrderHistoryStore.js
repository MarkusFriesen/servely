import { autorun, computed, observable } from "mobx"
import { remove, find, filter } from "lodash"
import moment from "moment"
import Order from "./Order"

import request from 'superagent'

export default class OrderHistoryStore {
  constructor(){
    this.fetchOrders = this.fetchOrders.bind(this)
    this.fetchOrders()
  }

  @observable payedOrders = []

  @observable startDate = moment()
  @observable endDate = moment()

  fetchOrders(){
    request
    .get('/api/orders')
    .query({filter: JSON.stringify({ timestamp: { $gte: this.startDate.toDate(), $lte: this.endDate.toDate() }, hasPayed: "true"  })})
    .end((err, res) => {
      if (err) {
        //TODO: Show error
      } else {
        this.payedOrders.replace(res.body.map(o => new Order(
          {
            table: o.table,
            name:  o.name,
            timestamp: o.timestamp,
            dishes: o.dishes,
            made: o.made,
            hasPayed: o.hasPayed,
            amountPayed: o.amountPayed,
            notes: o.notes,
            _id: o._id
        })))
      }
    })
  }
}