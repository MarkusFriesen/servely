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
      .send({id: this._id, name: name, cost: cost, description: description, type: type})
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

  @observable dishes = [];

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