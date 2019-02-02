import { gql } from 'apollo-server-express';

const typeDefs = gql`
type DishType {
  _id: ID
  name: String!
}
type Dish {
  _id: ID
  name: String!
  cost: Float!
  type: DishType!
}
type OrderDish {
  dish: Dish!
  made: Boolean
  hasPayed: Boolean
}
type Order {
  _id: ID
  table: Int!
  name: String
  timestamp: String!
  dishes: [OrderDish]
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
  hasPayed: Boolean
}
type Mutation {
  addOrder(table: Int!, name:String, dishes: [orderDishMutation]!, notes: String): Order
  updateOrder(_id: ID!, name: String, table: Int, dishes: [orderDishMutation], notes: String): Order
  joinOrders(_id: ID!, orderIds: [ID]!) : Order
  addDish(name: String!, cost: Float!, type: ID!): Dish
  updateDish(_id: ID!, name:String, cost: Float, type: ID): Dish
  removeDish(_id: ID!) : Dish
  addDishType(name: String!): DishType
  updateDishType(_id: ID!, name: String!): DishType
  removeDishType(_id: ID!): DishType
}
schema {
  query: Query
  mutation: Mutation
}
`;

export default typeDefs;