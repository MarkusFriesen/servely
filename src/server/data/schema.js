import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
type DishType {
  _id: ID
  name: String!
}
type Dish {
  _id: ID
  name: String!
  cost: Float!
  type: DishType!
  description: String
}
type OrderDish {
  dish: Dish!
  made: Boolean
}
type Order {
  _id: ID
  table: Int!
  name: String
  timestamp: String!
  dishes: [OrderDish]
  hasPayed: Boolean
  amountPayed: Float
  notes: String
}
type Query {
  orders(_id:ID, table: Int, name: String, hasPayed: Boolean): [Order]
  dishes(_id:ID, name:String): [Dish]
  dishTypes(_id:ID, name:String): [DishType]
}
input orderDishMutation {
  id: ID!
  made: Boolean
}
input dishTypeMutation {
  _id: ID!
}
type Mutation {
  addOrder(table: Int!, name:String, dishes: [orderDishMutation]!, notes: String): Order
  addDish(name: String!, cost: Float!, type: ID!, description: String): Dish
  addDishType(name: String!): DishType
  updateOrder(_id: ID!, name: String, dishes:[orderDishMutation], notes: String, hasPayed: Boolean, amountPayed: Float): Order
  updateDish(_id: ID!, name:String, cost: Float, type: dishTypeMutation, description: String): Dish

}
schema {
  query: Query
  mutation: Mutation
}
`;

export default makeExecutableSchema({ typeDefs, resolvers });