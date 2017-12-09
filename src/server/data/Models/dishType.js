import Mongoose from 'mongoose';

const DishTypeSchema = Mongoose.Schema({
  name: String
})

const DishType = Mongoose.model('dishTypes', DishTypeSchema);

export default DishType