let mongoose = require('mongoose'),
    Schema = mongoose.Schema

let DishSchema = new Schema({
  name:         String,
  cost:         Number,
  type:         Schema.Types.ObjectId,
  description:  String
})

module.exports = mongoose.model('Dish', DishSchema)
