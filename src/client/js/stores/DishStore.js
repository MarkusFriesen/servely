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

  update({name, description, type, cost}, onSuccess, onFailure){
    request
      .put('/api/dishes')
      .set('Content-Type', 'application/json')
      .send({id: id, name: name, cost: cost, description: description, type: type})
      .end((err, res) => {
        if (err) {
          console.error(err)
          onFailure(err)
        } else {

          this.name = res.body.name
          this.description = res.body.description
          this.type = res.body.type
          this.cost = parseFloat(res.body.cost)

          onSuccess()
        }
      })
  }
}

export class DishStore {
  constructor(){
    this.fetchDishes()
  }

  @observable dishes = [
    new Dish("Simple Salad", "(Shellsburg, IA) chili, garlic, lime" , "58833fdc7bb0c19fc957754c", 6, "58833fdc7bb0c19fc957754b" ),
    new Dish("Steak", "Argentinan Steak Cooked to your liking" , "58833fdc7bb0c19fc957754d", 6, "58833fdc7bb0c19fc957752d" ),
    new Dish("Burger with Fries", "Beef, cheese, Lettuce, Tomatoes" , "58833fdc7bb0c19fc957754d", 6, "58833fdc8bb0c19fc957754d" ),
    new Dish("Orzo Salad", "house pickles, mustard seed, fried chili flake (if fried served w/ blue chz dressing)", "58833fdc7bb0c19fc957754c",9.50, "58833ff97bb0c19fc957754c")
  ];

  @observable filter = ""
  
  @computed get filteredDishes() {
    var matchesFilter = new RegExp(this.filter, "i")
    return filter(this.dishes, o => (!this.filter ||  matchesFilter.test(o.name)));
  }

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

  getDish(id) {
    return find(this.dishes, d =>  d._id == id )
  }

  getDishesByIds(ids){
    return this.dishes.filter((d) => ids.includes(d._id))
  }

  add({name, description, type, cost}, onSuccess, onFailure){
    request
      .post('/api/dishes')
      .set('Content-Type', 'application/json')
      .send({name: name, cost: cost, description: description, type: type})
      .end((err, res) => {
        if (err) {
          console.error(err)
          onFailure(err)
        } else {
          this.dishes.push(new Dish(res.body.name, res.body.description, res.body.type, parseFloat(res.body.cost), res.body._id))
          onSuccess()
        }
      })
  }

  remove(id, onSuccess, onFailure){
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

}

const store = window.dishStore = new DishStore
export default store