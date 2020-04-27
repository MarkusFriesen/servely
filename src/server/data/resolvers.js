import {
  createOrder,
  createDish,
  createDishType,
  createDishExtra
} from './Models'
import config from '../config'

const getQueries = (db) => ({
  async orders(_, args) {
    const minTimestamp = new Date(-8640000000000000).toISOString()
    const maxTimestamp = new Date().toISOString()

    const {
      fromTimestamp = minTimestamp,
      toTimestamp = maxTimestamp
    } = args

    delete args.fromTimestamp
    delete args.toTimestamp

    const items = await db.get(config.tables.orders).filter(args).value()

    if (fromTimestamp !== minTimestamp || toTimestamp !== maxTimestamp) {
      const from = new Date(fromTimestamp).toISOString()
      const to = new Date(toTimestamp).toISOString()
      
      return items.filter(o => o.timestamp && o.timestamp >= from && o.timestamp <= to)
    }

    return items

  },
  dishes(_, args) {
    return db.get(config.tables.dishes).filter(args).value()
  },
  dishTypes(_, args) {
    return db.get(config.tables.dishTypes).filter(args).value()
  },
  dishExtras(_, args) {
    return db.get(config.tables.dishExtras).filter(args).value()
  },
  company(_, args) {
    return config.COMPANY
  }
})

const getMutations = (db) => ({
  addOrder(_, args) {
    const newOrder = createOrder(args)
    db.get(config.tables.orders).push(newOrder).write()
    return newOrder
  }, 
  async updateOrder(_, args) {
    const id = args._id

    if (args.dishes) {
      args.hasPayed = args.dishes.length === 0 ? (!args.name && !args.table && !args.notes ? true : false) : args.dishes.every(d => d.hasPayed)
    }

    const amountPayed = args.amountPayed || 0

    const order = await db.get(config.tables.orders).find({_id: id}).value()
    return db.get(config.tables.orders).find({_id: id}).assign({
      ...order,
      ...args,
      amountPayed: order.amountPayed + amountPayed
    }).write()
  },
  async joinOrders(_, args) {
    const allIds = args.orderIds.concat([args._id]);

    const orders = await db.get(config.tables.orders).filter(o => allIds.includes(o._id)).value()
    const order = orders.find(o => o._id === args._id)

    const allDishes = orders.map(o => o.dishes).flat()

    const result = await db.get(config.tables.orders).find({_id: args._id}).assign({
      ...order,
      dishes: allDishes
    }).write()

    await db.get(config.tables.orders).remove(o => args.orderIds.includes(o._id)).write()

    return result
  },
  addDish(_, args) {
    const newDish = createDish(args)
    db.get(config.tables.dishes).push(newDish).write()
    return newDish
  },
  updateDish(_, args) {
    const id = args._id

    return db.get(config.tables.dishes)
      .find({_id: id})
      .assign(args)
      .write()
  },
  async removeDish(_, args) {
    var orders = await db.get(config.tables.orders).filter(o => o.dishes.some(d => d.id === args._id)).value()

    orders.forEach(o => {
      db.get(config.tables.orders).find({_id: o._id}).assign({...o, dishes: o.dishes.filter(d => d.id != args._id)}).write()
    })

    return await db.get(config.tables.dishes).remove(args).write()
  },
  async addDishType(_, args) {
    const newDishType = createDishType(args)
    await db.get(config.tables.dishTypes).push(newDishType).write()
    return newDishType
  },
  updateDishType(_, args) {
    const id = args._id

    return db.get(config.tables.dishTypes)
      .find({_id: id})
      .assign(args)
      .write()
  },
  removeDishType(_, args) {
    return new Promise(async (res, rej) => {
      var dishes = await db.get(config.tables.dishes).find({type: args._id}).value()
      if (dishes) {
        rej("Some dishes with this dish type still exist. Remove those dishes first, before removing the dish type.")
        return
      }

      const removedITems = await db.get(config.tables.dishTypes).remove(args).write()
      res(removedITems)
    })
  },
  async addDishExtra(_, args) {
    const newDishExtra = createDishExtra(args)
    await db.get(config.tables.dishExtras).push(newDishExtra).write()
    return newDishExtra
  },
  updateDishExtra(_, args) {
    const id = args._id

    return db.get(config.tables.dishExtras)
      .find({_id: id})
      .assign(args)
      .write()
  },
  async removeDishExtra(_, args) {
    const orders = await db.get(config.tables.orders).filter(o => o.dishes.some(d => d.extras.some(e => e === args._id))).value()

    orders.forEach(async o => {
      await db.get(config.tables.orders)
        .find({_id: o._id})
        .assign({
          ...o, dishes: o.dishes.map(d => (
            {
              ...d,
              extras: d.extras.filter(e => e !== args._id)
            }))
        })
        .write()
    })

    return await db.get(config.tables.dishExtras).remove(args).write()
  }
})

const getResolvers = (db) => (
  {
    Query: getQueries(db),
    Mutation: getMutations(db),
    Dish: {
      type(dish) {
        return db.get(config.tables.dishTypes).find({_id: dish.type}).value()
      },
      deselectedExtras(dish) {
        return db.get(config.tables.dishExtras).filter(d => (dish.deselectedExtras || []).includes(d._id)).value()
      }
    },
    OrderDish: {
      dish(orderDish) {
        return db.get(config.tables.dishes).find({_id: orderDish.id}).value()
      },
      extras(orderDish) {
        return db.get(config.tables.dishExtras).filter(d => (orderDish.extras || []).includes(d._id)).value()
      }
    },
    Order: {
      dishes(order) {
        return order.dishes
      }
    },
    DishExtra: {
      type(extra) {
        return db.get(config.tables.dishTypes).find({_id: extra.type}).value()
      }
    }
  }
)

export {
  getResolvers
}