import { autorun, computed, observable } from "mobx"
import { remove, find, filter } from "lodash"

import request from 'superagent'

export default class Order {
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