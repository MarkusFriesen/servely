import Mongoose from 'mongoose';
const Schema = Mongoose.Schema

const OrderSchema = Mongoose.Schema({
  table: Number,
  name: String,
  timestamp: { type: Date, default: Date.now },
  dishes: [{
    id: Schema.Types.ObjectId,
    made: {
      type: Boolean,
      default: false
    },
    hasPayed: {
      type: Boolean,
      default: false
    }
  }],
  hasPayed: {
    type: Boolean,
    default: false
  },
  amountPayed: Number,
  notes: String
})

const Order = Mongoose.model('order', OrderSchema);

export default Order