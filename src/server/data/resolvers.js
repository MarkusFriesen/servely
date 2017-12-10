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