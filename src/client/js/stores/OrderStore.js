import { autorun, computed, observable } from "mobx"
import { remove, find, filter } from "lodash"

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
  }
  @observable orders = [new Order(0, "markus", Date.now(), [{id:"58833fdc7bb0c19fc957754b", quantity: 2}], false, false, 0)];
  @observable filter = ""

  @computed get filteredOrders() {
    var matchesFilter = new RegExp(this.filter, "i")
    return filter(this.orders, o => !this.filter || (o.table == this.filter) || matchesFilter.test(o.name));
  }

  createOrder(table, name, dishes, onSuccess, onFailure){
    this.orders.push(new Order(table, name, Date.now(), dishes, false, false, 0))

    onSuccess()
  }

  updateOrder(id, table, name, dishes, onSuccess, onFailure){
    const order = this.getOrder(id)
    order.table = table
    order.name = name
    order.dishes = dishes

    onSuccess()
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
