let mongoose = require('mongoose'),
    Schema = mongoose.Schema

let DishTypeSchema = new Schema({
  name:         String
})

module.exports = mongoose.model('DishType', DishTypeSchema)
