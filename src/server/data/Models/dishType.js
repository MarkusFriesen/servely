import Mongoose from 'mongoose';

const DishTypeSchema = Mongoose.Schema({
  name: String
})

const DishType = Mongoose.model('dishTypes', dishTypeSchema);

export default DishType