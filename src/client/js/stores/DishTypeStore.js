import { computed, observable } from "mobx"
import { remove, find, filter } from "lodash"
import request from 'superagent'

class DishType {
  @observable _id
  @observable name

  constructor(name, _id) {
    this._id = _id || Date.now()
    this.name = name
  }

  update(name){
    this.name = name
  }
}

export class DishTypeStore {
  constructor(){
      this.fetchDishTypes()
  }
  @observable dishTypes = [ ];

  fetchDishTypes(){
  request
    .get('/api/dishTypes')
    .end((err, res) => {
      if (err) {
        //TODO:Show error
        console.error(err)
      } else {
        console.warn(res.body)
        this.dishTypes.replace(res.body.map(d => new DishType(d.name, d._id)))
      }
    })
  }

  createDishType(name, onSuccess, onFailure){
    request
      .post('/api/dishTypes')
      .set('Content-Type', 'application/json')
      .send({name: name })
      .end((err, res) => {
        if (err) {
          console.error(err)
          onFailure(err)
        } else {
          console.warn(res.body)
          this.dishTypes.push(new DishType(res.body.name, res.body._id))
          onSuccess()
        }
      })
  }

  updateDishType(id, name, onSuccess, onFailure){
    request
      .put('/api/dishTypes')
      .set('Content-Type', 'application/json')
      .send({id: id, name: name})
      .end((err, res) => {
        if (err) {
          console.error(err)
          onFailure(err)
        } else {
          const dishType = this.getDishType(id)
          dishType.update(res.body.name)

          onSuccess()
        }
      })
  }

  removeDishType(id, onSuccess, onFailure){
    request
      .delete('/api/dishTypes')
      .set('Content-Type', 'application/json')
      .send({id: id})
      .end((err, res) => {
        if (err){
          onFailure(err)
        } else {
          this.dishTypes.replace(this.dishTypes.filter( d => d._id != id))
          onSuccess()
        }
      })
  }

  getDishType(id) {
    return find(this.dishTypes, { _id: id })
  }

  getdishTypesByIds(ids){
    return this.dishTypes.filter((d) => ids.includes(d._id))
  }
}
const store = window.dishTypeStore = new DishTypeStore
export default store
