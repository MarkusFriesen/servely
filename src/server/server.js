let express = require('express'),
    app = express(),
    router = new express.Router(),
    configure = require('./configure'),
    mongoose = require('mongoose'),
    removeOldOrdersJob = require("./removeOldOrdersJob")

app = configure(app)

var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
  socket.on('new:order', function(order){
    io.emit('new:order', order);
  });
  socket.on('deleted:order', function(order){
    io.emit('deleted:order', order);
  });
  socket.on('updated:order', function(order){
    io.emit('updated:order', order);
  });
});


mongoose.connect('mongodb://localhost:27017/reach')
mongoose.connection.on('open', () => {
  console.log('MongoDB connected.')

  http.listen(app.get('port'), function (){
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
  });
})
