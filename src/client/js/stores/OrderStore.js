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
}

export class OrderStore {
  constructor(){
    this.getOrder = this.getOrder.bind(this)

    this.fetchOrders()
  }
  @observable orders = [new Order(0, "markus", Date.now(), [{id:"58833fdc7bb0c19fc957754b", quantity: 2}], false, false, 0)];
  @observable filter = ""

  @computed get filteredOrders() {
    var matchesFilter = new RegExp(this.filter, "i")
    return filter(this.orders, o => !this.filter || (o.table == this.filter) || matchesFilter.test(o.name));
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
          this.orders.push(new Order(res.body.table, res.body.name, res.body.timestamp, res.body.dishes, res.body.made, res.body.hasPayed, res.body.amountPayed, res.body._id))
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
