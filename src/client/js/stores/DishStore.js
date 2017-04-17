import { computed, observable } from "mobx"
import { remove, find, filter } from "lodash"
import request from 'superagent'

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
  constructor(){

      this.fetchDishes()
  }
  @observable dishes = [new Dish("Simple Salad", "(Shellsburg, IA) chili, garlic, lime" , "Quick Eats", 6, "58833fdc7bb0c19fc957754b" ),
    new Dish("Orzo Salad", "house pickles, mustard seed, fried chili flake (if fried served w/ blue chz dressing)", "Quick Eats",9.50, "58833ff97bb0c19fc957754c")
  ];

  fetchDishes(){
    request
      .get('/api/dishes')
      .end((err, res) => {
        if (err) {
          //TODO:Show error
          console.error(err)
        } else {
          this.dishes.replace(res.body.map(d => new Dish(d.name, d.description, d.type, d.cost, d._id)))
        }
      })
  }

  createDish(name, cost, description, type, onSuccess, onFailure){
    request
      .post('/api/dishes')
      .set('Content-Type', 'application/json')
      .send({name: name, cost: cost, description: description, type: type})
      .end((err, res) => {
        if (err) {
          console.error(err)
          onFailure(err)
        } else {
          this.dishes.push(new Dish(res.body.name, res.body.description, res.body.type, res.body.cost, res.body._id))
          onSuccess()
        }
      })
  }

  updateDish(id, name, cost, description, type, onSuccess, onFailure){
    request
      .put('/api/dishes')
      .set('Content-Type', 'application/json')
      .send({id: id, name: name, cost: cost, description: description, type: type})
      .end((err, res) => {
        if (err) {
          console.error(err)
          onFailure(err)
        } else {
          const dish = this.getDish(id)
          dish.update(res.body.name, res.body.description, res.body.type, res.body.cost)

          onSuccess()
        }
      })
  }

  deleteDish(id, onSuccess, onFailure){
    request
      .delete('/api/dishes')
      .set('Content-Type', 'application/json')
      .send({dishId: id})
      .end((err, res) => {
        if (err){
          onFailure(err)
        } else {
          this.dishes.replace(this.dishes.filter( d => d._id != id))
          onSuccess()
        }
      })
  }

  getDish(id) {
    return find(this.dishes, { _id: id })
  }

  getDishesByIds(ids){
    return this.dishes.filter((d) => ids.includes(d._id))
  }
}
const store = window.dishStore = new DishStore
export default store
