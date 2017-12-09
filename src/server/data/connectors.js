import Mongoose from 'mongoose'
import config from "..\config"

const mongo = Mongoose.connect(config.mongodb)
