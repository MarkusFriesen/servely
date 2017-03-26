let Models = require('../../models'),
    ObjectId = require('mongoose').Types.ObjectId

module.exports = {
  getOrders(req, res) {
    Models.Orders.find({}, (err, orders) => {
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
        made: false,
        hasPayed: false
      }, (err, order) => {
      if (err) {
        console.warn(err)
        res.status(500).json({error: err})
      } else {
        res.status(200).json(order)
      }
    })
  },

  updateOrder(req, res) {
    console.warn(req.body)
    Models.Orders.findOneAndUpdate({"_id" : req.body.orderId }, {$set: {
      table: req.body.table,
      name: req.body.name,
      dishes: req.body.dishes,
      made: req.body.made || false,
      hasPayed: req.body.hasPayed || false,
      amountPayed: req.body.amountPayed || 0
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
