import { Order, Dish, DishType } from "./Models"

const resolvers = {
  Query: {
    order(root, args) {
        return Order.find(args)
    },
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