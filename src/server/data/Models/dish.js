import Mongoose from 'mongoose';
const Schema = Mongoose.Schema

const DishSchema = Mongoose.Schema({
  name: String,
  cost: Number,
  type: Schema.Types.ObjectId,
  description: String,
  deselectedExtras: [Schema.Types.ObjectId]
})

const Dish = Mongoose.model('dish', DishSchema);

export default Dish