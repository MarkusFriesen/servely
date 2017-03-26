import { computed, observable } from "mobx"
import { remove, find, filter } from "lodash"

class Dish {
  @observable _id
  @observable name
  @observable description
  @observable type
  @observable cost

  constructor(name, description, type, cost,  _id) {
    this._id = _id || Date.now()
    this.name = name,
    this.description = description
    this.type = type
    this.cost = parseFloat(cost)
  }

  update(name, description, type, cost){
    this.name = name
    this.description = description
    this.type = type
    this.cost = parseFloat(cost)
  }
}

export class DishStore {
  @observable dishes = [new Dish("Simple Salad", "(Shellsburg, IA) chili, garlic, lime" , "Quick Eats", 6, "58833fdc7bb0c19fc957754b" ),
    new Dish("Orzo Salad", "house pickles, mustard seed, fried chili flake (if fried served w/ blue chz dressing)", "Quick Eats",9.50, "58833ff97bb0c19fc957754c")
  ];

  createDish(name, cost, description, type, onSuccess, onFailure){
    this.dishes.push(new Dish(name, description, type, cost))

    onSuccess()
  }

  updateDish(id, name, cost, description, type, onSuccess, onFailure){
    const dish = this.getDish(id)
    dish.update(name, description, type, cost)

    onSuccess()
  }

  getDish(id) {
    return find(this.dishes, { _id: id })
  }

  getDishesByIds(ids){
    return this.dishes.filter((d) => ids.includes(d._id))
  }
}
const store = window.orderStore = new DishStore
export default store
