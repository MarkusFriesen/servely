let mongoose = require('mongoose'),
    Schema = mongoose.Schema

let OrderSchema = new Schema({
  table:        Number,
  name:         String,
  timestamp:    { type: Date, default: Date.now },
  dishes:       [{id: Schema.Types.ObjectId, quantity: Number}],
  made:         Boolean,
  hasPayed:     Boolean,
  amountPayed:  Number
})

module.exports = mongoose.model('Order', OrderSchema)
