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

  update(name, onSuccess, onFailure){
    request
      .put('/api/dishTypes')
      .set('Content-Type', 'application/json')
      .send({id: id, name: name})
      .end((err, res) => {
        if (err) {
          console.error(err)
          onFailure(err)
        } else {          
          this.name = res.body.name

          onSuccess()
        }
      })
  }
}

export class DishTypeStore {
  constructor(){
    this.fetchDishTypes()
  }

  @observable dishTypes = [new DishType("Quick Eats", "58833fdc7bb0c19fc957754c"), 
  new DishType("Mains", "58833fdc7bb0c19fc957754d") ]

  @observable filter = ""
  
  @computed get filteredDishTypes() {
    var matchesFilter = new RegExp(this.filter, "i")
    return filter(this.dishTypes, d => (!this.filter || matchesFilter.test(d.name)));
  }

  fetchDishTypes(){
    request
      .get('/api/dishTypes')
      .end((err, res) => {
        if (err) {
          //TODO:Show error
          console.error(err)
        } else {
          this.dishTypes.replace(res.body.map(d => new DishType(d.name, d._id)))
        }
      })
  }

  getDishType(id) {
    return find(this.dishTypes, d => d._id == id)
  }

  getdishTypesByIds(ids){
    return this.dishTypes.filter((d) => ids.includes(d._id))
  }

  add(name, onSuccess, onFailure){
    request
      .post('/api/dishTypes')
      .set('Content-Type', 'application/json')
      .send({name: name })
      .end((err, res) => {
        if (err) {
          console.error(err)
          onFailure(err)
        } else {
          this.dishTypes.push(new DishType(res.body.name, res.body._id))
          onSuccess()
        }
      })
  }
 
  remove(id, onSuccess, onFailure){
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
}
const store = window.dishTypeStore = new DishTypeStore
export default store