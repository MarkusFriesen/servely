import Mongoose from 'mongoose';
const Schema = Mongoose.Schema

const dishExtraSchema = Mongoose.Schema({
  name: String,
  cost: Number,
  type: Schema.Types.ObjectId
})

const dishExtra = Mongoose.model('dishExtras', dishExtraSchema);

export default dishExtra