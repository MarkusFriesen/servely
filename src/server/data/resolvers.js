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
    addDishType(_, args){
      return DishType.create(args)
    },
    updateOrder(_, args){
      return new Promise((resolve, reject) => {
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