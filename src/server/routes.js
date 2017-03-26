let controllers = require('./controllers')
let api = require('./controllers/api')

module.exports.initialize = function(app, router) {

  router.get('/', controllers.home.index)

  app.use('/', router)

  router.get('/api/orders', api.orders.getOrders)

  router.put('/api/orders', api.orders.updateOrder)

  router.post('/api/orders', api.orders.addOrder)

  router.get('/api/dishes', api.dishes.getDishes)

  router.put('/api/dishes', api.dishes.updateDish)

  router.post('/api/dishes', api.dishes.addDish)
}
