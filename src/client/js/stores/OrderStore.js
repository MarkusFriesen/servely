import { autorun, computed, observable } from "mobx"
import { remove, find, filter } from "lodash"

import request from 'superagent'

class Order {
  @observable table
  @observable _id
  @observable name
  @observable timestamp
  @observable dishes
  @observable made
  @observable hasPayed
  @observable amountPayed
  @observable notes

  constructor({table, name, timestamp, dishes, made, hasPayed, amountPayed, notes, _id}) {
    this.table = table
    this._id = _id || Date.now() + Math.round(Math.random() * 1000)
    this.name = name,
    this.timestamp = timestamp
    this.dishes = dishes
    this.made = made
    this.hasPayed = hasPayed
    this.amountPayed = amountPayed
    this.notes = notes
  }

  update({table, name, timestamp, dishes, made, hasPayed, amountPayed, notes}, onSuccess, onFailure){
    request
      .put('/api/orders')
      .set('Content-Type', 'application/json')
      .send(
        {
          orderId: this._id,
          table: table ? table : this.table,
          name: name ? name : this.name,
          dishes: dishes ? dishes : this.dishes,
          made: made !== undefined ? made : this.made,
          hasPayed:  hasPayed !== undefined ? hasPayed : this.hasPayed,
          amountPayed: amountPayed ? parseFloat(amountPayed) : parseFloat(this.amountPayed || 0),
          notes: notes ? notes : this.notes}
        )
      .end((err, res) => {
        if (err) {
          onFailure(err)
        } else {
          this.table = table ? table : this.table,
          this.name = name ? name : this.name
          this.dishes = dishes ? dishes : this.dishes
          this.made = made !== undefined ? made : this.made
          this.hasPayed = hasPayed !== undefined ? hasPayed : this.hasPayed
          this.amountPayed = amountPayed ? parseFloat(amountPayed) : parseFloat(this.amountPayed || 0)
          this.notes = notes ? notes : this.notes

          socket.emit('updated:order', this.toJSON());
          onSuccess()
        }
      })
  }

  toJSON(){
    return {
      _id: this._id,
      table: this.table,
      name: this.name,
      timestamp: this.timestamp,
      dishes: this.dishes,
      made: this.made,
      hasPayed: this.hasPayed,
      amountPayed: this.amountPayed,
      notes: this.notes
    }
  }
}

export class OrderStore {
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

  @observable orders = [
     new Order(
     {
       table: 1,
       name: "Markus",
       timestamp: Date.now(),
       dishes: [{id:"58833fdc7bb0c19fc957754b", quantity: 2}],
       made: true,
       hasPayed: false,
       amountPayed: 0,
       notes: ""
     }),
      new Order(
     {
       table: 1,
       name: "Elli",
       timestamp: Date.now() + 1,
       dishes: [{id:"58833ff97bb0c19fc957754c", quantity: 2}],
       made: false,
       hasPayed: false,
       amountPayed: 0,
       notes: "Extra pickels. Cream no Sugar. Potatoes on the side. Ketchup with Majyo."
     }),
      new Order(
     {
       table: 1,
       name: "John",
       timestamp: Date.now() + 5,
       dishes: [{id:"58833ff97bb0c19fc957754c", quantity: 2}, {id:"58833fdc7bb0c19fc957754b", quantity: 2}],
       made: false,
       hasPayed: false,
       amountPayed: 0,
       notes: "Extra pickels"
     })]

  @observable filter = ""
  
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
    oldOrder.table = order.table
    oldOrder.name = order.name
    oldOrder.dishes = order.dishes
    oldOrder.made = order.made
    oldOrder.hasPayed = order.hasPayed
    oldOrder.amountPayed = order.amountPayed
    oldOrder.notes = order.notes
  }

  fetchOrders(){
    request
    .get('/api/orders')
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

const store = window.orderStore = new OrderStore
export default store