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
  dish: Dish
  made: Boolean
}
type Order {
  _id: ID
  table: Int
  name: String
  timestamp: String!
  dishes: [OrderDish]
  hasPayed: Boolean
  amountPayed: Float
  notes: String
}
type Query {
  order(table: Int, name: String, hasPayed: Boolean): [Order]
}
`;

export default makeExecutableSchema({ typeDefs, resolvers });