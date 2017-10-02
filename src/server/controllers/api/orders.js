let Models = require('../../models'),
    ObjectId = require('mongoose').Types.ObjectId

module.exports = {
  getOrders(req, res) {
    const filter = req.query
    Models.Orders.find(filter || {}, (err, orders) => {
      if (orders.length) {
        res.json(orders)
      } else {
        res.json([])
      }
    })
  },
  getOrderById(req, res) {
    Models.Orders.find({"_id" : req.body.orderid }, (err, orders) => {
      if (orders.length) {
        res.json(orders[0])
      } else {
        res.json([])
      }
    })
  },
  addOrder(req, res) {
    Models.Orders.create({
        table: req.body.table,
        name: req.body.name,
        dishes: req.body.dishes,
        made: req.body.made || false,
        hasPayed: false,
        notes: req.body.notes
      }, (err, order) => {
      if (err) {
        console.warn(err)
        res.status(500).json({error: err})
      } else {
        res.status(200).json(order)
      }
    })
  },
  deleteOrder(req, res){
    Models.Orders.remove({ "_id" : req.body.orderId }, (err, order) => {
      if (err){
        console.error(err)
        res.status(500).json({error: err})
      } else {
          res.status(200).json(order)
      }
    })
  },
  updateOrder(req, res) {
    Models.Orders.findOneAndUpdate({"_id" : req.body.orderId }, {$set: {
      table: req.body.table,
      name: req.body.name,
      dishes: req.body.dishes,
      made: req.body.made || false,
      hasPayed: req.body.hasPayed || false,
      amountPayed: req.body.amountPayed || 0,
      notes: req.body.notes
    }}, {new: true},  (err, order) => {
    if (err) {
      console.warn(err)
      res.status(500).json({error: err})
    } else {
      res.status(200).json(order)
    }
  })
  }
}
