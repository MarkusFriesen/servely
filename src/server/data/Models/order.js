import Mongoose from 'mongoose';

const OrderSchema = Mongoose.Schema({
  table: Number,
  name: String,
  timestamp: { type: Date, default: Date.now },
  dishes: [{ id: Schema.Types.ObjectId, made: Boolean }],
  hasPayed: Boolean,
  amountPayed: Number,
  notes: String
})

const Order = Mongoose.model('dishTypes', OrderSchema);

export default Order