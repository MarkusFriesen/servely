import { autorun, computed, observable } from "mobx"
import { remove, find, filter } from "lodash"
import Order from "./Order"

import request from 'superagent'

export default class OrderStore {
  constructor(){
    this.getOrder = this.getOrder.bind(this)
    this.fetchOrders = this.fetchOrders.bind(this)
    this.addReceivedOrder = this.addReceivedOrder.bind(this)
    this.deleteReceivedOrder = this.deleteReceivedOrder.bind(this)
    this.updateReceivedOrder = this.updateReceivedOrder.bind(this)
    this.fetchOrders()
    socket.on('new:order', this.addReceivedOrder);
    socket.on('deleted:order', this.deleteReceivedOrder);
    socket.on('updated:order', this.updateReceivedOrder);
  }

  @observable orders = []

  @observable filter = ""
  @observable undoText = ""
  @observable undoAction = () => {}
  
  @computed get filteredOrders() {
    const matchesFilter = new RegExp(this.filter, "i")
    return filter(this.orders, o => (!this.filter || (o.table == this.filter) || matchesFilter.test(o.name)) &&
                                    (!this.kitchenMode || !o.made));
  }

  @observable kitchenMode = localStorage.getItem('kitchenMode') == 'true'
  
  setKitchenMode(value){
    localStorage.setItem('kitchenMode', value)
    this.kitchenMode = localStorage.getItem('kitchenMode') == 'true'
  }

  getOrder(id) {
    return find(this.orders, (d) => d._id == id )
  }

  getOrderByIds(ids){
    return this.orders.filter(o => ids.includes(o._id))
  }

  add({table, name, notes, made, dishes}, onSuccess, onFailure){
    request
      .post('/api/orders')
      .set('Content-Type', 'application/json')
      .send({table: table, name: name, dishes: dishes, notes: notes, made: made || false})
      .end((err, res) => {
        if (err) {
          onFailure(err)
        } else {
          const order = new Order(
            {
              table: res.body.table,
              name: res.body.name,
              timestamp: res.body.timestamp,
              dishes: res.body.dishes,
              made: res.body.made,
              hasPayed: res.body.hasPayed,
              amountPayed: res.body.amountPayed,
              notes: res.body.notes,
              _id: res.body._id
            })
          this.orders.push(order)
          socket.emit('new:order', order.toJSON());
          onSuccess()
        }
      }
    )
  }

  remove(id, onSuccess, onFailure){
    request
      .delete('/api/orders')
      .set('Content-Type', 'application/json')
      .send({orderId: id})
      .end((err, res) => {
        if (err){
          onFailure(err)
        } else {
          this.orders.replace(this.orders.filter( o => o._id != id))

          socket.emit('deleted:order', {_id: id});
          onSuccess()
        }
      })
  }

  addReceivedOrder(order){
    if (!find(this.orders, {_id: order._id})){
      this.orders.push(new Order(
        { table: order.table,
          name: order.name,
          timestamp: order.timestamp,
          dishes: order.dishes,
          made: order.made,
          hasPayed: order.hasPayed,
          amountPayed: order.amountPayed,
          notes: order.notes,
          _id: order._id
        }))
    }
  }

  deleteReceivedOrder(order){
    this.orders.replace(this.orders.filter( o => o._id != order._id))
  }

  updateReceivedOrder(order){  
    const oldOrder = this.getOrder(order._id)

    if (order.hasPayed){
      this.orders.replace(this.orders.filter( o => o._id != order._id))
    } else if (oldOrder) {
      oldOrder.table = order.table
      oldOrder.name = order.name
      oldOrder.dishes = order.dishes
      oldOrder.made = order.made
      oldOrder.hasPayed = order.hasPayed
      oldOrder.amountPayed = order.amountPayed
      oldOrder.notes = order.notes
    } else {
      this.orders.push(new Order(order))
    }
  }

  fetchOrders(){
    request
    .get('/api/orders')
    .query({ filter: JSON.stringify({ hasPayed: false })})
    .end((err, res) => {
      if (err) {
        //TODO: Show error
      } else {
        this.orders.replace(res.body.map(o => new Order(
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
