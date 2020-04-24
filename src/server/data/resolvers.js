import {
  getOrder,
  getDish,
  getDishType,
  getDishExtra
} from './Models'
import config from '../config'
import low from 'lowdb';
import FileSync from 'lowdb/adapter/FileSync'
import {enableExperimentalFragmentVariables} from 'graphql-tag';

const adapter = new FileSync(config.LOWDB_PATH)
const db = low(adapter)
db.defaults({})


const resolvers = {
  Query: {
    orders(_, args) {

      let items = db.get(config.tables.order)
      if (args.fromTimestamp || args.toTimestamp) {
        const {
          fromTimestamp = new Date(0).toISOString(),
          toTimestamp = new Date().toISOString()
        } = args

        delete args.fromTimestamp
        delete args.toTimestamp

        const from = new Date(fromTimestamp)
        const to = new Date(toTimestamp)
        let items = items.find(o => o.timestamp >= from && o.timestamp >= to)
      }

      return items.find(args).value()
    },
    dishes(_, args) {
      return db.get(config.tables.dishes).find(args)
    },
    dishTypes(_, args) {
      return db.get(config.tables.dishTypes).find(args)
    },
    dishExtras(_, args) {
      return db.get(config.tables.dishExtras).find(args)
    },
    company(_, _) {
      return config.COMPANY
    }
  },
  Mutation: {
    addOrder(_, args) {
      const newOrder = getOrder(args)
      db.get(config.tables.orders).push(newOrder).write()
      return newOrder
    },
    addDish(_, args) {
      const newDish = getDish(args)
      db.get(config.tables.dishes).push(newDish).write()
      return newDish
    },
    updateDish(_, args) {
      const id = args._id
      delete args._id

      return db.get(config.tables.dishes)
        .find({_id: id})
        .assign(args)
        .write()
        .find((d) => d._id === id)
    },
    removeDish(_, args) {
      var orders = db.get(config.tables.orders).find({"dishes.id": args._id}).value()

      orders.forEach(o => {
        db.get(config.tables.orders).find({_id: o._id}).assign({...o, dishes: o.dishes.filter(d => d.id != args._id)}).write()
      })

      var dish = db.get(config.tables.dishes).find(args).value()
      db.get(config.tables.dishes).remove(args).write()

      return dish
    },
    addDishType(_, args) {
      const newDishType = getDishType(args)
      db.get(config.tables.dishTypes).push(newDishType).write()
      return newDishType
    },
    updateDishType(_, args) {
      const id = args._id
      delete args._id
      return new Promise((resolve, reject) => {
        DishType.updateOne({
          _id: id
        }, {
          name: args.name
        })
          .then(r => {
            DishType.findOne({
              _id: id
            })
              .then(resolve)
              .catch(reject)
          }).catch(reject)
      })
    },
    removeDishType(_, args) {
      return new Promise((res, rej) => {
        Dish.find({
          type: args._id
        }).then(r => {
          if (r.length > 0) {
            rej("Some dishes with this dish type still exist. Remove those dishes first, before removing the dish type.")
            return
          }

          DishType.findOneAndRemove({
            _id: args._id
          }, {useFindAndModify: false}).then(res).catch(rej)
        }).catch(rej)
      })
    },
    addDishExtra(_, args) {
      const newDishExtra = getDishExtra(args)
      db.get(config.tables.dishExtras).push(newDishExtra).write()
      return newDishExtra
    },
    updateDishExtra(_, args) {
      const id = args._id
      delete args._id

      return new Promise((resolve, reject) => {
        DishExtra.updateOne({
          _id: id
        }, args
        ).then(r => {
          DishExtra.findOne({
            _id: id
          })
            .then(resolve)
            .catch(reject)
        }).catch(reject)
      })
    },
    removeDishExtra(_, args) {
      return new Promise((res, rej) => {
        Order.find({
          "dishes.extras.id": args._id
        }).then(result => {
          result.forEach(o => {
            Order.updateOne({
              _id: o._id
            }, {
              $set: {
                dishes: o.dishes.map(d => {
                  d.extras = d.extras.filter(e => e !== args._id)
                  return d;
                })
              }
            })
              .then(console.info)
              .catch(console.error)
          })

          DishExtra.findOneAndRemove({
            _id: args._id
          }, {useFindAndModify: false}).then(res).catch(rej)
        })
      })
    },
    updateOrder(_, args) {
      const id = args._id
      delete args._id
      return new Promise((resolve, reject) => {
        if (args.dishes) {
          args.hasPayed = args.dishes.length === 0 ? (!args.name && !args.table && !args.notes ? true : false) : args.dishes.every(d => d.hasPayed)
        }

        const amountPayed = args.amountPayed || 0
        delete args.amountPayed

        Order.updateOne({
          _id: id
        }, {
          $set: args,
          $inc: {amountPayed: amountPayed}
        }).then(r => {
          Order.findOne({
            _id: id
          })
            .then(resolve)
            .catch(reject) //TODO: Rollback here!!
        }).catch(reject)
      })
    },
    joinOrders(_, args) {
      const id = args._id
      delete args._id
      const allIds = args.orderIds.concat([id]);
      return new Promise((resolve, reject) => {
        Order.find({
          _id: {
            $in: allIds
          }
        }).then(r => {
          Order.updateOne({
            _id: id
          }, {
            dishes: [].concat.apply([], r.map(m => m.dishes))
          }).then(r => {
            Order.remove({
              _id: {
                $in: args.orderIds
              }
            }).then(r => {
              Order.findOne({
                _id: id
              }).then(resolve).catch(reject) //TODO: Rollback here!!
            }).catch(reject)
          }).catch(reject)
        }).catch(reject)
      })
    }
  },
  Dish: {
    type(dish) {
      return DishType.findOne({
        _id: dish.type
      })
    },
    deselectedExtras(dish) {
      return new Promise((resolve, reject) => {
        DishExtra.find({
          _id: {
            "$in": dish.deselectedExtras.map(d => d)
          }
        }).then(result => {
          resolve(dish.deselectedExtras.map(e => result.find(r => r._id.equals(e))))
        }).catch(e => reject(e))

      })
    }
  },
  OrderDish: {
    dish(orderDish) {
      return Dish.findOne({
        _id: orderDish.id
      })
    },
    extras(orderDish) {
      return new Promise((resolve, reject) => {
        DishExtra.find({
          _id: {
            "$in": orderDish.extras.map(d => d)
          }
        }).then(result => {
          resolve(orderDish.extras.map(e => result.find(r => r._id.equals(e))))
        }).catch(e => reject(e))

      })
    }
  },
  Order: {
    dishes(order) {
      return order.dishes
    }
  },
  DishExtra: {
    type(extra) {
      return DishType.findOne({
        _id: extra.type
      })
    }
  }
};

export default resolvers;