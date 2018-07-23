import { Order, Dish, DishType } from "./Models"

const resolvers = {
  Query: {
    orders(_, args) {
      return Order.find(args)
    },
    dishes(_, args){
      return Dish.find(args)
    },
    dishTypes(_, args){
      return DishType.find(args)
    }
  },
  Mutation: {
    addOrder(_, args){
      return Order.create(args)
    },
    addDish(_, args){
      return Dish.create(args)
    },
    updateDish(_, args){
      return new Promise((resolve, reject) => {
        Dish.update({ _id: args._id }, args, (e, r) => {
          if (e)
            reject(e)
          Dish.findOne({_id: args._id}, (e, r) => {
            if (e)
              reject(e)
            resolve(r)
          })
        })
      })
    },
    removeDish(_, args){
      return Dish.findOneAndRemove({_id: args._id})
    },
    addDishType(_, args){
      return DishType.create(args)
    },
    updateDishType(_, args) {
      return new Promise((resolve, reject) => {
        DishType.update({ _id: args._id }, { name: args.name }, (e, r) => {
          if (e)
            reject(e)
          DishType.findOne({_id: args._id}, (e, r) => {
            if (e)
              reject(e)
            resolve(r)
          })
        })
      })
    },
    removeDishType(_, args) {
      return DishType.findOneAndRemove({_id: args._id})
    },
    updateOrder(_, args){
      return new Promise((resolve, reject) => {

        if (args.dishes){
          args.hasPayed = args.dishes.every(d => d.hasPayed)
        }

        Order.update({ _id: args._id }, args, (err, result) => {
          if (err)
            reject(err)

          Order.findOne({_id: args._id}, (e, r) => {
            if (e) //TODO: Rollback here!!
              reject(e)
            resolve(r)
          })
        })
      })
    },
    joinOrders(_, args){
      const allIds = args.orderIds.concat([args._id]);
      return new Promise((resolve, reject) => {
        Order.find({_id: {$in: allIds}}, (e, r) => {
          if (e)
            reject(e)
          else 
            Order.update({
                  _id: args._id
                }, {
                  dishes: [].concat.apply([], r.map(m => m.dishes))
                }, ((e, r) => {
              if (e)
                reject(e)
              else
                Order.remove({_id: {$in: args.orderIds} }, (e, r) => {
                  if (e)
                    reject(e)
                  else
                    Order.findOne({_id: args._id}, (e, r) => {
                      if (e) //TODO: Rollback here!!
                        reject(e)
                      resolve(r)
                    })
                })
            }))
        })
      })
    }
  },
  Dish: {
    type(dish) {
      return DishType.findOne({ _id: dish.type })
    },
  },
  OrderDish: {
    dish(orderDish) {
      return Dish.findOne({ _id: orderDish.id })
    },
  },
  Order: {
    dishes(order){
      return order.dishes
    }
  }
};

export default resolvers;