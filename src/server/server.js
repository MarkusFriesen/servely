let express = require('express'),
    app = express(),
    router = new express.Router(),
    configure = require('./configure'),
    mongoose = require('mongoose')

app = configure(app)

mongoose.connect('mongodb://localhost:27017/reach')
mongoose.connection.on('open', () => {
  console.log('MongoDB connected.')

  app.listen('3300', () => {
    console.log(`Server listening at http://localhost:3300`)
  })
})
