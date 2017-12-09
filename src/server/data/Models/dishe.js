import Mongoose from 'mongoose';

const DishSchema = Mongoose.Schema({
  name: String,
  cost: Number,
  type: Schema.Types.ObjectId,
  description: String
})

const Dish = Mongoose.model('dishTypes', dishTypeSchema);

export default Dish