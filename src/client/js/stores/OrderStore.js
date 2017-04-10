import { autorun, computed, observable } from "mobx"
import { remove, find, filter } from "lodash"
import request from 'superagent'
var socket = io.connect();

class Order {
  @observable table
  @observable _id
  @observable name
  @observable timestamp
  @observable dishes
  @observable made
  @observable hasPayed
  @observable amountPayed

  constructor(table, name, timestamp, dishes, made, hasPayed, amountPayed, _id) {
    this.table = table
    this._id = _id || Date.now()
    this.name = name,
    this.timestamp = timestamp
    this.dishes = dishes
    this.made = made
    this.hasPayed = hasPayed
    this.amountPayed = amountPayed
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
      amountPayed: this.amountPayed
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
  @observable kitchenMode = localStorage.getItem('kitchenMode') == 'true'
  @observable orders = [new Order(1, "Markus", Date.now(), [{id:"58833fdc7bb0c19fc957754b", quantity: 2}], false, false, 0)]
                        //new Order(2, "Elli", Date.now(), [{id:"58833fdc7bb0c19fc957754b", quantity: 1}], false, false, 0),
                        //new Order(3, "John", Date.now(), [{id:"58833fdc7bb0c19fc957754b", quantity: 3}], true, false, 0)];
  @observable filter = ""

  setKitchenMode(value){
    localStorage.setItem('kitchenMode', value)
    this.kitchenMode = localStorage.getItem('kitchenMode') == 'true'
  }

  @computed get filteredOrders() {
    var matchesFilter = new RegExp(this.filter, "i")
    return filter(this.orders, o => (!this.filter || (o.table == this.filter) || matchesFilter.test(o.name)) &&
                                    (!this.kitchenMode || !o.made));
  }

  addReceivedOrder(order){
    if (!find(this.orders, {_id: order._id})){
      this.orders.push(new Order(order.table, order.name, order.timestamp, order.dishes, order.made, order.hasPayed, order.amountPayed, order._id))
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
  }

  fetchOrders(){
    request
    .get('/api/orders')
    .end((err, res) => {
      if (err) {
        //TODO: Show error
      } else {
        this.orders.replace(res.body.map(o => new Order(o.table, o.name, o.timestamp, o.dishes, o.made, o.hasPayed, o.amountPayed, o._id)))
      }
    })
  }

  createOrder(table, name, dishes, onSuccess, onFailure){
    request
      .post('/api/orders')
      .set('Content-Type', 'application/json')
      .send({table: table, name: name, dishes: dishes})
      .end((err, res) => {
        if (err) {
          onFailure(err)
        } else {
          const order = new Order(res.body.table, res.body.name, res.body.timestamp, res.body.dishes, res.body.made, res.body.hasPayed, res.body.amountPayed, res.body._id)
          this.orders.push(order)
          socket.emit('new:order', order.toJSON());
          onSuccess()
        }
      })
  }

  updateOrder(id, table, name, dishes, made, hasPayed, amountPayed, onSuccess, onFailure){
    request
      .put('/api/orders')
      .set('Content-Type', 'application/json')
      .send({orderId: id, table: table, name: name, dishes: dishes, made: made, hasPayed: hasPayed, amountPayed: parseFloat(amountPayed || 0)})
      .end((err, res) => {
        if (err) {
          onFailure(err)
        } else {
          const order = this.getOrder(id)
          order.table = table
          order.name = name
          order.dishes = dishes
          order.made = made
          order.hasPayed = hasPayed
          order.amountPayed = amountPayed

          socket.emit('updated:order', order.toJSON());
          onSuccess()
        }
      })
  }

  deleteOrder(id, onSuccess, onFailure){
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

  clearPayed= () => {
    const unpayedOrders = this.orders.filter(order => !order.hasPayed)
    this.orders.replace(unpayedOrders)
  }

  getOrder(id) {
    return find(this.orders, { _id: id })
  }
}
const store = window.orderStore = new OrderStore
export default store

autorun(() => {
  store.orders[0]
})
