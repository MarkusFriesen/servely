import { Order, Dish, DishType } from "./Models"

const resolvers = {
  Query: {
    order(root, args) {
        return Order.find(args)
    },
    dish(root, args){
      return Dish.find(args)
    },
    dishType(root, args){
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