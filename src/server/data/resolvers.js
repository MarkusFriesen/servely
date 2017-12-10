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
      console.warn(args)
      DishType.find(args, (error, result) => {
        console.warn(error, result)
      })
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